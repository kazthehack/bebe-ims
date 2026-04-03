from fastapi import APIRouter, Depends

from app.controllers.sales_export_controller import SalesExportController
from app.schemas.objects.sales_export import SalesExportResponse, SalesExportUpsertRequest


router = APIRouter(prefix='/sales_export', tags=['sales_export'])


def get_controller() -> SalesExportController:
    return SalesExportController()


@router.post('', response_model=SalesExportResponse)
def create_sales_export(
    request: SalesExportUpsertRequest,
    controller: SalesExportController = Depends(get_controller),
) -> SalesExportResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesExportResponse.from_record(record)


@router.put('/{object_id}', response_model=SalesExportResponse)
def update_sales_export(
    object_id: str,
    request: SalesExportUpsertRequest,
    controller: SalesExportController = Depends(get_controller),
) -> SalesExportResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesExportResponse.from_record(record)


@router.get('/{object_id}', response_model=SalesExportResponse)
def get_sales_export(
    object_id: str,
    tenant_id: str,
    controller: SalesExportController = Depends(get_controller),
) -> SalesExportResponse:
    record = controller.get(object_id, tenant_id)
    return SalesExportResponse.from_record(record)


@router.get('', response_model=list[SalesExportResponse])
def list_sales_export(
    tenant_id: str,
    controller: SalesExportController = Depends(get_controller),
) -> list[SalesExportResponse]:
    records = controller.list(tenant_id)
    return [SalesExportResponse.from_record(record) for record in records]
