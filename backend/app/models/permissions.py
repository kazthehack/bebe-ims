from pydantic import ConfigDict
from app.models.base import ObjectDocument


class PermissionsDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "permissions"
    id: int | None = None
    organization_id: int | None = None
    name: str | None = None
    description: str | None = None
    permissions: str | None = None
    store_id: int | None = None
    employee_id: int | None = None
    role_id: int | None = None
    pin_code: str | None = None
