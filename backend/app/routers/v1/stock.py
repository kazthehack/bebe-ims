from __future__ import annotations

from datetime import datetime
import re

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.controllers.filament import Filament
from app.controllers.filament_active import FilamentActive
from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product import Product
from app.controllers.product_recipe_part import ProductRecipePart
from app.controllers.product_variant import ProductVariant
from app.controllers.product_stock import ProductStock
from app.controllers.site import Site
from app.controllers.supply_brand import SupplyBrand
from app.controllers.supply import Supply
from app.domain.enums import InventoryAdjustmentType, StockTargetType, SupplyType
from app.domain.permissions import require_permission
from app.domain.inventory_workbook_export import export_inventory_workbook_bytes, find_inventory_workbook
from app.domain.record_mapper import StoredRecord, map_record
from app.models.filament import FilamentDocument
from app.models.filament_active import FilamentActiveDocument
from app.models.inventory_adjustment import InventoryAdjustmentDocument
from app.models.product import ProductDocument
from app.models.product_recipe_part import ProductRecipePartDocument
from app.models.product_variant import ProductVariantDocument
from app.models.product_stock import ProductStockDocument
from app.models.site import SiteDocument
from app.models.supply import SupplyDocument
from app.models.supply_brand import SupplyBrandDocument
from app.schemas.stock import (
    FilamentCreate,
    FilamentActiveCreate,
    FilamentActiveListResponse,
    FilamentActiveRead,
    FilamentActiveUpdate,
    FilamentVariantAssociationListResponse,
    FilamentVariantAssociationRead,
    FilamentListResponse,
    FilamentRead,
    InventoryDispatchCreate,
    InventoryDispatchRead,
    InventoryGlobalAdjustCreate,
    InventoryGlobalAdjustRead,
    InventorySiteWriteoffCreate,
    InventorySiteWriteoffRead,
    InventoryReceiveCreate,
    InventoryReceiveRead,
    InventoryAdjustmentCreate,
    InventoryAdjustmentListResponse,
    InventoryAdjustmentRead,
    InventoryGlobalItemRead,
    InventoryGlobalListResponse,
    InventorySiteItemRead,
    InventorySiteListResponse,
    InventorySiteStockRead,
    InventoryTransferCreate,
    InventoryTransferRead,
    InventoryVariantDetailRead,
    ProductStockCreate,
    ProductStockListResponse,
    ProductStockRead,
    SupplyCreate,
    SupplyBrandCreate,
    SupplyBrandListResponse,
    SupplyBrandRead,
    SupplyListResponse,
    SupplyRead,
    SupplyUpdate,
)

router = APIRouter(prefix='/stock', tags=['stock'])

product_stock_controller = ProductStock()
supply_controller = Supply()
filament_controller = Filament()
filament_active_controller = FilamentActive()
adjustment_controller = InventoryAdjustment()
variant_controller = ProductVariant()
product_controller = Product()
recipe_part_controller = ProductRecipePart()
brand_controller = SupplyBrand()
site_controller = Site()

GLOBAL_SITE_ID = 'global'
MAIN_SITE_ID = 'main'
VALID_FSN_VALUES = {'fast', 'normal', 'slow', 'non_moving'}


def _paginate(items: list, page: int | None, page_size: int | None) -> tuple[list, int]:
    total = len(items)
    if page is None or page_size is None:
        return items, total
    start = (page - 1) * page_size
    return items[start:start + page_size], total


def _contains_query(values: list[object], query: str | None) -> bool:
    normalized = str(query or '').strip().casefold()
    if not normalized:
        return True
    return normalized in ' '.join(str(value or '') for value in values).casefold()


def _selected_values(value: str | None) -> set[str]:
    return {
        item.strip().casefold()
        for item in str(value or '').split(',')
        if item.strip()
    }


def _available(qty_on_hand: float, qty_reserved: float) -> float:
    return float(qty_on_hand or 0) - float(qty_reserved or 0)


def _inventory_id_for_variant(variant_id: str) -> str:
    return f'inv-{variant_id}'


def _variant_id_from_inventory_id(inventory_id: str) -> str:
    if inventory_id.startswith('inv-') and len(inventory_id) > 4:
        return inventory_id[4:]
    return inventory_id


def _normalize_supply_type(
    value: str | None,
    *,
    cost_per_kilo: float = 0.0,
    cost_per_piece: float = 0.0,
) -> SupplyType:
    raw = str(value or '').strip().lower()
    if raw in ('consumable', SupplyType.CONSUMABLE.value):
        return SupplyType.CONSUMABLE
    if raw in ('filament', SupplyType.FILAMENT.value):
        return SupplyType.FILAMENT
    if float(cost_per_piece or 0) > 0 and float(cost_per_kilo or 0) <= 0:
        return SupplyType.CONSUMABLE
    return SupplyType.FILAMENT


def _normalize_brand_id(value: str | None) -> str:
    base = re.sub(r'\s+', ' ', str(value or '').strip().lower())
    slug = re.sub(r'[^a-z0-9 -]', '', base).replace(' ', '-')
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug


def _normalize_fsn(value: str | None, fallback: str = 'normal') -> str:
    normalized = str(value or '').strip().lower()
    if normalized in VALID_FSN_VALUES:
        return normalized
    return fallback


def _apply_price_tier_threshold_cap(threshold_per_site: float, list_price: float) -> float:
    price = float(list_price or 0)
    threshold = float(threshold_per_site or 0)
    if price >= 300:
        return min(threshold, 1.0)
    if price >= 250:
        return min(threshold, 2.0)
    return threshold


def _to_whole_units(value: float) -> float:
    return float(max(0, int(round(value))))


def _effective_variant_thresholds_for_product(
    variants: list[StoredRecord[ProductVariantDocument]],
    product_threshold_per_site: float,
    product_list_price: float,
) -> dict[str, float]:
    if not variants:
        return {}
    explicit_sum = float(sum(
        _to_whole_units(float(variant.payload.capacity_threshold_per_site or 0))
        for variant in variants
        if variant.payload.capacity_threshold_per_site is not None
    ))
    unresolved_count = max(0, len(variants) - sum(
        1 for variant in variants if variant.payload.capacity_threshold_per_site is not None
    ))
    remaining = float(product_threshold_per_site - explicit_sum)
    whole_remaining = int(round(max(0.0, remaining)))
    base_share = int(whole_remaining / unresolved_count) if unresolved_count > 0 else 0
    remainder = whole_remaining - (base_share * unresolved_count)
    unresolved_ids = [
        variant.object_id
        for variant in sorted(variants, key=lambda item: item.object_id)
        if variant.payload.capacity_threshold_per_site is None
    ]
    unresolved_rank = {variant_id: index for index, variant_id in enumerate(unresolved_ids)}
    computed: dict[str, float] = {}
    for variant in variants:
        if variant.payload.capacity_threshold_per_site is not None:
            raw = _to_whole_units(float(variant.payload.capacity_threshold_per_site))
        else:
            rank = unresolved_rank.get(variant.object_id, 0)
            bonus = 1 if rank < remainder else 0
            raw = float(base_share + bonus)
        computed[variant.object_id] = _to_whole_units(_apply_price_tier_threshold_cap(raw, product_list_price))
    return computed


def _normalize_brand_display(value: str | None) -> str:
    cleaned = re.sub(r'\s+', ' ', str(value or '').strip())
    if not cleaned:
        return ''
    return ' '.join(part[:1].upper() + part[1:].lower() for part in cleaned.split(' '))


def _to_brand(record: StoredRecord[SupplyBrandDocument]) -> SupplyBrandRead:
    return SupplyBrandRead(id=record.object_id, display_name=record.payload.display_name)


def _ensure_brand(tenant_id: str, raw_value: str | None) -> str | None:
    normalized_id = _normalize_brand_id(raw_value)
    if not normalized_id:
        return None
    existing = next(
        (
            map_record(record, SupplyBrandDocument)
            for record in brand_controller.list(tenant_id)
            if record.get('object_id') == normalized_id
        ),
        None,
    )
    if existing:
        return existing.payload.display_name
    display_name = _normalize_brand_display(raw_value)
    if not display_name:
        return None
    brand_controller.update(normalized_id, tenant_id, {
        'id': normalized_id,
        'display_name': display_name,
    })
    return display_name


