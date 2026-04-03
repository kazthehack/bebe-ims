from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class RewardDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "reward"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
    customer_type: str | None = None
    applies_to: str | None = None
    category: str | None = None
    amount_type: str | None = None
    amount: float | None = None
    active: bool | None = None
    point_cost: int | None = None
    archived_date: datetime | None = None
