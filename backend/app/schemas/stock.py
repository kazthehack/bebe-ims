from datetime import datetime

from pydantic import BaseModel

from app.domain.enums import InventoryAdjustmentType, StockTargetType, SupplyType


class ProductStockCreate(BaseModel):
    product_variant_id: str
    site_id: str
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    low_stock_threshold: float = 0.0


class ProductStockRead(BaseModel):
    id: str
    product_variant_id: str
    site_id: str
    qty_on_hand: float
    qty_reserved: float
    qty_available: float
    low_stock_threshold: float


class ProductStockListResponse(BaseModel):
    items: list[ProductStockRead]


class SupplyCreate(BaseModel):
    name: str
    supply_type: SupplyType = SupplyType.FILAMENT
    cost_per_kilo: float = 0.0
    cost_per_piece: float = 0.0
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    grams_on_hand: float = 0.0
    grams_reserved: float = 0.0


class SupplyRead(BaseModel):
    id: str
    name: str
    supply_type: SupplyType
    cost_per_kilo: float
    cost_per_piece: float
    qty_on_hand: float
    qty_reserved: float
    qty_available: float
    grams_on_hand: float
    grams_reserved: float
    grams_available: float


class SupplyListResponse(BaseModel):
    supplies: list[SupplyRead]


class FilamentCreate(BaseModel):
    brand: str
    color: str
    current_grams: float = 0.0
    reserved_grams: float = 0.0


class FilamentRead(BaseModel):
    id: str
    brand: str
    color: str
    current_grams: float
    reserved_grams: float
    available_grams: float


class FilamentListResponse(BaseModel):
    filaments: list[FilamentRead]


class InventoryAdjustmentCreate(BaseModel):
    target_type: StockTargetType
    target_id: str
    site_id: str | None = None
    adjustment_type: InventoryAdjustmentType
    qty_delta: float
    notes: str | None = None


class InventoryAdjustmentRead(BaseModel):
    id: str
    target_type: StockTargetType
    target_id: str
    site_id: str | None = None
    adjustment_type: InventoryAdjustmentType
    qty_delta: float
    notes: str | None = None
    created_at: datetime


class InventoryAdjustmentListResponse(BaseModel):
    adjustments: list[InventoryAdjustmentRead]
