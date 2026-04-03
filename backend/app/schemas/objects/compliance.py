from app.models.compliance import ComplianceDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class ComplianceUpsertRequest(BaseObjectUpsertRequest):
    payload: ComplianceDocument


class ComplianceResponse(BaseObjectResponse):
    payload: ComplianceDocument

    @classmethod
    def from_record(cls, record: dict) -> 'ComplianceResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=ComplianceDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
