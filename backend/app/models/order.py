from typing import Any
from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class OrderDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "order"
    id: int | None = None
    uuid: str | None = None
    number: str | None = None
    store_id: int | None = None
    customer_id: int | None = None
    status: str | None = None
    source: str | None = None
    items: str | None = None
    total: float | None = None
    subtotal: float | None = None
    discount: float | None = None
    tax: float | None = None
    time_last_updated: datetime | None = None
    time_unstarted: datetime | None = None
    time_accepted: datetime | None = None
    time_packaging: datetime | None = None
    time_ready_for_pickup: datetime | None = None
    time_completed: datetime | None = None
    pos_meta: dict[str, Any] | list[Any] | None = None
    created_at: datetime | None = None
    notes: str | None = None
    last_updating_source: str | None = None
