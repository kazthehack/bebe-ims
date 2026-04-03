from app.models.order import OrderDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class OrderUpsertRequest(BaseObjectUpsertRequest):
    payload: OrderDocument


class OrderResponse(BaseObjectResponse):
    payload: OrderDocument

    @classmethod
    def from_record(cls, record: dict) -> 'OrderResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=OrderDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
