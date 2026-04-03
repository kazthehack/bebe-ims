from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.sales_export import SalesExportDocument


class SalesExportController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('sales_export', SalesExportDocument, repository)
