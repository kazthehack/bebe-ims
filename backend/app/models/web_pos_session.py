from datetime import datetime

from pydantic import ConfigDict

from app.domain.enums import WebPosSessionStatus
from app.models.base import ObjectDocument


class WebPosSessionDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'web_pos_session'
    id: str | None = None
    site_id: str
    employee_id: str
    event_id: str | None = None
    opening_cash: float = 0.0
    closing_cash: float | None = None
    close_notes: str | None = None
    status: WebPosSessionStatus = WebPosSessionStatus.OPEN
    opened_at: datetime | None = None
    closed_at: datetime | None = None
