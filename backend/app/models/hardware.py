from datetime import datetime
from pydantic import ConfigDict
from app.models.base import ObjectDocument


class HardwareDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "hardware"
    id: int | None = None
    store_id: int | None = None
    name: str | None = None
    idfv: str | None = None
    archived_date: datetime | None = None
    terminal_id: int | None = None
    hardware_type: str | None = None
    model: str | None = None
    submodel: str | None = None
    ip_address: str | None = None
    mac_address: str | None = None
