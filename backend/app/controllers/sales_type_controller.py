from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.sales_type import SalesTypeDocument


class SalesTypeController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('sales_type', SalesTypeDocument, repository)
