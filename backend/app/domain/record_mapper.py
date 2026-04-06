from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)


@dataclass
class StoredRecord(Generic[T]):
    object_id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    payload: T


def _to_datetime(value: object) -> datetime:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        return datetime.fromisoformat(value)
    return datetime.now(timezone.utc)


def map_record(record: dict, payload_model: type[T]) -> StoredRecord[T]:
    return StoredRecord(
        object_id=str(record.get('object_id', '')),
        tenant_id=str(record.get('tenant_id', '')),
        created_at=_to_datetime(record.get('created_at')),
        updated_at=_to_datetime(record.get('updated_at')),
        payload=payload_model.model_validate(record.get('payload', {})),
    )
