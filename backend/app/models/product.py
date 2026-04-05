from __future__ import annotations

from pydantic import BaseModel


class ProductMaterialModel(BaseModel):
    id: str
    name: str
    quantity: float
    uom: str
    cost_php: float


class ProductPartModel(BaseModel):
    id: str
    name: str
    part_type: str
    materials: list[ProductMaterialModel]
    cost_php: float


class ProductModel(BaseModel):
    id: str
    category: str
    name: str
    variants: list[str]
    cost_php: float


class ProductDetailModel(BaseModel):
    id: str
    category: str
    name: str
    variants: list[str]
    parts: list[ProductPartModel]
    total_cost_php: float


class ProductVariantModel(BaseModel):
    id: str
    product_id: str
    name: str
    percentage_mix: str


class ProductRecipeLineModel(BaseModel):
    material: str
    quantity: float
    uom: str
    unit_cost_php: float


class ProductRecipeModel(BaseModel):
    id: str
    product_id: str
    product_name: str
    variant: str
    percentage_mix: str
    lines: list[ProductRecipeLineModel]
    unit_cost_php: float
