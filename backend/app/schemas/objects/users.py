from app.models.users import UsersDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class UsersUpsertRequest(BaseObjectUpsertRequest):
    payload: UsersDocument


class UsersResponse(BaseObjectResponse):
    payload: UsersDocument

    @classmethod
    def from_record(cls, record: dict) -> 'UsersResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=UsersDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