def _to_stock(record: StoredRecord[ProductStockDocument]) -> ProductStockRead:
    qty_on_hand = float(record.payload.qty_on_hand or 0)
    qty_reserved = float(record.payload.qty_reserved or 0)
    return ProductStockRead(
        id=record.object_id,
        product_variant_id=record.payload.product_variant_id,
        site_id=record.payload.site_id,
        qty_on_hand=qty_on_hand,
        qty_reserved=qty_reserved,
        qty_available=_available(qty_on_hand, qty_reserved),
        low_stock_threshold=float(record.payload.low_stock_threshold or 0),
    )


def _is_global_site(site_id: str | None) -> bool:
    normalized = str(site_id or '').strip().lower()
    return normalized == GLOBAL_SITE_ID


def _is_main_site(site_id: str | None) -> bool:
    normalized = str(site_id or '').strip().lower()
    return normalized in (MAIN_SITE_ID, 'storage')


def _site_bucket(site_id: str | None) -> str:
    normalized = str(site_id or '').strip().lower()
    compact = ''.join(char for char in normalized if char.isalnum())
    if _is_global_site(normalized):
        return 'global'
    if _is_main_site(normalized):
        return 'storage'
    if compact in ('site1', 'site001', 'primary', 'primarya', 'a'):
        return 'primary'
    if compact in ('site2', 'site002', 'secondary', 'secondaryb', 'b'):
        return 'secondary'
    if compact in ('site3', 'site003', 'tertiary', 'tertiaryc', 'c'):
        return 'tertiary'
    return 'other'


def _variant_maps(tenant_id: str) -> tuple[dict[str, StoredRecord[ProductVariantDocument]], dict[str, StoredRecord[ProductDocument]]]:
    variants = {
        variant.object_id: variant
        for variant in (
            map_record(record, ProductVariantDocument)
            for record in variant_controller.list(tenant_id)
        )
    }
    products = {
        product.object_id: product
        for product in (
            map_record(record, ProductDocument)
            for record in product_controller.list(tenant_id)
        )
    }
    return variants, products


def _find_product_stock_record(
    tenant_id: str,
    product_variant_id: str,
    site_id: str,
) -> StoredRecord[ProductStockDocument] | None:
    records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    for record in records:
        if record.payload.product_variant_id == product_variant_id and record.payload.site_id == site_id:
            return record
    return None


def _upsert_product_stock_qty(
    tenant_id: str,
    product_variant_id: str,
    site_id: str,
    qty_delta: float,
) -> StoredRecord[ProductStockDocument]:
    existing = _find_product_stock_record(tenant_id, product_variant_id, site_id)
    if existing:
        next_qty = float(existing.payload.qty_on_hand or 0) + float(qty_delta or 0)
        update_payload = existing.payload.model_dump(exclude_none=True)
        update_payload['qty_on_hand'] = next_qty
        update_payload['qty_reserved'] = float(update_payload.get('qty_reserved') or 0)
        updated = map_record(
            product_stock_controller.update(existing.object_id, tenant_id, update_payload),
            ProductStockDocument,
        )
        return updated
    created = map_record(
        product_stock_controller.create(tenant_id, {
            'product_variant_id': product_variant_id,
            'site_id': site_id,
            'qty_on_hand': float(qty_delta or 0),
            'qty_reserved': 0.0,
            'low_stock_threshold': 0.0,
        }),
        ProductStockDocument,
    )
    return created


def _find_global_product_stock_record(
    tenant_id: str,
    product_variant_id: str,
) -> StoredRecord[ProductStockDocument] | None:
    return _find_product_stock_record(tenant_id, product_variant_id, GLOBAL_SITE_ID)


def _upsert_global_product_stock_qty(
    tenant_id: str,
    product_variant_id: str,
    qty_delta: float,
) -> StoredRecord[ProductStockDocument]:
    return _upsert_product_stock_qty(tenant_id, product_variant_id, GLOBAL_SITE_ID, qty_delta)


def _record_inventory_adjustment(
    tenant_id: str,
    stock_record_id: str,
    site_id: str,
    adjustment_type: InventoryAdjustmentType,
    qty_delta: float,
    notes: str | None = None,
) -> None:
    adjustment_controller.create(tenant_id, {
        'target_type': StockTargetType.PRODUCT_STOCK.value,
        'target_id': stock_record_id,
        'site_id': site_id,
        'adjustment_type': adjustment_type.value,
        'qty_delta': float(qty_delta or 0),
        'notes': notes,
    })


def _validate_site_or_main(site_id: str, tenant_id: str) -> None:
    if _is_main_site(site_id):
        return
    site = map_record(site_controller.get(site_id, tenant_id), SiteDocument)
    if not site.payload.active:
        raise HTTPException(status_code=409, detail=f'Site {site_id} is inactive.')


def _to_supply(record: StoredRecord[SupplyDocument]) -> SupplyRead:
    qty_on_hand = float(record.payload.qty_on_hand or 0)
    qty_reserved = float(record.payload.qty_reserved or 0)
    grams_on_hand = float(record.payload.grams_on_hand or 0)
    grams_reserved = float(record.payload.grams_reserved or 0)
    cost_per_kilo = float(record.payload.cost_per_kilo or 0)
    cost_per_piece = float(record.payload.cost_per_piece or 0)
    supply_type = _normalize_supply_type(
        record.payload.supply_type,
        cost_per_kilo=cost_per_kilo,
        cost_per_piece=cost_per_piece,
    )
    # Backward compatibility: old records used qty fields to store filament grams.
    if supply_type == SupplyType.FILAMENT and grams_on_hand == 0 and qty_on_hand > 0:
        grams_on_hand = qty_on_hand
        grams_reserved = qty_reserved
    pieces_per_pack = float(record.payload.pieces_per_pack or 1)
    cost_per_pack_min = float(record.payload.cost_per_pack_min or 0)
    cost_per_pack_max = float(record.payload.cost_per_pack_max or 0)
    cost_per_pack = float(record.payload.cost_per_pack or 0)
    if cost_per_pack <= 0 and (cost_per_pack_min > 0 or cost_per_pack_max > 0):
        cost_per_pack = (cost_per_pack_min + cost_per_pack_max) / 2.0
    if cost_per_piece <= 0 and cost_per_pack > 0 and pieces_per_pack > 0:
        cost_per_piece = cost_per_pack / pieces_per_pack
    if cost_per_kilo <= 0 and cost_per_piece > 0 and supply_type == SupplyType.FILAMENT:
        cost_per_kilo = cost_per_piece * 1000
    cost_per_gram = (cost_per_kilo / 1000.0) if cost_per_kilo > 0 else 0.0
    return SupplyRead(
        id=record.object_id,
        name=record.payload.name,
        supply_type=supply_type,
        brand=record.payload.brand,
        material_type=record.payload.material_type,
        sub_type=record.payload.sub_type,
        color=record.payload.color,
        stock_spools=float(record.payload.stock_spools or 0),
        spool_weight_grams=float(record.payload.spool_weight_grams or 1000),
        estimated_remaining_weight_grams=float(record.payload.estimated_remaining_weight_grams or 0),
        source_url=record.payload.source_url,
        pieces_per_pack=pieces_per_pack,
        cost_per_pack_min=cost_per_pack_min,
        cost_per_pack_max=cost_per_pack_max,
        cost_per_pack=cost_per_pack,
        cost_per_kilo=cost_per_kilo,
        cost_per_gram=cost_per_gram,
        cost_per_piece=cost_per_piece,
        qty_on_hand=qty_on_hand,
        qty_reserved=qty_reserved,
        qty_available=_available(qty_on_hand, qty_reserved),
        grams_on_hand=grams_on_hand,
        grams_reserved=grams_reserved,
        grams_available=_available(grams_on_hand, grams_reserved),
    )


