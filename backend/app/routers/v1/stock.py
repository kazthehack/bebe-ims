from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.controllers.filament import Filament
from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product import Product
from app.controllers.product_recipe_part import ProductRecipePart
from app.controllers.product_variant import ProductVariant
from app.controllers.product_stock import ProductStock
from app.controllers.supply import Supply
from app.domain.enums import StockTargetType, SupplyType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.filament import FilamentDocument
from app.models.inventory_adjustment import InventoryAdjustmentDocument
from app.models.product import ProductDocument
from app.models.product_recipe_part import ProductRecipePartDocument
from app.models.product_variant import ProductVariantDocument
from app.models.product_stock import ProductStockDocument
from app.models.supply import SupplyDocument
from app.schemas.stock import (
    FilamentCreate,
    FilamentVariantAssociationListResponse,
    FilamentVariantAssociationRead,
    FilamentListResponse,
    FilamentRead,
    InventoryAdjustmentCreate,
    InventoryAdjustmentListResponse,
    InventoryAdjustmentRead,
    ProductStockCreate,
    ProductStockListResponse,
    ProductStockRead,
    SupplyCreate,
    SupplyListResponse,
    SupplyRead,
    SupplyUpdate,
)

router = APIRouter(prefix='/stock', tags=['stock'])

product_stock_controller = ProductStock()
supply_controller = Supply()
filament_controller = Filament()
adjustment_controller = InventoryAdjustment()
variant_controller = ProductVariant()
product_controller = Product()
recipe_part_controller = ProductRecipePart()


def _available(qty_on_hand: float, qty_reserved: float) -> float:
    return float(qty_on_hand or 0) - float(qty_reserved or 0)


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
    source_urls = list(record.payload.source_urls or [])
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
        source=record.payload.source,
        source_urls=source_urls,
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
            current_grams = float(supply.payload.grams_on_hand or supply.payload.estimated_remaining_weight_grams or 0)
            updated_supply = supply.payload.model_copy(update={
                'grams_on_hand': current_grams + qty_delta,
                'estimated_remaining_weight_grams': current_grams + qty_delta,
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
