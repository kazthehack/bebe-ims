from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.controllers.product import Product
from app.controllers.product_line import ProductLine
from app.controllers.product_recipe_part import ProductRecipePart
from app.controllers.product_stock import ProductStock
from app.controllers.product_variant import ProductVariant
from app.controllers.part import Part
from app.controllers.supply import Supply
from app.domain.enums import SupplyType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.product import ProductDocument
from app.models.product_line import ProductLineDocument
from app.models.product_recipe_part import ProductRecipePartDocument
from app.models.product_stock import ProductStockDocument
from app.models.product_variant import ProductVariantDocument
from app.models.part import PartDocument
from app.models.supply import SupplyDocument
from app.schemas.product import (
    PartCreate,
    PartListResponse,
    PartRead,
    ProductCreate,
    ProductDetailResponse,
    ProductListResponse,
    ProductRecipePartCreate,
    ProductRecipePartListResponse,
    ProductRecipePartRead,
    ProductRead,
    ProductUpdate,
    ProductVariantCreate,
    ProductVariantListResponse,
    ProductVariantRead,
    ProductVariantUpdate,
)

router = APIRouter(prefix='/products', tags=['products'])


product_controller = Product()
variant_controller = ProductVariant()
recipe_part_controller = ProductRecipePart()
product_line_controller = ProductLine()
supply_controller = Supply()
part_controller = Part()
product_stock_controller = ProductStock()

VALID_FSN_VALUES = {'fast', 'normal', 'slow', 'non_moving'}


def _normalize_fsn(value: str | None, fallback: str = 'normal') -> str:
    normalized = str(value or '').strip().lower()
    if normalized in VALID_FSN_VALUES:
        return normalized
    return fallback


def _normalize_supply_type(value: str | None) -> SupplyType:
    raw = str(value or '').strip().lower()
    if raw in ('consumable', SupplyType.CONSUMABLE.value):
        return SupplyType.CONSUMABLE
    if raw in ('filament', SupplyType.FILAMENT.value):
        return SupplyType.FILAMENT
    return SupplyType.FILAMENT


def _infer_supply_type_for_record(
    explicit: str | None,
    *,
    cost_per_kilo: float = 0.0,
    cost_per_piece: float = 0.0,
    grams: float = 0.0,
    quantity: float = 0.0,
) -> SupplyType:
    normalized = _normalize_supply_type(explicit)
    if explicit is not None and str(explicit).strip():
        return normalized
    if float(quantity or 0) > 0 and float(grams or 0) <= 0:
        return SupplyType.CONSUMABLE
    if float(cost_per_piece or 0) > 0 and float(cost_per_kilo or 0) <= 0:
        return SupplyType.CONSUMABLE
    return SupplyType.FILAMENT


