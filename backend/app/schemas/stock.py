from datetime import datetime

from pydantic import BaseModel, Field

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
    brand: str | None = None
    material_type: str | None = None
    sub_type: str | None = None
    color: str | None = None
    stock_spools: float = 0.0
    spool_weight_grams: float = 1000.0
    estimated_remaining_weight_grams: float = 0.0
    source: str | None = None
    source_urls: list[str] = Field(default_factory=list)
    pieces_per_pack: float = 1.0
    cost_per_pack_min: float = 0.0
    cost_per_pack_max: float = 0.0
    cost_per_pack: float = 0.0
    cost_per_kilo: float = 0.0
    cost_per_piece: float = 0.0
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    grams_on_hand: float = 0.0
    grams_reserved: float = 0.0


class SupplyUpdate(BaseModel):
    name: str | None = None
    supply_type: SupplyType | None = None
    brand: str | None = None
    material_type: str | None = None
    sub_type: str | None = None
    color: str | None = None
    stock_spools: float | None = None
    spool_weight_grams: float | None = None
    estimated_remaining_weight_grams: float | None = None
    source: str | None = None
    source_urls: list[str] | None = None
    pieces_per_pack: float | None = None
    cost_per_pack_min: float | None = None
    cost_per_pack_max: float | None = None
    cost_per_pack: float | None = None
    cost_per_kilo: float | None = None
    cost_per_piece: float | None = None
    qty_on_hand: float | None = None
    qty_reserved: float | None = None
    grams_on_hand: float | None = None
    grams_reserved: float | None = None


class SupplyRead(BaseModel):
    id: str
    name: str
    supply_type: SupplyType
    brand: str | None = None
    material_type: str | None = None
    sub_type: str | None = None
    color: str | None = None
    stock_spools: float
    spool_weight_grams: float
    estimated_remaining_weight_grams: float
    source: str | None = None
    source_urls: list[str] = Field(default_factory=list)
    pieces_per_pack: float
    cost_per_pack_min: float
    cost_per_pack_max: float
    cost_per_pack: float
    cost_per_kilo: float
    cost_per_gram: float
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


class FilamentVariantAssociationRead(BaseModel):
    variant_id: str
    variant_sku: str
    variant_name: str | None = None
    product_id: str
    product_name: str


class FilamentVariantAssociationListResponse(BaseModel):
    variants: list[FilamentVariantAssociationRead]


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