def _to_filament(record: StoredRecord[FilamentDocument]) -> FilamentRead:
    current_grams = float(record.payload.current_grams or 0)
    reserved_grams = float(record.payload.reserved_grams or 0)
    return FilamentRead(
        id=record.object_id,
        brand=record.payload.brand,
        color=record.payload.color,
        current_grams=current_grams,
        reserved_grams=reserved_grams,
        available_grams=_available(current_grams, reserved_grams),
    )


def _to_filament_active(record: StoredRecord[FilamentActiveDocument]) -> FilamentActiveRead:
    return FilamentActiveRead(
        id=record.object_id,
        filament_id=record.payload.filament_id,
        grams_remaining=float(record.payload.grams_remaining or 0),
        notes=record.payload.notes,
        status=record.payload.status or 'active',
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _to_adjustment(record: StoredRecord[InventoryAdjustmentDocument]) -> InventoryAdjustmentRead:
    return InventoryAdjustmentRead(
        id=record.object_id,
        target_type=record.payload.target_type,
        target_id=record.payload.target_id,
        site_id=record.payload.site_id,
        adjustment_type=record.payload.adjustment_type,
        qty_delta=float(record.payload.qty_delta or 0),
        notes=record.payload.notes,
        created_at=record.created_at,
    )


def _apply_adjustment(tenant_id: str, payload: InventoryAdjustmentCreate) -> None:
    if payload.target_type == StockTargetType.PRODUCT_STOCK:
        stock = map_record(product_stock_controller.get(payload.target_id, tenant_id), ProductStockDocument)
        updated_stock = stock.payload.model_copy(update={
            'qty_on_hand': float(stock.payload.qty_on_hand or 0) + float(payload.qty_delta),
        })
        product_stock_controller.update(payload.target_id, tenant_id, updated_stock.model_dump(exclude_none=True))
        return

    if payload.target_type == StockTargetType.SUPPLY:
        supply = map_record(supply_controller.get(payload.target_id, tenant_id), SupplyDocument)
        supply_type = _normalize_supply_type(
            supply.payload.supply_type,
            cost_per_kilo=float(supply.payload.cost_per_kilo or 0),
            cost_per_piece=float(supply.payload.cost_per_piece or 0),
        )
        qty_delta = float(payload.qty_delta)
        if supply_type == SupplyType.FILAMENT:
            current_spools = float(supply.payload.stock_spools or 0)
            updated_supply = supply.payload.model_copy(update={
                'stock_spools': current_spools + qty_delta,
            })
        else:
            updated_supply = supply.payload.model_copy(update={
                'qty_on_hand': float(supply.payload.qty_on_hand or 0) + qty_delta,
            })
        supply_controller.update(payload.target_id, tenant_id, updated_supply.model_dump(exclude_none=True))
        return

    if payload.target_type == StockTargetType.FILAMENT:
        filament = map_record(filament_controller.get(payload.target_id, tenant_id), FilamentDocument)
        updated_filament = filament.payload.model_copy(update={
            'current_grams': float(filament.payload.current_grams or 0) + float(payload.qty_delta),
        })
        filament_controller.update(payload.target_id, tenant_id, updated_filament.model_dump(exclude_none=True))
        return

    raise HTTPException(status_code=400, detail='Unsupported adjustment target_type')


@router.get('/products', response_model=ProductStockListResponse)
def list_product_stock(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    product_variant_id: str | None = Query(default=None),
    site_id: str | None = Query(default=None),
) -> ProductStockListResponse:
    records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    items = [_to_stock(record) for record in records]
    if product_variant_id:
        items = [item for item in items if item.product_variant_id == product_variant_id]
    if site_id:
        items = [item for item in items if item.site_id == site_id]
    paged, total = _paginate(items, page, page_size)
    return ProductStockListResponse(items=paged, total=total, page=page, page_size=page_size)


@router.get('/inventory/global', response_model=InventoryGlobalListResponse)
def list_inventory_global(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    search: str | None = Query(default=None),
    product_line: str | None = Query(default=None),
    product_ids: str | None = Query(default=None),
    variant: str | None = Query(default=None),
    availability: str | None = Query(default=None),
    pipeline: bool = Query(default=False),
    active_site_count: int = Query(default=3, ge=0, le=50),
    needed_sort: str = Query(default='desc'),
) -> InventoryGlobalListResponse:
    selected_lines = _selected_values(product_line)
    selected_product_ids = _selected_values(product_ids)
    selected_variants = _selected_values(variant)
    selected_availability = _selected_values(availability)
    stock_records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    variant_by_id, product_by_id = _variant_maps(tenant_id)
    if selected_product_ids:
        variant_by_id = {
            variant_id: record
            for variant_id, record in variant_by_id.items()
            if str(record.payload.product_id or '').strip().casefold() in selected_product_ids
        }
    if selected_variants:
        variant_by_id = {
            variant_id: record
            for variant_id, record in variant_by_id.items()
            if str(record.payload.name or '').strip().casefold() in selected_variants
        }
    if selected_lines:
        matching_product_ids = {
            product_id
            for product_id, record in product_by_id.items()
            if str(record.payload.product_line_name or '').strip().casefold() in selected_lines
        }
        variant_by_id = {
            variant_id: record
            for variant_id, record in variant_by_id.items()
            if str(record.payload.product_id or '') in matching_product_ids
        }
    variants_by_product: dict[str, list[StoredRecord[ProductVariantDocument]]] = {}
    for variant in variant_by_id.values():
        product_id = str(variant.payload.product_id or '')
        if not product_id:
            continue
        variants_by_product.setdefault(product_id, []).append(variant)
    totals: dict[str, dict[str, float]] = {}
    for stock in stock_records:
        variant_id = stock.payload.product_variant_id
        entry = totals.setdefault(
            variant_id,
            {
                'global': 0.0,
                'main': 0.0,
                'sites': 0.0,
                'storage': 0.0,
                'primary': 0.0,
                'secondary': 0.0,
                'tertiary': 0.0,
                'other': 0.0,
            },
        )
        qty = float(stock.payload.qty_on_hand or 0)
        bucket = _site_bucket(stock.payload.site_id)
        if bucket == 'global':
            entry['global'] += qty
            continue
        entry[bucket] += qty
        if bucket == 'storage':
            entry['main'] += qty
        else:
            entry['sites'] += qty

    rows: list[InventoryGlobalItemRead] = []
    for variant_id, variant in variant_by_id.items():
        product = product_by_id.get(variant.payload.product_id)
        summed = totals.get(
            variant_id,
            {
                'global': 0.0,
                'main': 0.0,
                'sites': 0.0,
                'storage': 0.0,
                'primary': 0.0,
                'secondary': 0.0,
                'tertiary': 0.0,
                'other': 0.0,
            },
        )
        main_qty = float(summed['main'])
        sites_qty = float(summed['sites'])
        physical_total_qty = main_qty + sites_qty + float(summed['other'])
        master_qty = float(summed['global']) if float(summed['global']) > 0 else physical_total_qty
        primary_qty = float(summed['primary'])
        secondary_qty = float(summed['secondary'])
        tertiary_qty = float(summed['tertiary'])
        storage_qty = main_qty
        product_threshold = _to_whole_units(float(product.payload.capacity_threshold_per_site or 8.0)) if product else 8.0
        product_price = float(product.payload.list_price or 0) if product else 0.0
        product_variants = variants_by_product.get(str(variant.payload.product_id or ''), [])
        effective_thresholds = _effective_variant_thresholds_for_product(product_variants, product_threshold, product_price)
        variant_threshold = float(
            effective_thresholds.get(
                variant_id,
                variant.payload.capacity_threshold_per_site or product_threshold,
            ),
        )
        rows.append(InventoryGlobalItemRead(
            inventory_id=_inventory_id_for_variant(variant_id),
            product_variant_id=variant_id,
            sku=variant.payload.sku,
            variant_name=variant.payload.name,
            product_id=variant.payload.product_id,
            product_line_name=product.payload.product_line_name if product else None,
            product_name=product.payload.name if product else variant.payload.product_id,
            fsn=_normalize_fsn(
                variant.payload.fsn,
                _normalize_fsn(product.payload.fsn if product else None, 'normal'),
            ),
            capacity_threshold_per_site=product_threshold,
            variant_capacity_threshold_per_site=variant_threshold,
            main_qty_on_hand=main_qty,
            sites_qty_on_hand=sites_qty,
            master_qty_on_hand=master_qty,
            storage_qty_on_hand=storage_qty,
            primary_qty_on_hand=primary_qty,
            secondary_qty_on_hand=secondary_qty,
            tertiary_qty_on_hand=tertiary_qty,
        ))
    rows.sort(key=lambda item: (
        str(item.product_line_name or '').casefold(),
        str(item.product_name or '').casefold(),
        str(item.variant_name or item.sku or '').casefold(),
    ))
    product_line_options = sorted({item.product_line_name for item in rows if item.product_line_name})
    variant_options = sorted({item.variant_name for item in rows if item.variant_name})
    unfiltered_rows = list(rows)
    if search:
        rows = [
            item for item in rows
            if _contains_query([
                item.sku,
                item.variant_name,
                item.product_name,
                item.product_line_name,
                item.product_variant_id,
            ], search)
        ]
    if selected_availability and selected_availability != {'with-stock', 'zero-stock'}:
        rows = [
            item for item in rows
            if ('with-stock' in selected_availability and float(item.master_qty_on_hand or 0) > 0)
            or ('zero-stock' in selected_availability and float(item.master_qty_on_hand or 0) <= 0)
        ]
    if not rows and not any([search, selected_lines, selected_product_ids, selected_variants, selected_availability, pipeline]):
        rows = unfiltered_rows
    if pipeline:
        capacity_units = max(1, 1 + int(active_site_count or 0))
        grouped: dict[str, dict[str, object]] = {}
        fsn_rank = {'fast': 0, 'normal': 1, 'slow': 2, 'non_moving': 3}
        for item in rows:
            if str(item.fsn or 'normal') == 'non_moving':
                continue
            product_id = str(item.product_id or '')
            if not product_id:
                continue
            per_site_threshold = max(1.0, float(item.variant_capacity_threshold_per_site or item.capacity_threshold_per_site or 8.0))
            global_qty = max(0.0, float(item.master_qty_on_hand or 0))
            primary_qty = max(0.0, float(item.primary_qty_on_hand or 0))
            secondary_qty = max(0.0, float(item.secondary_qty_on_hand or 0))
            tertiary_qty = max(0.0, float(item.tertiary_qty_on_hand or 0))
            storage_qty = max(0.0, float(item.storage_qty_on_hand or 0))
            entry = grouped.setdefault(product_id, {
                'row_key': f'product-{product_id}',
                'inventory_id': item.inventory_id,
                'product_id': product_id,
                'product_line_name': item.product_line_name,
                'product_name': item.product_name,
                'fsn': str(item.fsn or 'normal'),
                'capacity_threshold_per_site': 0.0,
                'global_qty': 0.0,
                'storage_qty': 0.0,
                'primary_qty': 0.0,
                'secondary_qty': 0.0,
                'tertiary_qty': 0.0,
                'view_qty': 0.0,
                'needed_variant_count': 0,
            })
            entry['capacity_threshold_per_site'] = float(entry['capacity_threshold_per_site']) + per_site_threshold
            entry['global_qty'] = float(entry['global_qty']) + global_qty
            entry['storage_qty'] = float(entry['storage_qty']) + storage_qty
            entry['primary_qty'] = float(entry['primary_qty']) + primary_qty
            entry['secondary_qty'] = float(entry['secondary_qty']) + secondary_qty
            entry['tertiary_qty'] = float(entry['tertiary_qty']) + tertiary_qty
            entry['view_qty'] = float(entry['view_qty']) + global_qty
            entry['needed_variant_count'] = int(entry['needed_variant_count']) + 1
            if fsn_rank.get(str(item.fsn or 'normal'), 1) < fsn_rank.get(str(entry['fsn'] or 'normal'), 1):
                entry['fsn'] = str(item.fsn or 'normal')
        pipeline_rows: list[InventoryGlobalItemRead] = []
        for entry in grouped.values():
            threshold_per_site = max(1.0, float(entry['capacity_threshold_per_site'] or 1.0))
            target_qty = max(1.0, threshold_per_site * capacity_units)
            global_qty = max(0.0, float(entry['global_qty'] or 0.0))
            coverage = global_qty / target_qty
            status = 'critical' if global_qty < threshold_per_site else ('warning' if coverage < 0.6 else 'stable')
            if status == 'stable':
                continue
            pipeline_rows.append(InventoryGlobalItemRead(
                row_key=str(entry['row_key']),
                inventory_id=str(entry['inventory_id']),
                product_variant_id=str(entry['product_id']),
                sku=str(entry['product_id']),
                variant_name=f"{int(entry['needed_variant_count'])} variant{'s' if int(entry['needed_variant_count']) != 1 else ''}",
                product_id=str(entry['product_id']),
                product_line_name=str(entry['product_line_name'] or ''),
                product_name=str(entry['product_name'] or entry['product_id']),
                fsn=_normalize_fsn(str(entry['fsn'] or 'normal'), 'normal'),
                capacity_threshold_per_site=threshold_per_site,
                variant_capacity_threshold_per_site=threshold_per_site,
                main_qty_on_hand=global_qty,
                sites_qty_on_hand=0.0,
                master_qty_on_hand=global_qty,
                storage_qty_on_hand=float(entry['storage_qty'] or 0.0),
                primary_qty_on_hand=float(entry['primary_qty'] or 0.0),
                secondary_qty_on_hand=float(entry['secondary_qty'] or 0.0),
                tertiary_qty_on_hand=float(entry['tertiary_qty'] or 0.0),
                capacity_target=target_qty,
                global_qty=global_qty,
                storage_qty=float(entry['storage_qty'] or 0.0),
                primary_qty=float(entry['primary_qty'] or 0.0),
                secondary_qty=float(entry['secondary_qty'] or 0.0),
                tertiary_qty=float(entry['tertiary_qty'] or 0.0),
                view_qty=float(entry['view_qty'] or 0.0),
                needs_production_gap=max(0.0, target_qty - global_qty),
                needs_production_status=status,
                needed_variant_count=int(entry['needed_variant_count'] or 0),
            ))
        direction = 1 if needed_sort == 'asc' else -1
        pipeline_rows.sort(key=lambda item: (
            0 if item.needs_production_status == 'critical' else 1,
            direction * float(item.needs_production_gap or 0),
            str(item.product_line_name or '').casefold(),
            str(item.product_name or '').casefold(),
        ))
        rows = pipeline_rows
    paged, total = _paginate(rows, page, page_size)
    return InventoryGlobalListResponse(
        items=paged,
        total=total,
        page=page,
        page_size=page_size,
        product_line_options=product_line_options,
        variant_options=variant_options,
    )


@router.get('/inventory/export')
def export_inventory_workbook(tenant_id: str = Query('tenant-admin')) -> Response:
    workbook_path = find_inventory_workbook()
    if not workbook_path:
        raise HTTPException(status_code=404, detail='Inventory workbook template not found.')

    stock_records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    variant_by_id, product_by_id = _variant_maps(tenant_id)
    grouped_inventory: dict[tuple[str, str, str], dict[str, float]] = {}

    for stock in stock_records:
        variant = variant_by_id.get(stock.payload.product_variant_id)
        if not variant:
            continue
        product = product_by_id.get(variant.payload.product_id)
        if not product:
            continue
        line_name = str(product.payload.product_line_name or '').strip()
        product_name = str(product.payload.name or '').strip()
        variant_name = str(variant.payload.name or product_name).strip()
        if not line_name or not product_name or not variant_name:
            continue
        key = (
            line_name.casefold(),
            product_name.casefold(),
            variant_name.casefold(),
        )
        bucket = _site_bucket(stock.payload.site_id)
        qty_on_hand = float(stock.payload.qty_on_hand or 0)
        totals = grouped_inventory.setdefault(key, {
            'storage': 0.0,
            'site1': 0.0,
            'site2': 0.0,
            'site3': 0.0,
            'other': 0.0,
            'global': 0.0,
        })
        if bucket == 'primary':
            totals['site1'] += qty_on_hand
        elif bucket == 'secondary':
            totals['site2'] += qty_on_hand
        elif bucket == 'tertiary':
            totals['site3'] += qty_on_hand
        elif bucket == 'storage':
            totals['storage'] += qty_on_hand
        else:
            totals['other'] += qty_on_hand
        totals['global'] += qty_on_hand

    workbook_bytes = export_inventory_workbook_bytes(grouped_inventory, workbook_path)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    file_name = f'bebe_inventory_export_{timestamp}.xlsm'
    headers = {
        'Content-Disposition': f'attachment; filename="{file_name}"',
    }
    return Response(
        content=workbook_bytes,
        media_type='application/vnd.ms-excel.sheet.macroEnabled.12',
        headers=headers,
    )


@router.get('/inventory/sites/{site_id}', response_model=InventorySiteListResponse)
def list_inventory_by_site(
    site_id: str,
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    search: str | None = Query(default=None),
    product_line: str | None = Query(default=None),
    variant: str | None = Query(default=None),
    availability: str | None = Query(default=None),
) -> InventorySiteListResponse:
    stock_records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    variant_by_id, product_by_id = _variant_maps(tenant_id)
    rows: list[InventorySiteItemRead] = []
    for stock in stock_records:
        if stock.payload.site_id != site_id:
            continue
        variant = variant_by_id.get(stock.payload.product_variant_id)
        if not variant:
            continue
        product = product_by_id.get(variant.payload.product_id)
        qty_on_hand = float(stock.payload.qty_on_hand or 0)
        qty_reserved = float(stock.payload.qty_reserved or 0)
        rows.append(InventorySiteItemRead(
            inventory_id=_inventory_id_for_variant(variant.object_id),
            product_variant_id=variant.object_id,
            sku=variant.payload.sku,
            variant_name=variant.payload.name,
            product_id=variant.payload.product_id,
            product_line_name=product.payload.product_line_name if product else None,
            product_name=product.payload.name if product else variant.payload.product_id,
            qty_on_hand=qty_on_hand,
            qty_reserved=qty_reserved,
            qty_available=_available(qty_on_hand, qty_reserved),
        ))
    rows.sort(key=lambda item: (
        str(item.product_line_name or '').casefold(),
        str(item.product_name or '').casefold(),
        str(item.variant_name or item.sku or '').casefold(),
    ))
    if search:
        rows = [
            item for item in rows
            if _contains_query([
                item.sku,
                item.variant_name,
                item.product_name,
                item.product_line_name,
                item.product_variant_id,
            ], search)
        ]
    selected_lines = {value for value in str(product_line or '').split(',') if value}
    if selected_lines:
        rows = [item for item in rows if str(item.product_line_name or '') in selected_lines]
    selected_variants = {value for value in str(variant or '').split(',') if value}
    if selected_variants:
        rows = [item for item in rows if str(item.variant_name or '') in selected_variants]
    selected_availability = {value for value in str(availability or '').split(',') if value}
    if selected_availability and selected_availability != {'with-stock', 'zero-stock'}:
        rows = [
            item for item in rows
            if ('with-stock' in selected_availability and float(item.qty_on_hand or 0) > 0)
            or ('zero-stock' in selected_availability and float(item.qty_on_hand or 0) <= 0)
        ]
    paged, total = _paginate(rows, page, page_size)
    return InventorySiteListResponse(site_id=site_id, items=paged, total=total, page=page, page_size=page_size)


@router.get('/inventory/variants/{variant_id}', response_model=InventoryVariantDetailRead)
def get_inventory_variant_detail(variant_id: str, tenant_id: str = Query('tenant-admin')) -> InventoryVariantDetailRead:
    variant = map_record(variant_controller.get(variant_id, tenant_id), ProductVariantDocument)
    product = map_record(product_controller.get(variant.payload.product_id, tenant_id), ProductDocument)
    stock_records = [
        map_record(record, ProductStockDocument)
        for record in product_stock_controller.list(tenant_id)
        if str(record.get('payload', {}).get('product_variant_id') or '') == variant_id
    ]

    global_qty_on_hand = 0.0
    main_qty_on_hand = 0.0
    main_qty_reserved = 0.0
    site_stocks: list[InventorySiteStockRead] = []
    for stock in stock_records:
        qty_on_hand = float(stock.payload.qty_on_hand or 0)
        qty_reserved = float(stock.payload.qty_reserved or 0)
        if _is_global_site(stock.payload.site_id):
            global_qty_on_hand += qty_on_hand
            continue
        if _is_main_site(stock.payload.site_id):
            main_qty_on_hand += qty_on_hand
            main_qty_reserved += qty_reserved
            continue
        site_stocks.append(InventorySiteStockRead(
            site_id=stock.payload.site_id,
            qty_on_hand=qty_on_hand,
            qty_reserved=qty_reserved,
            qty_available=_available(qty_on_hand, qty_reserved),
        ))

    main_stock = InventorySiteStockRead(
        site_id=MAIN_SITE_ID,
        qty_on_hand=main_qty_on_hand,
        qty_reserved=main_qty_reserved,
        qty_available=_available(main_qty_on_hand, main_qty_reserved),
    )
    return InventoryVariantDetailRead(
        inventory_id=_inventory_id_for_variant(variant.object_id),
        product_variant_id=variant.object_id,
        sku=variant.payload.sku,
        qr_code=variant.payload.qr_code,
        variant_name=variant.payload.name,
        product_id=variant.payload.product_id,
        product_line_name=product.payload.product_line_name,
        product_name=product.payload.name,
        product_description=product.payload.description,
        main_stock=main_stock,
        site_stocks=site_stocks,
        master_qty_on_hand=global_qty_on_hand or (main_qty_on_hand + sum(item.qty_on_hand for item in site_stocks)),
    )


@router.get('/inventory/items/{inventory_id}', response_model=InventoryVariantDetailRead)
def get_inventory_item_detail(inventory_id: str, tenant_id: str = Query('tenant-admin')) -> InventoryVariantDetailRead:
    variant_id = _variant_id_from_inventory_id(inventory_id)
    return get_inventory_variant_detail(variant_id, tenant_id)


@router.post('/inventory/dispatch', response_model=InventoryDispatchRead, dependencies=[Depends(require_permission("inventory:update"))])
def dispatch_inventory_to_site(
    payload: InventoryDispatchCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventoryDispatchRead:
    qty = float(payload.qty or 0)
    if qty <= 0:
        raise HTTPException(status_code=422, detail='Dispatch qty must be greater than zero.')
    if _is_main_site(payload.site_id):
        raise HTTPException(status_code=422, detail='Destination site must be a localized site.')

    destination_site = map_record(site_controller.get(payload.site_id, tenant_id), SiteDocument)
    if not destination_site.payload.active:
        raise HTTPException(status_code=409, detail='Destination site is inactive.')

    source_stock = _find_product_stock_record(tenant_id, payload.product_variant_id, MAIN_SITE_ID)
    if not source_stock:
        raise HTTPException(status_code=404, detail='No main stock found for product variant.')

    available_main_qty = float(source_stock.payload.qty_on_hand or 0) - float(source_stock.payload.qty_reserved or 0)
    if qty > available_main_qty:
        raise HTTPException(status_code=409, detail='Insufficient main stock for dispatch.')

    updated_source = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        source_stock.payload.site_id,
        -qty,
    )
    updated_destination = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        payload.site_id,
        qty,
    )

    _record_inventory_adjustment(
        tenant_id,
        updated_source.object_id,
        source_stock.payload.site_id,
        InventoryAdjustmentType.TRANSFER_OUT,
        -qty,
        notes=f'Dispatched to site {payload.site_id}',
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_destination.object_id,
        payload.site_id,
        InventoryAdjustmentType.TRANSFER_IN,
        qty,
        notes=f'Received from {source_stock.payload.site_id}',
    )

    return InventoryDispatchRead(
        source_site_id=source_stock.payload.site_id,
        destination_site_id=payload.site_id,
        product_variant_id=payload.product_variant_id,
        qty=qty,
        source_qty_on_hand=float(updated_source.payload.qty_on_hand or 0),
        destination_qty_on_hand=float(updated_destination.payload.qty_on_hand or 0),
    )


