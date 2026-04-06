from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.sale_receipt_item import SaleReceiptItemDocument


class SaleReceiptItem(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('sale_receipt_item', SaleReceiptItemDocument, repository)
