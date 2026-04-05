from __future__ import annotations

from pydantic import BaseModel

from app.models.product import (
    ProductDetailModel,
    ProductModel,
    ProductRecipeLineModel,
    ProductRecipeModel,
    ProductVariantModel,
)


class ProductCreateRequest(BaseModel):
    category: str
    name: str
    variants: list[str]


class ProductImportItemRequest(BaseModel):
    category: str
    name: str
    variants: list[str]


class ProductImportRequest(BaseModel):
    items: list[ProductImportItemRequest]


class ProductImportResponse(BaseModel):
    imported: int
    total_products: int


class ProductRecipeCreateRequest(BaseModel):
    product_id: str
    product_name: str
    variant: str
    percentage_mix: str
    lines: list[ProductRecipeLineModel]
    unit_cost_php: float


class ProductListResponse(BaseModel):
    products: list[ProductModel]


class ProductVariantListResponse(BaseModel):
    variants: list[ProductVariantModel]


class ProductRecipeListResponse(BaseModel):
    recipes: list[ProductRecipeModel]


ProductDetailResponse = ProductDetailModel
