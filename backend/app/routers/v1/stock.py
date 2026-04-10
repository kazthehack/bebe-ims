from __future__ import annotations

from datetime import datetime
import re

from fastapi import APIRouter, HTTPException, Query, Response

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

MAIN_SITE_ID = 'main'


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


def _is_main_site(site_id: str | None) -> bool:
    normalized = str(site_id or '').strip().lower()
    return normalized in ('main', 'global', 'storage')


def _site_bucket(site_id: str | None) -> str:
    normalized = str(site_id or '').strip().lower()
    compact = ''.join(char for char in normalized if char.isalnum())
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
def list_product_stock(tenant_id: str = Query('tenant-admin')) -> ProductStockListResponse:
    records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    return ProductStockListResponse(items=[_to_stock(record) for record in records])


@router.get('/inventory/global', response_model=InventoryGlobalListResponse)
def list_inventory_global(tenant_id: str = Query('tenant-admin')) -> InventoryGlobalListResponse:
    stock_records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    variant_by_id, product_by_id = _variant_maps(tenant_id)
    totals: dict[str, dict[str, float]] = {}
    for stock in stock_records:
        variant_id = stock.payload.product_variant_id
        entry = totals.setdefault(
            variant_id,
            {
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
        master_qty = main_qty + sites_qty
        primary_qty = float(summed['primary'])
        secondary_qty = float(summed['secondary'])
        tertiary_qty = float(summed['tertiary'])
        storage_qty = max(0.0, master_qty - primary_qty - secondary_qty - tertiary_qty)
        rows.append(InventoryGlobalItemRead(
            inventory_id=_inventory_id_for_variant(variant_id),
            product_variant_id=variant_id,
            sku=variant.payload.sku,
            variant_name=variant.payload.name,
            product_id=variant.payload.product_id,
            product_line_name=product.payload.product_line_name if product else None,
            product_name=product.payload.name if product else variant.payload.product_id,
            main_qty_on_hand=main_qty,
            sites_qty_on_hand=sites_qty,
            master_qty_on_hand=master_qty,
            storage_qty_on_hand=storage_qty,
            primary_qty_on_hand=primary_qty,
            secondary_qty_on_hand=secondary_qty,
            tertiary_qty_on_hand=tertiary_qty,
        ))
    return InventoryGlobalListResponse(items=rows)


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
def list_inventory_by_site(site_id: str, tenant_id: str = Query('tenant-admin')) -> InventorySiteListResponse:
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
    return InventorySiteListResponse(site_id=site_id, items=rows)


@router.get('/inventory/variants/{variant_id}', response_model=InventoryVariantDetailRead)
def get_inventory_variant_detail(variant_id: str, tenant_id: str = Query('tenant-admin')) -> InventoryVariantDetailRead:
    variant = map_record(variant_controller.get(variant_id, tenant_id), ProductVariantDocument)
    product = map_record(product_controller.get(variant.payload.product_id, tenant_id), ProductDocument)
    stock_records = [
        map_record(record, ProductStockDocument)
        for record in product_stock_controller.list(tenant_id)
        if str(record.get('payload', {}).get('product_variant_id') or '') == variant_id
    ]

    main_qty_on_hand = 0.0
    main_qty_reserved = 0.0
    site_stocks: list[InventorySiteStockRead] = []
    for stock in stock_records:
        qty_on_hand = float(stock.payload.qty_on_hand or 0)
        qty_reserved = float(stock.payload.qty_reserved or 0)
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
        master_qty_on_hand=main_qty_on_hand + sum(item.qty_on_hand for item in site_stocks),
    )


@router.get('/inventory/items/{inventory_id}', response_model=InventoryVariantDetailRead)
def get_inventory_item_detail(inventory_id: str, tenant_id: str = Query('tenant-admin')) -> InventoryVariantDetailRead:
    variant_id = _variant_id_from_inventory_id(inventory_id)
    return get_inventory_variant_detail(variant_id, tenant_id)


@router.post('/inventory/dispatch', response_model=InventoryDispatchRead)
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
        source_stock = _find_product_stock_record(tenant_id, payload.product_variant_id, 'global')
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


@router.post('/inventory/transfer', response_model=InventoryTransferRead)
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


@router.post('/inventory/receive', response_model=InventoryReceiveRead)
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
    _record_inventory_adjustment(
        tenant_id,
        updated_main.object_id,
        MAIN_SITE_ID,
        InventoryAdjustmentType.ADD,
        qty,
        notes='Main stock receive',
    )
    return InventoryReceiveRead(
        site_id=MAIN_SITE_ID,
        product_variant_id=payload.product_variant_id,
        qty=qty,
        site_qty_on_hand=float(updated_main.payload.qty_on_hand or 0),
    )


@router.post('/inventory/global-adjust', response_model=InventoryGlobalAdjustRead)
def adjust_inventory_global(
    payload: InventoryGlobalAdjustCreate,
    tenant_id: str = Query('tenant-admin'),
) -> InventoryGlobalAdjustRead:
    qty_delta = float(payload.qty_delta or 0)
    if qty_delta == 0:
        raise HTTPException(status_code=422, detail='Stock delta must not be zero.')

    _ = map_record(variant_controller.get(payload.product_variant_id, tenant_id), ProductVariantDocument)
    main_stock = (
        _find_product_stock_record(tenant_id, payload.product_variant_id, MAIN_SITE_ID)
        or _find_product_stock_record(tenant_id, payload.product_variant_id, 'global')
    )
    main_site_id = main_stock.payload.site_id if main_stock else MAIN_SITE_ID
    if main_stock:
        available_main_qty = float(main_stock.payload.qty_on_hand or 0) - float(main_stock.payload.qty_reserved or 0)
        if qty_delta < 0 and abs(qty_delta) > available_main_qty:
            raise HTTPException(status_code=409, detail='Insufficient global stock for this adjustment.')

    updated_main = _upsert_product_stock_qty(
        tenant_id,
        payload.product_variant_id,
        main_site_id,
        qty_delta,
    )
    _record_inventory_adjustment(
        tenant_id,
        updated_main.object_id,
        main_site_id,
        InventoryAdjustmentType.ADD if qty_delta > 0 else InventoryAdjustmentType.DISPENSE,
        qty_delta,
        notes=(str(payload.notes or '').strip() or 'Global stock quick adjustment'),
    )
    return InventoryGlobalAdjustRead(
        site_id=main_site_id,
        product_variant_id=payload.product_variant_id,
        qty_delta=qty_delta,
        site_qty_on_hand=float(updated_main.payload.qty_on_hand or 0),
    )


@router.post('/products', response_model=ProductStockRead)
def create_product_stock(payload: ProductStockCreate, tenant_id: str = Query('tenant-admin')) -> ProductStockRead:
    record = map_record(
        product_stock_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        ProductStockDocument,
    )
    return _to_stock(record)


@router.get('/supplies', response_model=SupplyListResponse)
def list_supplies(tenant_id: str = Query('tenant-admin')) -> SupplyListResponse:
    records = [map_record(record, SupplyDocument) for record in supply_controller.list(tenant_id)]
    return SupplyListResponse(supplies=[_to_supply(record) for record in records])


@router.get('/brands', response_model=SupplyBrandListResponse)
def list_brands(tenant_id: str = Query('tenant-admin')) -> SupplyBrandListResponse:
    records = [map_record(record, SupplyBrandDocument) for record in brand_controller.list(tenant_id)]
    records.sort(key=lambda item: item.payload.display_name.lower())
    return SupplyBrandListResponse(brands=[_to_brand(record) for record in records])


@router.post('/brands', response_model=SupplyBrandRead)
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


@router.post('/supplies', response_model=SupplyRead)
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


@router.put('/supplies/{id}', response_model=SupplyRead)
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


@router.delete('/supplies/{id}')
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
def list_filaments(tenant_id: str = Query('tenant-admin')) -> FilamentListResponse:
    records = [map_record(record, FilamentDocument) for record in filament_controller.list(tenant_id)]
    return FilamentListResponse(filaments=[_to_filament(record) for record in records])


@router.post('/filaments', response_model=FilamentRead)
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


@router.post('/filaments/{id}/active', response_model=FilamentActiveRead)
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


@router.put('/filaments/{id}/active/{active_id}', response_model=FilamentActiveRead)
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


@router.delete('/filaments/{id}/active/{active_id}')
def delete_filament_active(id: str, active_id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    existing = map_record(filament_active_controller.get(active_id, tenant_id), FilamentActiveDocument)
    if existing.payload.filament_id != id:
        raise HTTPException(status_code=404, detail='Active spool not found for this filament.')
    return {'deleted': filament_active_controller.delete(active_id, tenant_id)}


@router.get('/adjustments', response_model=InventoryAdjustmentListResponse)
def list_adjustments(tenant_id: str = Query('tenant-admin')) -> InventoryAdjustmentListResponse:
    records = [map_record(record, InventoryAdjustmentDocument) for record in adjustment_controller.list(tenant_id)]
    return InventoryAdjustmentListResponse(adjustments=[_to_adjustment(record) for record in records])


@router.post('/adjustments', response_model=InventoryAdjustmentRead)
def create_adjustment(payload: InventoryAdjustmentCreate, tenant_id: str = Query('tenant-admin')) -> InventoryAdjustmentRead:
    _apply_adjustment(tenant_id, payload)
    record = map_record(
        adjustment_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        InventoryAdjustmentDocument,
    )
    return _to_adjustment(record)
