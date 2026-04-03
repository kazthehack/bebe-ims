from app.models.tax import TaxDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class TaxUpsertRequest(BaseObjectUpsertRequest):
    payload: TaxDocument


class TaxResponse(BaseObjectResponse):
    payload: TaxDocument

    @classmethod
    def from_record(cls, record: dict) -> 'TaxResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=TaxDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
