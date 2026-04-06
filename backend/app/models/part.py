from pydantic import ConfigDict

from app.models.base import ObjectDocument


class PartDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'part'
    id: str | None = None
    name: str
    description: str | None = None
    active: bool = True
