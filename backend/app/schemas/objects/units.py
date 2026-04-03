from app.models.units import UnitsDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class UnitsUpsertRequest(BaseObjectUpsertRequest):
    payload: UnitsDocument


class UnitsResponse(BaseObjectResponse):
    payload: UnitsDocument

    @classmethod
    def from_record(cls, record: dict) -> 'UnitsResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=UnitsDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
