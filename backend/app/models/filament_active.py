from pydantic import ConfigDict

from app.models.base import ObjectDocument


class FilamentActiveDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'filament_active'
    id: str | None = None
    filament_id: str
    grams_remaining: float = 0.0
    notes: str | None = None
    status: str = 'active'
