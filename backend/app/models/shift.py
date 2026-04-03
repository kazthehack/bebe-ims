from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class ShiftDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "shift"
    id: int | None = None
    store_id: int | None = None
    uuid: str | None = None
    terminal_id: int | None = None
    terminal_name: str | None = None
    open_ts: datetime | None = None
    close_ts: datetime | None = None
    close_data: str | None = None
    data_version: str | None = None
    shift_id: int | None = None
    employee_id: int | None = None
    approved_by: int | None = None
    notes: str | None = None
    event_ts: datetime | None = None
    event_type: str | None = None
    event_amount: float | None = None
