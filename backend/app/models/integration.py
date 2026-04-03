from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class IntegrationDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "integration"
    active: bool | None = None
    visible: bool | None = None
    force_disabled: bool | None = None
    license_number: str | None = None
    connected_at: datetime | None = None
    read_only: bool | None = None
    api_fail_count: int | None = None
    api_call_count: int | None = None
    last_connected_at: datetime | None = None
    last_updated_item_at: datetime | None = None
    last_fully_synced_menu_at: datetime | None = None
    last_call_at: datetime | None = None
    instructions: str | None = None
