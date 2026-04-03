from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.transaction_history_report import TransactionHistoryReportDocument


class TransactionHistoryReportController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('transaction_history_report', TransactionHistoryReportDocument, repository)
