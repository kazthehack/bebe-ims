from datetime import datetime, date as date_type
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class TaxDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "tax"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
    customer_type: str | None = None
    applies_to: str | None = None
    amount_type: str | None = None
    amount: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    active: bool | None = None
    archived_date: datetime | None = None
    tax_id: int | None = None
    sales_type: int | None = None
    state: str | None = None
    effective_date: datetime | None = None
    state_rate: float | None = None
    administrative_fee_rate: float | None = None
    tax_report_rate_id: int | None = None
    report_type: str | None = None
    date: date_type | None = None
    total_retail_sales: float | None = None
    total_tax_exempt_sales: float | None = None
    tax_collected: float | None = None
    created_at: datetime | None = None
    upload_path: str | None = None
