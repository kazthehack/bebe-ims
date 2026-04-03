from app.models.demo import DemoDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class DemoUpsertRequest(BaseObjectUpsertRequest):
    payload: DemoDocument


class DemoResponse(BaseObjectResponse):
    payload: DemoDocument

    @classmethod
    def from_record(cls, record: dict) -> 'DemoResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=DemoDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
