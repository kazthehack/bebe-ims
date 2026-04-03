from app.models.transaction_history_report import TransactionHistoryReportDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class TransactionHistoryReportUpsertRequest(BaseObjectUpsertRequest):
    payload: TransactionHistoryReportDocument


class TransactionHistoryReportResponse(BaseObjectResponse):
    payload: TransactionHistoryReportDocument

    @classmethod
    def from_record(cls, record: dict) -> 'TransactionHistoryReportResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=TransactionHistoryReportDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
