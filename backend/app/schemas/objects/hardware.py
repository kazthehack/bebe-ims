from app.models.hardware import HardwareDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class HardwareUpsertRequest(BaseObjectUpsertRequest):
    payload: HardwareDocument


class HardwareResponse(BaseObjectResponse):
    payload: HardwareDocument

    @classmethod
    def from_record(cls, record: dict) -> 'HardwareResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=HardwareDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