@router.post('/inventory/transfer', response_model=InventoryTransferRead, dependencies=[Depends(require_permission("inventory:update"))])
def transfer_inventory_between_sites(
    payload: InventoryTransferCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventoryTransferRead:
    qty = float(payload.qty or 0)
    if qty <= 0:
        raise HTTPException(status_code=422, detail='Transfer qty must be greater than zero.')
    if payload.source_site_id == payload.destination_site_id:
        raise HTTPException(status_code=422, detail='Source and destination sites must be different.')

    _validate_site_or_main(payload.source_site_id, tenant_id)
    _validate_site_or_main(payload.destination_site_id, tenant_id)
    _ = map_record(variant_controller.get(payload.product_variant_id, tenant_id), ProductVariantDocument)

    source_stock = _find_product_stock_record(tenant_id, payload.product_variant_id, payload.source_site_id)
    if not source_stock:
        raise HTTPException(status_code=404, detail='Source stock not found for this variant/site.')
    source_available = float(source_stock.payload.qty_on_hand or 0) - float(source_stock.payload.qty_reserved or 0)
    if qty > source_available:
        raise HTTPException(status_code=409, detail='Insufficient source stock for transfer.')

    updated_source = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        payload.source_site_id,
        -qty,
    )
    updated_destination = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        payload.destination_site_id,
        qty,
    )

    _record_inventory_adjustment(
        tenant_id,
        updated_source.object_id,
        payload.source_site_id,
        InventoryAdjustmentType.TRANSFER_OUT,
        -qty,
        notes=f'Transfer to {payload.destination_site_id}',
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_destination.object_id,
        payload.destination_site_id,
        InventoryAdjustmentType.TRANSFER_IN,
        qty,
        notes=f'Transfer from {payload.source_site_id}',
    )

    return InventoryTransferRead(
        product_variant_id=payload.product_variant_id,
        source_site_id=payload.source_site_id,
        destination_site_id=payload.destination_site_id,
        qty=qty,
        source_qty_on_hand=float(updated_source.payload.qty_on_hand or 0),
        destination_qty_on_hand=float(updated_destination.payload.qty_on_hand or 0),
    )


