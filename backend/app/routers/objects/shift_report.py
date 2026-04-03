from fastapi import APIRouter, Depends

from app.controllers.shift_report_controller import ShiftReportController
from app.schemas.objects.shift_report import ShiftReportResponse, ShiftReportUpsertRequest


router = APIRouter(prefix='/shift_report', tags=['shift_report'])


def get_controller() -> ShiftReportController:
    return ShiftReportController()


@router.post('', response_model=ShiftReportResponse)
def create_shift_report(
    request: ShiftReportUpsertRequest,
    controller: ShiftReportController = Depends(get_controller),
) -> ShiftReportResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ShiftReportResponse.from_record(record)


@router.put('/{object_id}', response_model=ShiftReportResponse)
def update_shift_report(
    object_id: str,
    request: ShiftReportUpsertRequest,
    controller: ShiftReportController = Depends(get_controller),
) -> ShiftReportResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ShiftReportResponse.from_record(record)


@router.get('/{object_id}', response_model=ShiftReportResponse)
def get_shift_report(
    object_id: str,
    tenant_id: str,
    controller: ShiftReportController = Depends(get_controller),
) -> ShiftReportResponse:
    record = controller.get(object_id, tenant_id)
    return ShiftReportResponse.from_record(record)


@router.get('', response_model=list[ShiftReportResponse])
def list_shift_report(
    tenant_id: str,
    controller: ShiftReportController = Depends(get_controller),
) -> list[ShiftReportResponse]:
    records = controller.list(tenant_id)
    return [ShiftReportResponse.from_record(record) for record in records]
