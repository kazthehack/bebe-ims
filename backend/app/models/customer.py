from pydantic import ConfigDict
from app.models.base import ObjectDocument


class CustomerDocument(ObjectDocument):
    model_config = ConfigDict(extra="allow")
    object_type: str = "customer"
    id: int | None = None
    store_id: int | None = None
    phone_number: str | None = None
    type: str | None = None
    sub_type: str | None = None
    medical_card_id: str | None = None
    caregiver_card_id: str | None = None
