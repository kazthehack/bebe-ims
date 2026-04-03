from app.models.shift_report import ShiftReportDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class ShiftReportUpsertRequest(BaseObjectUpsertRequest):
    payload: ShiftReportDocument


class ShiftReportResponse(BaseObjectResponse):
    payload: ShiftReportDocument

    @classmethod
    def from_record(cls, record: dict) -> 'ShiftReportResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=ShiftReportDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
