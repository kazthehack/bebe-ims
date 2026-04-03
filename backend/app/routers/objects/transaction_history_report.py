from fastapi import APIRouter, Depends

from app.controllers.transaction_history_report_controller import TransactionHistoryReportController
from app.schemas.objects.transaction_history_report import TransactionHistoryReportResponse, TransactionHistoryReportUpsertRequest


router = APIRouter(prefix='/transaction_history_report', tags=['transaction_history_report'])


def get_controller() -> TransactionHistoryReportController:
    return TransactionHistoryReportController()


@router.post('', response_model=TransactionHistoryReportResponse)
def create_transaction_history_report(
    request: TransactionHistoryReportUpsertRequest,
    controller: TransactionHistoryReportController = Depends(get_controller),
) -> TransactionHistoryReportResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TransactionHistoryReportResponse.from_record(record)


@router.put('/{object_id}', response_model=TransactionHistoryReportResponse)
def update_transaction_history_report(
    object_id: str,
    request: TransactionHistoryReportUpsertRequest,
    controller: TransactionHistoryReportController = Depends(get_controller),
) -> TransactionHistoryReportResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TransactionHistoryReportResponse.from_record(record)


@router.get('/{object_id}', response_model=TransactionHistoryReportResponse)
def get_transaction_history_report(
    object_id: str,
    tenant_id: str,
    controller: TransactionHistoryReportController = Depends(get_controller),
) -> TransactionHistoryReportResponse:
    record = controller.get(object_id, tenant_id)
    return TransactionHistoryReportResponse.from_record(record)


@router.get('', response_model=list[TransactionHistoryReportResponse])
def list_transaction_history_report(
    tenant_id: str,
    controller: TransactionHistoryReportController = Depends(get_controller),
) -> list[TransactionHistoryReportResponse]:
    records = controller.list(tenant_id)
    return [TransactionHistoryReportResponse.from_record(record) for record in records]
