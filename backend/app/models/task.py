from typing import Any
from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class TaskDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "task"
    id: int | None = None
    store_id: int | None = None
    uuid: str | None = None
    name: str | None = None
    arguments: dict[str, Any] | list[Any] | None = None
    error: str | None = None
    event_ts: datetime | None = None
