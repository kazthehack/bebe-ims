from typing import Any
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class UnitsDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "units"
    payload: dict[str, Any] | None = None
