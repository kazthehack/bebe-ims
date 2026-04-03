from app.models.sales_type import SalesTypeDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class SalesTypeUpsertRequest(BaseObjectUpsertRequest):
    payload: SalesTypeDocument


class SalesTypeResponse(BaseObjectResponse):
    payload: SalesTypeDocument

    @classmethod
    def from_record(cls, record: dict) -> 'SalesTypeResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=SalesTypeDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
