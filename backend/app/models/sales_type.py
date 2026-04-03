from pydantic import ConfigDict
from app.models.base import ObjectDocument


class SalesTypeDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "sales_type"
    id: int | None = None
    state: str | None = None
    name: str | None = None
    liquid: bool | None = None
    category: str | None = None
    unit: str | None = None
    icon_name: str | None = None
