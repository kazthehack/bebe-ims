from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SiteDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'site'
    id: str | None = None
    code: str
    name: str
    location: str | None = None
    active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None
