from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class TransactionHistoryReportDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "transaction_history_report"
    id: int | None = None
    store_id: int | None = None
    filename: str | None = None
    upload_path: str | None = None
    report_type: str | None = None
    created_at: datetime | None = None
    expires_at: datetime | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
