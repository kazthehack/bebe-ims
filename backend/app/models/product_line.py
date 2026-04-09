from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class ProductLineDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'product_line'
    id: str | None = None
    code: str
    name: str
    description: str | None = None
    active: bool = True
    seed_source: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
