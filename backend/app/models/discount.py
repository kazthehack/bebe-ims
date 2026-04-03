from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class DiscountDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "discount"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
    customer_type: str | None = None
    requires_approval: bool | None = None
    has_schedule: bool | None = None
    applies_to: str | None = None
    category: str | None = None
    amount_type: str | None = None
    amount: float | None = None
    active: bool | None = None
    archived_date: datetime | None = None
    discount_id: int | None = None
    all_day_selected: bool | None = None
    cron_string: str | None = None
    duration: int | None = None
    sales_type: int | None = None
