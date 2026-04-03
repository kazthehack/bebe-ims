from app.models.receipt import ReceiptDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class ReceiptUpsertRequest(BaseObjectUpsertRequest):
    payload: ReceiptDocument


class ReceiptResponse(BaseObjectResponse):
    payload: ReceiptDocument

    @classmethod
    def from_record(cls, record: dict) -> 'ReceiptResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=ReceiptDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