@router.post('/inventory/receive', response_model=InventoryReceiveRead, dependencies=[Depends(require_permission("inventory:create"))])
def receive_inventory_to_main(
    payload: InventoryReceiveCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventoryReceiveRead:
    qty = float(payload.qty or 0)
    if qty <= 0:
        raise HTTPException(status_code=422, detail='Receive qty must be greater than zero.')

    _ = map_record(variant_controller.get(payload.product_variant_id, tenant_id), ProductVariantDocument)
    updated_main = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        MAIN_SITE_ID,
        qty,
    )
    updated_global = _upsert_global_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        qty,
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_main.object_id,
        MAIN_SITE_ID,
        InventoryAdjustmentType.ADD,
        qty,
        notes='Main stock receive',
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_global.object_id,
        GLOBAL_SITE_ID,
        InventoryAdjustmentType.ADD,
        qty,
        notes='Global stock receive',
    )
    return InventoryReceiveRead(
        site_id=MAIN_SITE_ID,
        product_variant_id=payload.product_variant_id,
        qty=qty,
        site_qty_on_hand=float(updated_main.payload.qty_on_hand or 0),
    )


@router.post('/inventory/global-adjust', response_model=InventoryGlobalAdjustRead, dependencies=[Depends(require_permission("inventory:update"))])
def adjust_inventory_global(
    payload: InventoryGlobalAdjustCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventoryGlobalAdjustRead:
    qty_delta = float(payload.qty_delta or 0)
    if qty_delta == 0:
        raise HTTPException(status_code=422, detail='Stock delta must not be zero.')

    _ = map_record(variant_controller.get(payload.product_variant_id, tenant_id), ProductVariantDocument)
    storage_stock = _find_product_stock_record(tenant_id, payload.product_variant_id, MAIN_SITE_ID)
    storage_site_id = storage_stock.payload.site_id if storage_stock else MAIN_SITE_ID
    if storage_stock:
        available_main_qty = float(storage_stock.payload.qty_on_hand or 0) - float(storage_stock.payload.qty_reserved or 0)
        if qty_delta < 0 and abs(qty_delta) > available_main_qty:
            raise HTTPException(status_code=409, detail='Insufficient global stock for this adjustment.')

    updated_main = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        storage_site_id,
        qty_delta,
    )
    updated_global = _upsert_global_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        qty_delta,
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_main.object_id,
        storage_site_id,
        InventoryAdjustmentType.ADD if qty_delta > 0 else InventoryAdjustmentType.DISPENSE,
        qty_delta,
        notes=(str(payload.notes or '').strip() or 'Global stock quick adjustment'),
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_global.object_id,
        GLOBAL_SITE_ID,
        InventoryAdjustmentType.ADD if qty_delta > 0 else InventoryAdjustmentType.DISPENSE,
        qty_delta,
        notes=(str(payload.notes or '').strip() or 'Global stock quick adjustment'),
    )
    return InventoryGlobalAdjustRead(
        site_id=storage_site_id,
        product_variant_id=payload.product_variant_id,
        qty_delta=qty_delta,
        site_qty_on_hand=float(updated_main.payload.qty_on_hand or 0),
    )


