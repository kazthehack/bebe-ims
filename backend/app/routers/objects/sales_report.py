from fastapi import APIRouter, Depends

from app.controllers.sales_report_controller import SalesReportController
from app.schemas.objects.sales_report import SalesReportResponse, SalesReportUpsertRequest


router = APIRouter(prefix='/sales_report', tags=['sales_report'])


def get_controller() -> SalesReportController:
    return SalesReportController()


@router.post('', response_model=SalesReportResponse)
def create_sales_report(
    request: SalesReportUpsertRequest,
    controller: SalesReportController = Depends(get_controller),
) -> SalesReportResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesReportResponse.from_record(record)


@router.put('/{object_id}', response_model=SalesReportResponse)
def update_sales_report(
    object_id: str,
    request: SalesReportUpsertRequest,
    controller: SalesReportController = Depends(get_controller),
) -> SalesReportResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesReportResponse.from_record(record)


@router.get('/{object_id}', response_model=SalesReportResponse)
def get_sales_report(
    object_id: str,
    tenant_id: str,
    controller: SalesReportController = Depends(get_controller),
) -> SalesReportResponse:
    record = controller.get(object_id, tenant_id)
    return SalesReportResponse.from_record(record)


@router.get('', response_model=list[SalesReportResponse])
def list_sales_report(
    tenant_id: str,
    controller: SalesReportController = Depends(get_controller),
) -> list[SalesReportResponse]:
    records = controller.list(tenant_id)
    return [SalesReportResponse.from_record(record) for record in records]
