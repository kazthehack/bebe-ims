from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.inventory_report import InventoryReportDocument


class InventoryReportController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('inventory_report', InventoryReportDocument, repository)
