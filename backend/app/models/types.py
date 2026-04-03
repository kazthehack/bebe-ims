from typing import Any
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class TypesDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "types"
    payload: dict[str, Any] | None = None
