from app.models.online_menu import OnlineMenuDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class OnlineMenuUpsertRequest(BaseObjectUpsertRequest):
    payload: OnlineMenuDocument


class OnlineMenuResponse(BaseObjectResponse):
    payload: OnlineMenuDocument

    @classmethod
    def from_record(cls, record: dict) -> 'OnlineMenuResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=OnlineMenuDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
