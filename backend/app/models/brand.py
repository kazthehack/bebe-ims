from pydantic import ConfigDict
from app.models.base import ObjectDocument


class BrandDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "brand"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
