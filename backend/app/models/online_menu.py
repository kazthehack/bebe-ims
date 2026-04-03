from pydantic import ConfigDict
from app.models.base import ObjectDocument


class OnlineMenuDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "online_menu"
    link: str | None = None
    store_id: int | None = None
    active: bool | None = None
    redirect_to: str | None = None
    is_default: bool | None = None
