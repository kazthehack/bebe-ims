from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.product_recipe_part import ProductRecipePartDocument


class ProductRecipePart(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('product_recipe_part', ProductRecipePartDocument, repository)
