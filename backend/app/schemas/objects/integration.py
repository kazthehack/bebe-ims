from app.models.integration import IntegrationDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class IntegrationUpsertRequest(BaseObjectUpsertRequest):
    payload: IntegrationDocument


class IntegrationResponse(BaseObjectResponse):
    payload: IntegrationDocument

    @classmethod
    def from_record(cls, record: dict) -> 'IntegrationResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=IntegrationDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