@router.post('/inventory/site-writeoff', response_model=InventorySiteWriteoffRead, dependencies=[Depends(require_permission("inventory:update"))])
def writeoff_inventory_from_site(
    payload: InventorySiteWriteoffCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventorySiteWriteoffRead:
    qty = float(payload.qty or 0)
    if qty <= 0:
        raise HTTPException(status_code=422, detail='Write-off qty must be greater than zero.')

    site_id = str(payload.site_id or '').strip()
    if not site_id:
        raise HTTPException(status_code=422, detail='Site is required.')
    if _is_main_site(site_id):
        raise HTTPException(status_code=422, detail='Use global adjustment for storage write-offs.')

    reason = str(payload.reason or '').strip()
    if not reason:
        raise HTTPException(status_code=422, detail='Reason is required.')

    disposition = str(payload.disposition or 'loss').strip().lower()
    if disposition not in {'loss', 'manual_sale'}:
        raise HTTPException(status_code=422, detail='Disposition must be loss or manual_sale.')

    _ = map_record(variant_controller.get(payload.product_variant_id, tenant_id), ProductVariantDocument)
    _validate_site_or_main(site_id, tenant_id)

    source_stock = _find_product_stock_record(tenant_id, payload.product_variant_id, site_id)
    if source_stock is None:
        raise HTTPException(status_code=404, detail='Site stock was not found.')

    available_qty = float(source_stock.payload.qty_on_hand or 0) - float(source_stock.payload.qty_reserved or 0)
    if qty > available_qty:
        raise HTTPException(status_code=409, detail='Insufficient site stock for write-off.')

    updated_site = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        site_id,
        -qty,
    )
    updated_global = _upsert_global_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        -qty,
    )
    descriptor = 'Manual sale' if disposition == 'manual_sale' else 'Loss'
    _record_inventory_adjustment(
        tenant_id,
        updated_site.object_id,
        site_id,
        InventoryAdjustmentType.DISPENSE,
        -qty,
        notes=f'Site write-off ({descriptor}): {reason}',
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_global.object_id,
        GLOBAL_SITE_ID,
        InventoryAdjustmentType.DISPENSE,
        -qty,
        notes=f'Global write-off ({descriptor}): {reason}',
    )
    return InventorySiteWriteoffRead(
        site_id=site_id,
        product_variant_id=payload.product_variant_id,
        qty=qty,
        qty_delta=-qty,
        site_qty_on_hand=float(updated_site.payload.qty_on_hand or 0),
        reason=reason,
        disposition='manual_sale' if disposition == 'manual_sale' else 'loss',
    )


