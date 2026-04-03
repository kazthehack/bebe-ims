from datetime import datetime
from typing import Type

from pydantic import BaseModel, Field


class BaseObjectUpsertRequest(BaseModel):
    tenant_id: str = Field(min_length=1)


class BaseObjectResponse(BaseModel):
    object_type: str
    tenant_id: str
    object_id: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def _coerce_payload(cls, payload_model: Type[BaseModel], payload: dict) -> BaseModel:
        return payload_model.model_validate(payload or {})
