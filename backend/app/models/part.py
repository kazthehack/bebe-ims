from pydantic import ConfigDict

from app.models.base import ObjectDocument


class PartDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'part'
    id: str | None = None
    name: str
    description: str | None = None
    print_hours: float = 0.0
    active: bool = True
