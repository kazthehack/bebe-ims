from app.models.brand import BrandDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class BrandUpsertRequest(BaseObjectUpsertRequest):
    payload: BrandDocument


class BrandResponse(BaseObjectResponse):
    payload: BrandDocument

    @classmethod
    def from_record(cls, record: dict) -> 'BrandResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=BrandDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
