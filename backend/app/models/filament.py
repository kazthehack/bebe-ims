from pydantic import ConfigDict

from app.models.base import ObjectDocument


class FilamentDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'filament'
    id: str | None = None
    brand: str
    color: str
    current_grams: float = 0.0
    reserved_grams: float = 0.0
