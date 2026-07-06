from datetime import date, datetime

from pydantic import ConfigDict, Field

from app.domain.permissions import UserRole
from app.models.base import ObjectDocument


class UsersDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "users"
    id: str | int | None = None
    username: str | None = None
    role: UserRole = UserRole.USER
    permissions: list[str] = Field(default_factory=list)
    password_hash: str | None = Field(default=None, exclude=True)
    force_password_change: bool = False
    password_changed_at: datetime | None = None
    last_login_at: datetime | None = None
    employee_id: str | None = None
    organization_id: int | None = None
    name: str | None = None
    short_name: str | None = None
    email: str | None = None
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
    store_id: str | int | None = None
    active: bool | None = None
