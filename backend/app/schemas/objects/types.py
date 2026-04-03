from app.models.types import TypesDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class TypesUpsertRequest(BaseObjectUpsertRequest):
    payload: TypesDocument


class TypesResponse(BaseObjectResponse):
    payload: TypesDocument

    @classmethod
    def from_record(cls, record: dict) -> 'TypesResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=TypesDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
