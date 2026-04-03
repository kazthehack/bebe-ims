from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.sales_report import SalesReportDocument


class SalesReportController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('sales_report', SalesReportDocument, repository)
