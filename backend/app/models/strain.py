from pydantic import ConfigDict
from app.models.base import ObjectDocument


class StrainDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "strain"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
    metrc_strain_id: int | None = None
    strain_id: int | None = None
