from app.models.permissions import PermissionsDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class PermissionsUpsertRequest(BaseObjectUpsertRequest):
    payload: PermissionsDocument


class PermissionsResponse(BaseObjectResponse):
    payload: PermissionsDocument

    @classmethod
    def from_record(cls, record: dict) -> 'PermissionsResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=PermissionsDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