@router.post('/products', response_model=ProductStockRead, dependencies=[Depends(require_permission("inventory:create"))])
def create_product_stock(payload: ProductStockCreate, tenant_id: str = Query('tenant-admin')) -> ProductStockRead:
    record = map_record(
        product_stock_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        ProductStockDocument,
    )
    return _to_stock(record)


@router.get('/supplies', response_model=SupplyListResponse)
def list_supplies(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    search: str | None = Query(default=None),
    supply_type: str | None = Query(default=None),
) -> SupplyListResponse:
    records = [map_record(record, SupplyDocument) for record in supply_controller.list(tenant_id)]
    supplies = [_to_supply(record) for record in records]
    adjustment_records = [map_record(record, InventoryAdjustmentDocument) for record in adjustment_controller.list(tenant_id)]
    last_order_by_supply_id: dict[str, datetime] = {}
    for adjustment in adjustment_records:
        target_type = adjustment.payload.target_type.value if hasattr(adjustment.payload.target_type, 'value') else adjustment.payload.target_type
        if str(target_type).lower() != 'supply':
            continue
        if float(adjustment.payload.qty_delta or 0) <= 0:
            continue
        current = last_order_by_supply_id.get(adjustment.payload.target_id)
        if current is None or adjustment.created_at > current:
            last_order_by_supply_id[adjustment.payload.target_id] = adjustment.created_at
    supplies = [
        item.model_copy(update={'last_order_date': last_order_by_supply_id.get(item.id)})
        for item in supplies
    ]
    supply_type_filter = str(supply_type or '').strip().lower()
    if supply_type_filter:
        supplies = [item for item in supplies if str(item.supply_type.value if hasattr(item.supply_type, 'value') else item.supply_type).lower() == supply_type_filter]
    if search:
        supplies = [
            item for item in supplies
            if _contains_query([
                item.id,
                item.name,
                item.brand,
                item.material_type,
                item.sub_type,
                item.color,
            ], search)
        ]
    supplies.sort(key=lambda item: (
        str(item.supply_type.value if hasattr(item.supply_type, 'value') else item.supply_type).casefold(),
        str(item.brand or '').casefold(),
        str(item.material_type or '').casefold(),
        str(item.sub_type or '').casefold(),
        str(item.color or '').casefold(),
        str(item.name or '').casefold(),
    ))
    paged, total = _paginate(supplies, page, page_size)
    return SupplyListResponse(supplies=paged, total=total, page=page, page_size=page_size)


@router.get('/brands', response_model=SupplyBrandListResponse)
def list_brands(tenant_id: str = Query('tenant-admin')) -> SupplyBrandListResponse:
    records = [map_record(record, SupplyBrandDocument) for record in brand_controller.list(tenant_id)]
    records.sort(key=lambda item: item.payload.display_name.lower())
    return SupplyBrandListResponse(brands=[_to_brand(record) for record in records])


@router.post('/brands', response_model=SupplyBrandRead, dependencies=[Depends(require_permission("inventory:create"))])
def create_brand(payload: SupplyBrandCreate, tenant_id: str = Query('tenant-admin')) -> SupplyBrandRead:
    normalized_id = _normalize_brand_id(payload.brand)
    if not normalized_id:
        raise HTTPException(status_code=422, detail='Brand is required.')
    existing = next(
        (
            map_record(record, SupplyBrandDocument)
            for record in brand_controller.list(tenant_id)
            if record.get('object_id') == normalized_id
        ),
        None,
    )
    if existing:
        return _to_brand(existing)
    display_name = _normalize_brand_display(payload.brand)
    record = map_record(
        brand_controller.update(normalized_id, tenant_id, {
            'id': normalized_id,
            'display_name': display_name,
        }),
        SupplyBrandDocument,
    )
    return _to_brand(record)


@router.get('/supplies/{id}', response_model=SupplyRead)
def get_supply(id: str, tenant_id: str = Query('tenant-admin')) -> SupplyRead:
    record = map_record(supply_controller.get(id, tenant_id), SupplyDocument)
    return _to_supply(record)


@router.post('/supplies', response_model=SupplyRead, dependencies=[Depends(require_permission("inventory:create"))])
def create_supply(payload: SupplyCreate, tenant_id: str = Query('tenant-admin')) -> SupplyRead:
    create_payload = payload.model_dump(exclude_none=True)
    supply_type = _normalize_supply_type(
        create_payload.get('supply_type'),
        cost_per_kilo=float(create_payload.get('cost_per_kilo') or 0),
        cost_per_piece=float(create_payload.get('cost_per_piece') or 0),
    )
    create_payload['supply_type'] = supply_type.value
    if supply_type == SupplyType.FILAMENT:
        create_payload['brand'] = _ensure_brand(tenant_id, create_payload.get('brand'))
    pieces_per_pack = float(create_payload.get('pieces_per_pack') or 1)
    create_payload['pieces_per_pack'] = pieces_per_pack
    if supply_type == SupplyType.CONSUMABLE:
        create_payload['grams_on_hand'] = 0
        create_payload['grams_reserved'] = 0
        create_payload['stock_spools'] = 0
        create_payload['spool_weight_grams'] = 0
        create_payload['estimated_remaining_weight_grams'] = 0
        pack_min = float(create_payload.get('cost_per_pack_min') or 0)
        pack_max = float(create_payload.get('cost_per_pack_max') or 0)
        if pack_min > 0 or pack_max > 0:
            if pack_max <= 0:
                pack_max = pack_min
            if pack_min <= 0:
                pack_min = pack_max
            create_payload['cost_per_pack_min'] = pack_min
            create_payload['cost_per_pack_max'] = pack_max
            create_payload['cost_per_pack'] = (pack_min + pack_max) / 2.0
        pack_cost = float(create_payload.get('cost_per_pack') or 0)
        create_payload['cost_per_piece'] = (pack_cost / pieces_per_pack) if pieces_per_pack > 0 else 0.0
    else:
        create_payload['qty_on_hand'] = 0
        create_payload['qty_reserved'] = 0
        if float(create_payload.get('cost_per_kilo') or 0) <= 0:
            per_piece = float(create_payload.get('cost_per_piece') or 0)
            if per_piece > 0:
                create_payload['cost_per_kilo'] = per_piece * 1000
    record = map_record(supply_controller.create(tenant_id, create_payload), SupplyDocument)
    return _to_supply(record)


@router.put('/supplies/{id}', response_model=SupplyRead, dependencies=[Depends(require_permission("inventory:update"))])
def update_supply(id: str, payload: SupplyUpdate, tenant_id: str = Query('tenant-admin')) -> SupplyRead:
    existing = map_record(supply_controller.get(id, tenant_id), SupplyDocument)
    merged = existing.payload.model_dump(exclude_none=True)
    updates = payload.model_dump(exclude_none=True)
    merged.update(updates)
    supply_type = _normalize_supply_type(
        merged.get('supply_type'),
        cost_per_kilo=float(merged.get('cost_per_kilo') or 0),
        cost_per_piece=float(merged.get('cost_per_piece') or 0),
    )
    merged['supply_type'] = supply_type.value
    if supply_type == SupplyType.FILAMENT:
        merged['brand'] = _ensure_brand(tenant_id, merged.get('brand'))
    pieces_per_pack = float(merged.get('pieces_per_pack') or 1)
    merged['pieces_per_pack'] = pieces_per_pack
    if supply_type == SupplyType.CONSUMABLE:
        merged['grams_on_hand'] = 0
        merged['grams_reserved'] = 0
        merged['stock_spools'] = 0
        merged['spool_weight_grams'] = 0
        merged['estimated_remaining_weight_grams'] = 0
        pack_min = float(merged.get('cost_per_pack_min') or 0)
        pack_max = float(merged.get('cost_per_pack_max') or 0)
        if pack_min > 0 or pack_max > 0:
            if pack_max <= 0:
                pack_max = pack_min
            if pack_min <= 0:
                pack_min = pack_max
            merged['cost_per_pack_min'] = pack_min
            merged['cost_per_pack_max'] = pack_max
            merged['cost_per_pack'] = (pack_min + pack_max) / 2.0
        pack_cost = float(merged.get('cost_per_pack') or 0)
        merged['cost_per_piece'] = (pack_cost / pieces_per_pack) if pieces_per_pack > 0 else 0.0
    else:
        merged['qty_on_hand'] = 0
        merged['qty_reserved'] = 0
        if float(merged.get('cost_per_kilo') or 0) <= 0:
            per_piece = float(merged.get('cost_per_piece') or 0)
            if per_piece > 0:
                merged['cost_per_kilo'] = per_piece * 1000
    record = map_record(supply_controller.update(id, tenant_id, merged), SupplyDocument)
    return _to_supply(record)


