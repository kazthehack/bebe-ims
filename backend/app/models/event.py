from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class EventDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'event'
    id: str | None = None
    code: str | None = None
    title: str
    organizer: str | None = None
    rent_cost_per_day: float = 0.0
    start_date: str
    end_date: str
    start_time: str | None = None
    end_time: str | None = None
    location: str | None = None
    site_id: str | None = None
    status: str = 'scheduled'
    created_at: datetime | None = None
    updated_at: datetime | None = None
