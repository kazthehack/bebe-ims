from app.models.notification import NotificationDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class NotificationUpsertRequest(BaseObjectUpsertRequest):
    payload: NotificationDocument


class NotificationResponse(BaseObjectResponse):
    payload: NotificationDocument

    @classmethod
    def from_record(cls, record: dict) -> 'NotificationResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=NotificationDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