@router.delete('/supplies/{id}', dependencies=[Depends(require_permission("inventory:delete"))])
def delete_supply(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    return {'deleted': supply_controller.delete(id, tenant_id)}


@router.get('/filaments/{id}/variants', response_model=FilamentVariantAssociationListResponse)
def list_filament_associated_variants(id: str, tenant_id: str = Query('tenant-admin')) -> FilamentVariantAssociationListResponse:
    _ = map_record(supply_controller.get(id, tenant_id), SupplyDocument)
    recipe_parts = [map_record(record, ProductRecipePartDocument) for record in recipe_part_controller.list(tenant_id)]
    variant_ids = {
        record.payload.variant_id
        for record in recipe_parts
        if str(record.payload.filament_id or record.payload.supply_id or '') == id
    }
    variants = [map_record(record, ProductVariantDocument) for record in variant_controller.list(tenant_id)]
    products = {record.object_id: map_record(record, ProductDocument) for record in product_controller.list(tenant_id)}
    associations: list[FilamentVariantAssociationRead] = []
    for variant in variants:
        if variant.object_id not in variant_ids:
            continue
        product = products.get(variant.payload.product_id)
        associations.append(FilamentVariantAssociationRead(
            variant_id=variant.object_id,
            variant_sku=variant.payload.sku,
            variant_name=variant.payload.name,
            product_id=variant.payload.product_id,
            product_name=product.payload.name if product else variant.payload.product_id,
        ))
    return FilamentVariantAssociationListResponse(variants=associations)


@router.get('/filaments', response_model=FilamentListResponse)
def list_filaments(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
) -> FilamentListResponse:
    records = [map_record(record, FilamentDocument) for record in filament_controller.list(tenant_id)]
    filaments = [_to_filament(record) for record in records]
    paged, total = _paginate(filaments, page, page_size)
    return FilamentListResponse(filaments=paged, total=total, page=page, page_size=page_size)


@router.post('/filaments', response_model=FilamentRead, dependencies=[Depends(require_permission("inventory:create"))])
def create_filament(payload: FilamentCreate, tenant_id: str = Query('tenant-admin')) -> FilamentRead:
    record = map_record(
        filament_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        FilamentDocument,
    )
    return _to_filament(record)


@router.get('/filaments/{id}/active', response_model=FilamentActiveListResponse)
def list_filament_active(id: str, tenant_id: str = Query('tenant-admin')) -> FilamentActiveListResponse:
    supply = map_record(supply_controller.get(id, tenant_id), SupplyDocument)
    if _normalize_supply_type(
        supply.payload.supply_type,
        cost_per_kilo=float(supply.payload.cost_per_kilo or 0),
        cost_per_piece=float(supply.payload.cost_per_piece or 0),
    ) != SupplyType.FILAMENT:
        raise HTTPException(status_code=400, detail='Supply is not a filament.')
    records = [
        map_record(record, FilamentActiveDocument)
        for record in filament_active_controller.list(tenant_id)
        if str(record.get('payload', {}).get('filament_id') or '') == id
        and str(record.get('payload', {}).get('status') or 'active').lower() == 'active'
    ]
    records.sort(key=lambda entry: entry.created_at, reverse=True)
    return FilamentActiveListResponse(entries=[_to_filament_active(record) for record in records])


@router.post('/filaments/{id}/active', response_model=FilamentActiveRead, dependencies=[Depends(require_permission("inventory:update"))])
def open_filament_active(
    id: str,
    payload: FilamentActiveCreate,
    tenant_id: str = Query('tenant-admin'),
) -> FilamentActiveRead:
    supply = map_record(supply_controller.get(id, tenant_id), SupplyDocument)
    if _normalize_supply_type(
        supply.payload.supply_type,
        cost_per_kilo=float(supply.payload.cost_per_kilo or 0),
        cost_per_piece=float(supply.payload.cost_per_piece or 0),
    ) != SupplyType.FILAMENT:
        raise HTTPException(status_code=400, detail='Supply is not a filament.')
    stock_spools = float(supply.payload.stock_spools or 0)
    if stock_spools <= 0:
        raise HTTPException(status_code=400, detail='No sealed spools available to activate.')
    updated_supply = supply.payload.model_copy(update={'stock_spools': stock_spools - 1})
    supply_controller.update(id, tenant_id, updated_supply.model_dump(exclude_none=True))
    grams_remaining = (
        float(payload.grams_remaining)
        if payload.grams_remaining is not None and float(payload.grams_remaining) > 0
        else float(supply.payload.spool_weight_grams or 1000)
    )
    active_record = map_record(
        filament_active_controller.create(tenant_id, {
            'filament_id': id,
            'grams_remaining': grams_remaining,
            'notes': payload.notes,
            'status': 'active',
        }),
        FilamentActiveDocument,
    )
    return _to_filament_active(active_record)


@router.put('/filaments/{id}/active/{active_id}', response_model=FilamentActiveRead, dependencies=[Depends(require_permission("inventory:update"))])
def update_filament_active(
    id: str,
    active_id: str,
    payload: FilamentActiveUpdate,
    tenant_id: str = Query('tenant-admin'),
) -> FilamentActiveRead:
    existing = map_record(filament_active_controller.get(active_id, tenant_id), FilamentActiveDocument)
    if existing.payload.filament_id != id:
        raise HTTPException(status_code=404, detail='Active spool not found for this filament.')
    merged = existing.payload.model_dump(exclude_none=True)
    updates = payload.model_dump(exclude_none=True)
    merged.update(updates)
    merged['filament_id'] = id
    if float(merged.get('grams_remaining') or 0) <= 0:
        merged['status'] = 'done'
    updated = map_record(
        filament_active_controller.update(active_id, tenant_id, merged),
        FilamentActiveDocument,
    )
    return _to_filament_active(updated)


@router.delete('/filaments/{id}/active/{active_id}', dependencies=[Depends(require_permission("inventory:delete"))])
def delete_filament_active(id: str, active_id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    existing = map_record(filament_active_controller.get(active_id, tenant_id), FilamentActiveDocument)
    if existing.payload.filament_id != id:
        raise HTTPException(status_code=404, detail='Active spool not found for this filament.')
    return {'deleted': filament_active_controller.delete(active_id, tenant_id)}


@router.get('/adjustments', response_model=InventoryAdjustmentListResponse)
def list_adjustments(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    target_type: str | None = Query(default=None),
    target_id: str | None = Query(default=None),
) -> InventoryAdjustmentListResponse:
    records = [map_record(record, InventoryAdjustmentDocument) for record in adjustment_controller.list(tenant_id)]
    adjustments = [_to_adjustment(record) for record in records]
    if target_type:
        adjustments = [
            item for item in adjustments
            if str(item.target_type.value if hasattr(item.target_type, 'value') else item.target_type).lower() == str(target_type).lower()
        ]
    if target_id:
        adjustments = [item for item in adjustments if item.target_id == target_id]
    adjustments.sort(key=lambda item: item.created_at, reverse=True)
    paged, total = _paginate(adjustments, page, page_size)
    return InventoryAdjustmentListResponse(adjustments=paged, total=total, page=page, page_size=page_size)


@router.post('/adjustments', response_model=InventoryAdjustmentRead, dependencies=[Depends(require_permission("inventory:update"))])
def create_adjustment(payload: InventoryAdjustmentCreate, tenant_id: str = Query('tenant-admin')) -> InventoryAdjustmentRead:
    _apply_adjustment(tenant_id, payload)
    record = map_record(
        adjustment_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        InventoryAdjustmentDocument,
    )
    return _to_adjustment(record)
