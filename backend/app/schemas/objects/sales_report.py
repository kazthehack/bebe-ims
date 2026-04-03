from app.models.sales_report import SalesReportDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class SalesReportUpsertRequest(BaseObjectUpsertRequest):
    payload: SalesReportDocument


class SalesReportResponse(BaseObjectResponse):
    payload: SalesReportDocument

    @classmethod
    def from_record(cls, record: dict) -> 'SalesReportResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=SalesReportDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
