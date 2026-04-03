from app.models.changelog import ChangelogDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class ChangelogUpsertRequest(BaseObjectUpsertRequest):
    payload: ChangelogDocument


class ChangelogResponse(BaseObjectResponse):
    payload: ChangelogDocument

    @classmethod
    def from_record(cls, record: dict) -> 'ChangelogResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=ChangelogDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
