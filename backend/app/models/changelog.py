from typing import Any
from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class ChangelogDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "changelog"
    id: int | None = None
    store_id: int | None = None
    employee_id: int | None = None
    timestamp: datetime | None = None
    payload: dict[str, Any] | list[Any] | None = None
    package_id: int | None = None
    changelog_id: int | None = None
