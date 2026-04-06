from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.controllers.filament import Filament
from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product_stock import ProductStock
from app.controllers.supply import Supply
from app.domain.enums import StockTargetType, SupplyType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.filament import FilamentDocument
from app.models.inventory_adjustment import InventoryAdjustmentDocument
from app.models.product_stock import ProductStockDocument
from app.models.supply import SupplyDocument
from app.schemas.stock import (
    FilamentCreate,
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
)

router = APIRouter(prefix='/stock', tags=['stock'])

product_stock_controller = ProductStock()
supply_controller = Supply()
filament_controller = Filament()
adjustment_controller = InventoryAdjustment()


def _available(qty_on_hand: float, qty_reserved: float) -> float:
    return float(qty_on_hand or 0) - float(qty_reserved or 0)


def _normalize_supply_type(value: str | None) -> SupplyType:
    raw = str(value or '').strip().lower()
    if raw in ('consumable', SupplyType.CONSUMABLE.value):
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
    supply_type = _normalize_supply_type(record.payload.supply_type)
    # Backward compatibility: old records used qty fields to store filament grams.
    if supply_type == SupplyType.FILAMENT and grams_on_hand == 0 and qty_on_hand > 0:
        grams_on_hand = qty_on_hand
        grams_reserved = qty_reserved
    return SupplyRead(
        id=record.object_id,
        name=record.payload.name,
        supply_type=supply_type,
        cost_per_kilo=float(record.payload.cost_per_kilo or 0),
        cost_per_piece=float(record.payload.cost_per_piece or 0),
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
        updated_supply = supply.payload.model_copy(update={
            'qty_on_hand': float(supply.payload.qty_on_hand or 0) + float(payload.qty_delta),
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


@router.post('/supplies', response_model=SupplyRead)
def create_supply(payload: SupplyCreate, tenant_id: str = Query('tenant-admin')) -> SupplyRead:
    record = map_record(supply_controller.create(tenant_id, payload.model_dump(exclude_none=True)), SupplyDocument)
    return _to_supply(record)


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
