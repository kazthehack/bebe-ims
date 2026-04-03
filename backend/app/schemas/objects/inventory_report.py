from app.models.inventory_report import InventoryReportDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class InventoryReportUpsertRequest(BaseObjectUpsertRequest):
    payload: InventoryReportDocument


class InventoryReportResponse(BaseObjectResponse):
    payload: InventoryReportDocument

    @classmethod
    def from_record(cls, record: dict) -> 'InventoryReportResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=InventoryReportDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
