from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class DemoDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "demo"
    id: int | None = None
    email: str | None = None
    job_role: str | None = None
    created_at: datetime | None = None
    store_id: int | None = None
