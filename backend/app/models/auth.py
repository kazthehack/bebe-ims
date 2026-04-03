from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class AuthDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "auth"
    expires: datetime | None = None
    created_at: datetime | None = None
    id: int | None = None
    employee_id: str | None = None
    refresh_token_id: str | None = None
    terminal_id: str | None = None
    owner_type: str | None = None
    auth_token_id: str | None = None
    store_id: str | None = None
    source: str | None = None
