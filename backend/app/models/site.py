from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SiteDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'site'
    id: str | None = None
    code: str
    name: str
    location: str | None = None
    active: bool = True
    assigned_event_ids: list[str] = []
    active_event_id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
