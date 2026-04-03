from app.models.shift import ShiftDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class ShiftUpsertRequest(BaseObjectUpsertRequest):
    payload: ShiftDocument


class ShiftResponse(BaseObjectResponse):
    payload: ShiftDocument

    @classmethod
    def from_record(cls, record: dict) -> 'ShiftResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=ShiftDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
