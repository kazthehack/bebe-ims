from app.models.sales_export import SalesExportDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class SalesExportUpsertRequest(BaseObjectUpsertRequest):
    payload: SalesExportDocument


class SalesExportResponse(BaseObjectResponse):
    payload: SalesExportDocument

    @classmethod
    def from_record(cls, record: dict) -> 'SalesExportResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=SalesExportDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
