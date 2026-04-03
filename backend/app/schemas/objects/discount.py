from app.models.discount import DiscountDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class DiscountUpsertRequest(BaseObjectUpsertRequest):
    payload: DiscountDocument


class DiscountResponse(BaseObjectResponse):
    payload: DiscountDocument

    @classmethod
    def from_record(cls, record: dict) -> 'DiscountResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=DiscountDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
