from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class NotificationDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "notification"
    id: int | None = None
    store_id: int | None = None
    event_ts: datetime | None = None
    icon_name: str | None = None
    event_body: str | None = None
    expire_at: datetime | None = None
    employee_id: int | None = None
    dismissed_at: datetime | None = None
    portal_seen: bool | None = None
    notification_type: str | None = None
    notification_level: str | None = None
    notification_details: str | None = None
    expires_at: datetime | None = None
