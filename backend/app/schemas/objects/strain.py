from app.models.strain import StrainDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class StrainUpsertRequest(BaseObjectUpsertRequest):
    payload: StrainDocument


class StrainResponse(BaseObjectResponse):
    payload: StrainDocument

    @classmethod
    def from_record(cls, record: dict) -> 'StrainResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=StrainDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