def _to_product(record: StoredRecord[ProductDocument]) -> ProductRead:
    return ProductRead(
        id=record.object_id,
        product_code=record.payload.product_code or record.payload.sku or record.object_id,
        name=record.payload.name,
        product_line=record.payload.product_line_name or record.payload.product_line_id or 'unassigned',
        product_line_id=record.payload.product_line_id or 'unassigned',
        ip=record.payload.ip,
        category=record.payload.category,
        list_price=float(record.payload.list_price or 0),
        fsn=_normalize_fsn(record.payload.fsn, 'normal'),
        capacity_threshold_per_site=float(record.payload.capacity_threshold_per_site or 8.0),
        description=record.payload.description,
        design_source=record.payload.design_source,
        third_party_source_url=record.payload.third_party_source_url,
        local_working_files=record.payload.local_working_files or [],
        image_url=record.payload.image_url,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _to_part(record: StoredRecord[PartDocument]) -> PartRead:
    return PartRead(
        id=record.object_id,
        name=record.payload.name,
        description=record.payload.description,
        print_hours=float(record.payload.print_hours or 0),
        active=bool(record.payload.active),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _to_variant(record: StoredRecord[ProductVariantDocument], tenant_id: str = 'tenant-admin') -> ProductVariantRead:
    parent_fsn = 'normal'
    try:
        product = map_record(product_controller.get(record.payload.product_id, tenant_id), ProductDocument)
        parent_fsn = _normalize_fsn(product.payload.fsn, 'normal')
    except Exception:
        parent_fsn = 'normal'
    return ProductVariantRead(
        id=record.object_id,
        product_id=record.payload.product_id,
        sku=record.payload.sku,
        name=record.payload.name,
        fsn=_normalize_fsn(record.payload.fsn, parent_fsn),
        yield_units=int(record.payload.yield_units or 1),
        print_hours=float(record.payload.print_hours or 0),
        qr_code=record.payload.qr_code,
        image_url=record.payload.image_url,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _to_recipe_part(
    record: StoredRecord[ProductRecipePartDocument],
    supply: StoredRecord[SupplyDocument] | None = None,
    part: StoredRecord[PartDocument] | None = None,
    yield_units: int = 1,
) -> ProductRecipePartRead:
    cost_per_kilo = float(record.payload.cost_per_kilo or 0)
    cost_per_piece = float(record.payload.cost_per_piece or 0)
    grams = float(record.payload.grams or 0)
    quantity = float(record.payload.quantity or 0)
    batch_yield = max(1.0, float(record.payload.batch_yield or 1.0))
    supply_type = _infer_supply_type_for_record(
        record.payload.supply_type or (supply.payload.supply_type if supply else None),
        cost_per_kilo=cost_per_kilo,
        cost_per_piece=cost_per_piece,
        grams=grams,
        quantity=quantity,
    )
    required_grams_for_batch = float(grams * max(1, int(yield_units or 1)))
    required_quantity_for_batch = float(quantity * max(1, int(yield_units or 1)))

    qty_available = 0.0
    grams_available = 0.0
    if supply:
        qty_available = float(supply.payload.qty_on_hand or 0) - float(supply.payload.qty_reserved or 0)
        grams_available = float(supply.payload.grams_on_hand or 0) - float(supply.payload.grams_reserved or 0)
        if supply_type == SupplyType.FILAMENT and grams_available == 0 and qty_available > 0:
            # Backward compatibility with earlier records where grams were stored in qty fields.
            grams_available = qty_available

    remaining_qty = float(qty_available - required_quantity_for_batch)
    remaining_grams = float(grams_available - required_grams_for_batch)
    can_produce = remaining_grams >= 0 if supply_type == SupplyType.FILAMENT else remaining_qty >= 0
    part_print_hours = float(part.payload.print_hours or 0) if part else float(record.payload.print_hours or 0)
    return ProductRecipePartRead(
        id=record.object_id,
        variant_id=record.payload.variant_id,
        part_id=record.payload.part_id,
        part_name=record.payload.part_name,
        supply_id=record.payload.supply_id,
        supply_name=record.payload.supply_name,
        filament_id=record.payload.filament_id,
        filament_name=record.payload.filament_name,
        supply_type=supply_type,
        batch_yield=batch_yield,
        grams=grams,
        quantity=quantity,
        required_grams_for_batch=required_grams_for_batch,
        required_quantity_for_batch=required_quantity_for_batch,
        print_hours=part_print_hours,
        available_quantity=qty_available,
        available_grams=grams_available,
        remaining_quantity_after_batch=remaining_qty,
        remaining_grams_after_batch=remaining_grams,
        can_produce=can_produce,
        cost_per_kilo=cost_per_kilo,
        cost_per_piece=cost_per_piece,
        cost_of_part=float(record.payload.cost_of_part or 0),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.get('/parts', response_model=PartListResponse)
def list_parts(tenant_id: str = Query('tenant-admin')) -> PartListResponse:
    records = [map_record(record, PartDocument) for record in part_controller.list(tenant_id)]
    return PartListResponse(parts=[_to_part(record) for record in records])


@router.post('/parts', response_model=PartRead)
def create_part(payload: PartCreate, tenant_id: str = Query('tenant-admin')) -> PartRead:
    record = map_record(
        part_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        PartDocument,
    )
    return _to_part(record)


@router.get('', response_model=ProductListResponse)
def list_products(tenant_id: str = Query('tenant-admin')) -> ProductListResponse:
    records = [map_record(record, ProductDocument) for record in product_controller.list(tenant_id)]
    return ProductListResponse(products=[_to_product(record) for record in records])


@router.post('', response_model=ProductRead)
def create_product(payload: ProductCreate, tenant_id: str = Query('tenant-admin')) -> ProductRead:
    product_line_record: dict | None = None
    try:
        product_line_record = product_line_controller.get(payload.product_line_id, tenant_id)
    except HTTPException as exc:
        if exc.status_code != 404:
            raise

    if not product_line_record:
        for line in product_line_controller.list(tenant_id):
            mapped = map_record(line, ProductLineDocument)
            if mapped.payload.code == payload.product_line_id:
                product_line_record = line
                break

    if not product_line_record:
        raise HTTPException(status_code=404, detail='Product line not found')

    product_line = map_record(product_line_record, ProductLineDocument)
    create_payload = payload.model_dump(exclude_none=True)
    create_payload['fsn'] = _normalize_fsn(create_payload.get('fsn'), 'normal')
    create_payload['product_line_id'] = product_line.object_id
    create_payload['product_line_name'] = product_line.payload.name
    create_payload['product_line_code'] = product_line.payload.code
    record = map_record(
        product_controller.create(tenant_id, create_payload),
        ProductDocument,
    )
    try:
        variant_controller.create(tenant_id, {
            'product_id': record.object_id,
            'name': record.payload.name,
            'fsn': _normalize_fsn(record.payload.fsn, 'normal'),
            'yield_units': 1,
            'print_hours': 0.0,
        })
    except Exception as exc:
        product_controller.delete(record.object_id, tenant_id)
        raise HTTPException(status_code=500, detail=f'Failed to create default variant: {exc}') from exc
    return _to_product(record)


@router.delete('/{id}')
def delete_product(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    variant_records = [map_record(record, ProductVariantDocument) for record in variant_controller.list(tenant_id)]
    has_variants = any(variant.payload.product_id == id for variant in variant_records)
    if has_variants:
        raise HTTPException(
            status_code=409,
            detail='Cannot delete product with associated variants',
        )
    return {'deleted': product_controller.delete(id, tenant_id)}


@router.put('/{id}', response_model=ProductRead)
def update_product(id: str, payload: ProductUpdate, tenant_id: str = Query('tenant-admin')) -> ProductRead:
    existing = map_record(product_controller.get(id, tenant_id), ProductDocument)
    product_line = map_record(product_line_controller.get(payload.product_line_id, tenant_id), ProductLineDocument)
    update_payload = payload.model_dump(exclude_none=True)
    if 'fsn' in update_payload:
        update_payload['fsn'] = _normalize_fsn(update_payload.get('fsn'), 'normal')
    update_payload['product_code'] = existing.payload.product_code or existing.payload.sku or existing.object_id
    update_payload['product_line_id'] = product_line.object_id
    update_payload['product_line_name'] = product_line.payload.name
    update_payload['product_line_code'] = product_line.payload.code
    record = map_record(
        product_controller.update(id, tenant_id, update_payload),
        ProductDocument,
    )
    return _to_product(record)


@router.get('/variants', response_model=ProductVariantListResponse)
def list_product_variants(
    tenant_id: str = Query('tenant-admin'),
    product_id: str | None = None,
) -> ProductVariantListResponse:
    records = [map_record(record, ProductVariantDocument) for record in variant_controller.list(tenant_id)]
    variants = [_to_variant(record, tenant_id) for record in records]
    if product_id:
        variants = [variant for variant in variants if variant.product_id == product_id]
    return ProductVariantListResponse(variants=variants)


@router.get('/variants/{id}', response_model=ProductVariantRead)
def get_product_variant(id: str, tenant_id: str = Query('tenant-admin')) -> ProductVariantRead:
    return _to_variant(map_record(variant_controller.get(id, tenant_id), ProductVariantDocument), tenant_id)


@router.put('/variants/{id}', response_model=ProductVariantRead)
def update_product_variant(id: str, payload: ProductVariantUpdate, tenant_id: str = Query('tenant-admin')) -> ProductVariantRead:
    existing = map_record(variant_controller.get(id, tenant_id), ProductVariantDocument)
    merged = existing.payload.model_dump(exclude_none=True)
    updates = payload.model_dump(exclude_none=True)
    if 'fsn' in updates:
        updates['fsn'] = _normalize_fsn(updates.get('fsn'), 'normal')
    merged.update(updates)
    merged['yield_units'] = max(1, int(merged.get('yield_units') or 1))
    merged['print_hours'] = float(merged.get('print_hours') or 0)
    merged['sku'] = existing.payload.sku
    merged['qr_code'] = existing.payload.qr_code
    record = map_record(variant_controller.update(id, tenant_id, merged), ProductVariantDocument)
    return _to_variant(record, tenant_id)


@router.delete('/variants/{id}')
def delete_product_variant(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    variant_controller.get(id, tenant_id)

    stock_records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    has_stock = any(
        stock.payload.product_variant_id == id
        and (float(stock.payload.qty_on_hand or 0) > 0 or float(stock.payload.qty_reserved or 0) > 0)
        for stock in stock_records
    )
    if has_stock:
        raise HTTPException(
            status_code=409,
            detail='Cannot delete variant with existing stock. Transfer/dispense stock to zero first.',
        )

    recipe_records = [map_record(record, ProductRecipePartDocument) for record in recipe_part_controller.list(tenant_id)]
    for recipe in recipe_records:
        if recipe.payload.variant_id == id:
            recipe_part_controller.delete(recipe.object_id, tenant_id)

    return {'deleted': variant_controller.delete(id, tenant_id)}


@router.get('/variants/{id}/recipe-parts', response_model=ProductRecipePartListResponse)
def list_variant_recipe_parts(id: str, tenant_id: str = Query('tenant-admin')) -> ProductRecipePartListResponse:
    variant = map_record(variant_controller.get(id, tenant_id), ProductVariantDocument)
    yield_units = max(1, int(variant.payload.yield_units or 1))
    variant_print_hours = float(variant.payload.print_hours or 0)
    records = [map_record(record, ProductRecipePartDocument) for record in recipe_part_controller.list(tenant_id)]
    supply_records = [map_record(record, SupplyDocument) for record in supply_controller.list(tenant_id)]
    part_records = [map_record(record, PartDocument) for record in part_controller.list(tenant_id)]
    supply_by_id = {supply.object_id: supply for supply in supply_records}
    part_by_id = {part.object_id: part for part in part_records}
    parts = [
        _to_recipe_part(
            record,
            supply_by_id.get(record.payload.supply_id),
            part_by_id.get(record.payload.part_id) if record.payload.part_id else None,
            yield_units,
        )
        for record in records
        if record.payload.variant_id == id
    ]
    total_cost = float(sum(float(part.cost_of_part or 0) for part in parts))
    unique_part_hours: dict[str, float] = {}
    ad_hoc_hours = 0.0
    for part in parts:
        if part.part_id:
            unique_part_hours[part.part_id] = max(unique_part_hours.get(part.part_id, 0.0), float(part.print_hours or 0))
        else:
            ad_hoc_hours += float(part.print_hours or 0)
    total_part_hours = float(sum(unique_part_hours.values()) + ad_hoc_hours)
    total_batch_hours = float(variant_print_hours + total_part_hours)
    price_per_unit = total_cost
    hours_per_unit = float(total_batch_hours / yield_units) if yield_units > 0 else 0.0
    can_produce_batch = all(bool(part.can_produce) for part in parts) if parts else True
    return ProductRecipePartListResponse(
        parts=parts,
        total_cost=total_cost,
        total_part_hours=total_part_hours,
        variant_print_hours=variant_print_hours,
        total_batch_hours=total_batch_hours,
        yield_units=yield_units,
        price_per_unit=price_per_unit,
        hours_per_unit=hours_per_unit,
        can_produce_batch=can_produce_batch,
    )


@router.post('/variants/{id}/recipe-parts', response_model=ProductRecipePartRead)
def create_variant_recipe_part(
    id: str,
    payload: ProductRecipePartCreate,
    tenant_id: str = Query('tenant-admin'),
) -> ProductRecipePartRead:
    variant = map_record(variant_controller.get(id, tenant_id), ProductVariantDocument)
    supply = map_record(supply_controller.get(payload.supply_id, tenant_id), SupplyDocument)
    supply_type = _infer_supply_type_for_record(
        supply.payload.supply_type,
        cost_per_kilo=float(supply.payload.cost_per_kilo or 0),
        cost_per_piece=float(supply.payload.cost_per_piece or 0),
    )
    grams = float(payload.grams or 0)
    quantity = float(payload.quantity or 0)
    batch_yield = max(1.0, float(payload.batch_yield or 1.0))
    print_hours = float(payload.print_hours or 0)

    part_id: str | None = payload.part_id
    part_name: str | None = None
    if supply_type == SupplyType.FILAMENT:
        if not part_id:
            raise HTTPException(status_code=400, detail='part_id is required for filament parts')
        part = map_record(part_controller.get(part_id, tenant_id), PartDocument)
        part_name = part.payload.name
        print_hours = float(part.payload.print_hours or print_hours or 0)
    else:
        print_hours = 0.0
    if supply_type == SupplyType.FILAMENT and grams <= 0:
        raise HTTPException(status_code=400, detail='Grams must be greater than zero for filament parts')
    if supply_type == SupplyType.CONSUMABLE and quantity <= 0:
        raise HTTPException(status_code=400, detail='Quantity must be greater than zero for consumable parts')

    cost_per_kilo = float(supply.payload.cost_per_kilo or 0)
    cost_per_piece = float(supply.payload.cost_per_piece or 0)
    grams_per_unit = float(grams / batch_yield) if supply_type == SupplyType.FILAMENT else grams
    quantity_per_unit = float(quantity / batch_yield) if supply_type == SupplyType.CONSUMABLE else quantity
    cost_of_part = (
        float((grams_per_unit / 1000.0) * cost_per_kilo)
        if supply_type == SupplyType.FILAMENT
        else float(quantity_per_unit * cost_per_piece)
    )
    record = map_record(
        recipe_part_controller.create(tenant_id, {
            'variant_id': id,
            'part_id': part_id,
            'part_name': part_name,
            'supply_id': payload.supply_id,
            'supply_name': supply.payload.name,
            'filament_id': payload.supply_id if supply_type == SupplyType.FILAMENT else None,
            'filament_name': supply.payload.name if supply_type == SupplyType.FILAMENT else None,
            'supply_type': supply_type.value,
            'batch_yield': batch_yield,
            'grams': grams_per_unit,
            'quantity': quantity_per_unit,
            'print_hours': print_hours,
            'cost_per_kilo': cost_per_kilo,
            'cost_per_piece': cost_per_piece,
            'cost_of_part': cost_of_part,
        }),
        ProductRecipePartDocument,
    )
    yield_units = int(variant.payload.yield_units or 1)
    return _to_recipe_part(record, supply, part if supply_type == SupplyType.FILAMENT else None, yield_units)


@router.post('/variants', response_model=ProductVariantRead)
def create_product_variant(payload: ProductVariantCreate, tenant_id: str = Query('tenant-admin')) -> ProductVariantRead:
    product_controller.get(payload.product_id, tenant_id)
    create_payload = payload.model_dump(exclude_none=True)
    if 'fsn' in create_payload and create_payload.get('fsn') is not None:
        create_payload['fsn'] = _normalize_fsn(create_payload.get('fsn'), 'normal')
    record = map_record(
        variant_controller.create(tenant_id, create_payload),
        ProductVariantDocument,
    )
    return _to_variant(record, tenant_id)


@router.get('/variants/resolve/{qr_code}', response_model=ProductVariantRead)
def resolve_variant_by_qr(qr_code: str, tenant_id: str = Query('tenant-admin')) -> ProductVariantRead:
    records = [map_record(record, ProductVariantDocument) for record in variant_controller.list(tenant_id)]
    for record in records:
        variant = _to_variant(record, tenant_id)
        if variant.qr_code == qr_code:
            return variant
    raise HTTPException(status_code=404, detail='Variant not found for qr_code')


@router.get('/{id}', response_model=ProductDetailResponse)
def get_product(id: str, tenant_id: str = Query('tenant-admin')) -> ProductDetailResponse:
    product = _to_product(map_record(product_controller.get(id, tenant_id), ProductDocument))
    variant_records = [map_record(record, ProductVariantDocument) for record in variant_controller.list(tenant_id)]
    variants = [_to_variant(record, tenant_id) for record in variant_records if record.payload.product_id == id]
    return ProductDetailResponse(product=product, variants=variants)
