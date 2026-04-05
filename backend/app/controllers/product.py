from __future__ import annotations

from app.models.product import (
    ProductDetailModel,
    ProductMaterialModel,
    ProductModel,
    ProductPartModel,
    ProductRecipeModel,
    ProductVariantModel,
)
from app.schemas.product import (
    ProductCreateRequest,
    ProductImportRequest,
    ProductImportResponse,
    ProductRecipeCreateRequest,
)


class Product:
    def __init__(self) -> None:
        self.products: list[ProductModel] = [
            ProductModel(id="prd-001", category="Accessories", name="Keychain Alpha", variants=["Red", "Blue"], cost_php=43.30),
            ProductModel(id="prd-002", category="Accessories", name="Keyring Beta", variants=["Standard"], cost_php=27.50),
        ]
        self.variants: list[ProductVariantModel] = [
            ProductVariantModel(id="var-001", product_id="prd-001", name="Red", percentage_mix="Part A 60% / Part B 40%"),
            ProductVariantModel(id="var-002", product_id="prd-001", name="Blue", percentage_mix="Part A 55% / Part B 45%"),
        ]
        self.recipes: list[ProductRecipeModel] = [
            ProductRecipeModel(
                id="rcp-001",
                product_id="prd-001",
                product_name="Keychain Alpha",
                variant="Red",
                percentage_mix="Part A 60% / Part B 40%",
                lines=[
                    {"material": "Filament Red PLA", "quantity": 22.0, "uom": "grams", "unit_cost_php": 1.80},
                    {"material": "Keyring", "quantity": 1.0, "uom": "piece", "unit_cost_php": 2.50},
                    {"material": "Clasp", "quantity": 1.0, "uom": "piece", "unit_cost_php": 1.20},
                ],
                unit_cost_php=43.30,
            ),
        ]
        self.details: dict[str, ProductDetailModel] = {
            "prd-001": ProductDetailModel(
                id="prd-001",
                category="Accessories",
                name="Keychain Alpha",
                variants=["Red", "Blue"],
                parts=[
                    ProductPartModel(
                        id="part-001",
                        name="Main Body",
                        part_type="production_part",
                        materials=[
                            ProductMaterialModel(id="mat-001", name="Filament Red PLA", quantity=22.0, uom="grams", cost_php=39.60),
                        ],
                        cost_php=39.60,
                    ),
                    ProductPartModel(
                        id="part-002",
                        name="Attachment Set",
                        part_type="consumable",
                        materials=[
                            ProductMaterialModel(id="mat-002", name="Keyring", quantity=1.0, uom="piece", cost_php=2.50),
                            ProductMaterialModel(id="mat-003", name="Clasp", quantity=1.0, uom="piece", cost_php=1.20),
                        ],
                        cost_php=3.70,
                    ),
                ],
                total_cost_php=43.30,
            ),
            "prd-002": ProductDetailModel(
                id="prd-002",
                category="Accessories",
                name="Keyring Beta",
                variants=["Standard"],
                parts=[],
                total_cost_php=27.50,
            ),
        }

    def _next_id(self, prefix: str, items: list[object]) -> str:
        return f"{prefix}-{len(items) + 1:03d}"

    def list(self) -> list[ProductModel]:
        return self.products

    def get(self, product_id: str) -> ProductDetailModel:
        if product_id in self.details:
            return self.details[product_id]
        return ProductDetailModel(
            id=product_id,
            category="Uncategorized",
            name=f"Product {product_id}",
            variants=["Default"],
            parts=[],
            total_cost_php=0.0,
        )

    def create(self, payload: ProductCreateRequest) -> ProductModel:
        new_id = self._next_id("prd", self.products)
        variants = payload.variants if payload.variants else ["Default"]
        product = ProductModel(
            id=new_id,
            category=payload.category,
            name=payload.name,
            variants=variants,
            cost_php=0.0,
        )
        self.products.append(product)
        self.details[new_id] = ProductDetailModel(
            id=new_id,
            category=payload.category,
            name=payload.name,
            variants=variants,
            parts=[],
            total_cost_php=0.0,
        )
        return product

    def list_variants(self) -> list[ProductVariantModel]:
        return self.variants

    def list_recipes(self) -> list[ProductRecipeModel]:
        return self.recipes

    def create_recipe(self, payload: ProductRecipeCreateRequest) -> ProductRecipeModel:
        recipe = ProductRecipeModel(
            id=self._next_id("rcp", self.recipes),
            product_id=payload.product_id,
            product_name=payload.product_name,
            variant=payload.variant,
            percentage_mix=payload.percentage_mix,
            lines=payload.lines,
            unit_cost_php=payload.unit_cost_php,
        )
        self.recipes.append(recipe)
        return recipe

    def import_data(self, payload: ProductImportRequest) -> ProductImportResponse:
        for item in payload.items:
            self.create(
                ProductCreateRequest(
                    category=item.category,
                    name=item.name,
                    variants=item.variants,
                )
            )
        return ProductImportResponse(imported=len(payload.items), total_products=len(self.products))


product = Product()
