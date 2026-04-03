from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class ComplianceDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "compliance"
    id: int | None = None
    name: str | None = None
    store_id: int | None = None
    customer_type: str | None = None
    limit_quantity: float | None = None
    unit: str | None = None
    timeframe: str | None = None
    violation_stopped_count: int | None = None
    archived_date: datetime | None = None
    compliance_limits_id: int | None = None
    sales_type_id: int | None = None
