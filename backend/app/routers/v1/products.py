from __future__ import annotations

from fastapi import APIRouter

from app.controllers.product import product
from app.models.product import ProductModel, ProductRecipeModel
from app.schemas.product import (
    ProductCreateRequest,
    ProductDetailResponse,
    ProductImportRequest,
    ProductImportResponse,
    ProductListResponse,
    ProductRecipeCreateRequest,
    ProductRecipeListResponse,
    ProductVariantListResponse,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def list_products() -> ProductListResponse:
    return ProductListResponse(products=product.list())


@router.post("", response_model=ProductModel)
def create_product(payload: ProductCreateRequest) -> ProductModel:
    return product.create(payload)


@router.post("/import", response_model=ProductImportResponse)
def import_products(payload: ProductImportRequest) -> ProductImportResponse:
    return product.import_data(payload)


@router.get("/variants", response_model=ProductVariantListResponse)
def list_product_variants() -> ProductVariantListResponse:
    return ProductVariantListResponse(variants=product.list_variants())


@router.get("/recipes", response_model=ProductRecipeListResponse)
def list_product_recipes() -> ProductRecipeListResponse:
    return ProductRecipeListResponse(recipes=product.list_recipes())


@router.post("/recipes", response_model=ProductRecipeModel)
def create_product_recipe(payload: ProductRecipeCreateRequest) -> ProductRecipeModel:
    return product.create_recipe(payload)


@router.get("/{id}", response_model=ProductDetailResponse)
def get_product(id: str) -> ProductDetailResponse:
    return product.get(id)
