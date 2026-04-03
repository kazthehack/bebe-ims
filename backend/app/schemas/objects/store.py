from app.models.store import StoreDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class StoreUpsertRequest(BaseObjectUpsertRequest):
    payload: StoreDocument


class StoreResponse(BaseObjectResponse):
    payload: StoreDocument

    @classmethod
    def from_record(cls, record: dict) -> 'StoreResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=StoreDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
