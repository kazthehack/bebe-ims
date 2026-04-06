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
    status: WebPosSessionStatus = WebPosSessionStatus.OPEN
    opened_at: datetime | None = None
    closed_at: datetime | None = None
