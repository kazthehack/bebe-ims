from datetime import date, datetime

from pydantic import ConfigDict, Field

from app.models.base import ObjectDocument


class EmployeeDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")

    object_type: str = "employee"
    employee_code: str | None = None
    display_name: str | None = None
    legal_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    address_extra: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    worker_permit: str | None = None
    worker_permit_expiration: date | None = None
    employment_status: str = "active"
    site_ids: list[str] = Field(default_factory=list)
    created_at: datetime | None = None
    active: bool = True
