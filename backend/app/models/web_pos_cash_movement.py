from datetime import datetime

from pydantic import ConfigDict

from app.domain.enums import WebPosCashMovementType
from app.models.base import ObjectDocument


class WebPosCashMovementDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'web_pos_cash_movement'
    id: str | None = None
    web_pos_session_id: str
    movement_type: WebPosCashMovementType
    amount: float
    notes: str | None = None
    created_at: datetime | None = None
