from app.models.task import TaskDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class TaskUpsertRequest(BaseObjectUpsertRequest):
    payload: TaskDocument


class TaskResponse(BaseObjectResponse):
    payload: TaskDocument

    @classmethod
    def from_record(cls, record: dict) -> 'TaskResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=TaskDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
