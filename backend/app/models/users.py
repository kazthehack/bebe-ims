from datetime import datetime, date
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class UsersDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "users"
    id: int | None = None
    organization_id: int | None = None
    name: str | None = None
    short_name: str | None = None
    email: str | None = None
    password: str | None = None
    global_active: bool | None = None
    phone: str | None = None
    address: str | None = None
    address_extra: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    worker_permit: str | None = None
    worker_permit_expiration: date | None = None
    created_at: datetime | None = None
    employee_id: int | None = None
    store_id: int | None = None
    active: bool | None = None
