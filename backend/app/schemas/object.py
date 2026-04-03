from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ObjectUpsertRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    payload: dict[str, Any] = Field(default_factory=dict)


class ObjectResponse(BaseModel):
    object_type: str
    tenant_id: str
    object_id: str
    payload: dict[str, Any]
    created_at: datetime
    updated_at: datetime
