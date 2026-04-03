from app.models.customer import CustomerDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class CustomerUpsertRequest(BaseObjectUpsertRequest):
    payload: CustomerDocument


class CustomerResponse(BaseObjectResponse):
    payload: CustomerDocument

    @classmethod
    def from_record(cls, record: dict) -> 'CustomerResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=CustomerDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
