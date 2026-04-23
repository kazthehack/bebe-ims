from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.domain.enums import SupplyType

FsnValue = Literal['fast', 'normal', 'slow', 'non_moving']

class ProductCreate(BaseModel):
    name: str
    product_line_id: str
    ip: str | None = None
    category: str | None = None
    list_price: float | None = None
    fsn: FsnValue = 'normal'
    capacity_threshold_per_site: float = Field(default=8.0, ge=1.0)
    description: str | None = None
    design_source: str | None = None
    third_party_source_url: str | None = None
    local_working_files: list[str] = Field(default_factory=list)
    image_url: str | None = None


class ProductRead(BaseModel):
    id: str
    product_code: str
    name: str
    product_line: str
    product_line_id: str
    ip: str | None = None
    category: str | None = None
    list_price: float
    fsn: FsnValue = 'normal'
    capacity_threshold_per_site: float = 8.0
    description: str | None = None
    design_source: str | None = None
    third_party_source_url: str | None = None
    local_working_files: list[str] = Field(default_factory=list)
    image_url: str | None = None
    created_at: datetime
    updated_at: datetime


class ProductUpdate(BaseModel):
    name: str
    product_line_id: str
    ip: str | None = None
    category: str | None = None
    list_price: float | None = None
    fsn: FsnValue | None = None
    capacity_threshold_per_site: float | None = Field(default=None, ge=1.0)
    description: str | None = None
    design_source: str | None = None
    third_party_source_url: str | None = None
    local_working_files: list[str] = Field(default_factory=list)
    image_url: str | None = None


class ProductCapacityThresholdUpdate(BaseModel):
    capacity_threshold_per_site: float = Field(ge=1.0)


class ProductListResponse(BaseModel):
    products: list[ProductRead]


class ProductVariantCreate(BaseModel):
    product_id: str
    sku: str | None = None
    name: str | None = None
    fsn: FsnValue | None = None
    capacity_threshold_per_site: float | None = Field(default=None, ge=1.0)
    yield_units: int = 1
    print_hours: float = 0.0
    image_url: str | None = None


class ProductVariantRead(BaseModel):
    id: str
    product_id: str
    sku: str
    name: str | None = None
    fsn: FsnValue = 'normal'
    capacity_threshold_per_site: float | None = None
    yield_units: int
    print_hours: float
    qr_code: str | None = None
    image_url: str | None = None
    created_at: datetime
    updated_at: datetime


class ProductVariantListResponse(BaseModel):
    variants: list[ProductVariantRead]


class ProductVariantUpdate(BaseModel):
    name: str | None = None
    fsn: FsnValue | None = None
    capacity_threshold_per_site: float | None = Field(default=None, ge=1.0)
    yield_units: int | None = None
    print_hours: float | None = None
    image_url: str | None = None


class PartCreate(BaseModel):
    name: str
    description: str | None = None
    print_hours: float = 0.0
    active: bool = True


class PartRead(BaseModel):
    id: str
    name: str
    description: str | None = None
    print_hours: float
    active: bool
    created_at: datetime
    updated_at: datetime


class PartListResponse(BaseModel):
    parts: list[PartRead]


class ProductRecipePartCreate(BaseModel):
    part_id: str | None = None
    supply_id: str
    batch_yield: float = 1.0
    grams: float | None = None
    quantity: float | None = None
    print_hours: float = 0.0


class ProductRecipePartRead(BaseModel):
    id: str
    variant_id: str
    part_id: str | None = None
    part_name: str | None = None
    supply_id: str
    supply_name: str
    filament_id: str | None = None
    filament_name: str | None = None
    supply_type: SupplyType
    batch_yield: float
    grams: float
    quantity: float
    required_grams_for_batch: float
    required_quantity_for_batch: float
    print_hours: float
    available_quantity: float
    available_grams: float
    remaining_quantity_after_batch: float
    remaining_grams_after_batch: float
    can_produce: bool
    cost_per_kilo: float
    cost_per_piece: float
    cost_of_part: float
    created_at: datetime
    updated_at: datetime


class ProductRecipePartListResponse(BaseModel):
    parts: list[ProductRecipePartRead]
    total_cost: float
    total_part_hours: float
    variant_print_hours: float
    total_batch_hours: float
    yield_units: int
    price_per_unit: float
    hours_per_unit: float
    can_produce_batch: bool


class ProductDetailResponse(BaseModel):
    product: ProductRead
    variants: list[ProductVariantRead]
