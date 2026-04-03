from __future__ import annotations

from datetime import datetime, timezone
from fastapi import HTTPException
from uuid import uuid4

from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord


class BaseObjectController:
    def __init__(self, object_type: str, model_cls, repository: ObjectRepository | None = None) -> None:
        self.object_type = object_type
        self.model_cls = model_cls
        self.repository = repository or ObjectRepository()

    def _validate_payload(self, payload: dict) -> dict:
        validated = self.model_cls.model_validate(payload)
        return validated.model_dump(exclude_none=True)

    def create(self, tenant_id: str, payload: dict) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        record = ObjectRecord(
            object_type=self.object_type,
            tenant_id=tenant_id,
            object_id=str(uuid4()),
            payload=self._validate_payload(payload),
            created_at=now,
            updated_at=now,
        )
        return self.repository.upsert_object(record)

    def update(self, object_id: str, tenant_id: str, payload: dict) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        existing = self.repository.get_object(tenant_id, self.object_type, object_id)
        created_at = existing['created_at'].isoformat() if existing else now
        record = ObjectRecord(
            object_type=self.object_type,
            tenant_id=tenant_id,
            object_id=object_id,
            payload=self._validate_payload(payload),
            created_at=created_at,
            updated_at=now,
        )
        return self.repository.upsert_object(record)

    def get(self, object_id: str, tenant_id: str) -> dict:
        record = self.repository.get_object(tenant_id, self.object_type, object_id)
        if not record:
            raise HTTPException(status_code=404, detail='Object not found')
        return record

    def list(self, tenant_id: str) -> list[dict]:
        return self.repository.list_objects(tenant_id, self.object_type)
