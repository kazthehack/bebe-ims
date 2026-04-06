from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.product_stock import ProductStockDocument


class ProductStock(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('product_stock', ProductStockDocument, repository)
