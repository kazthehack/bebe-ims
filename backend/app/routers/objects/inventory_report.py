from fastapi import APIRouter, Depends

from app.controllers.inventory_report_controller import InventoryReportController
from app.schemas.objects.inventory_report import InventoryReportResponse, InventoryReportUpsertRequest


router = APIRouter(prefix='/inventory_report', tags=['inventory_report'])


def get_controller() -> InventoryReportController:
    return InventoryReportController()


@router.post('', response_model=InventoryReportResponse)
def create_inventory_report(
    request: InventoryReportUpsertRequest,
    controller: InventoryReportController = Depends(get_controller),
) -> InventoryReportResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return InventoryReportResponse.from_record(record)


@router.put('/{object_id}', response_model=InventoryReportResponse)
def update_inventory_report(
    object_id: str,
    request: InventoryReportUpsertRequest,
    controller: InventoryReportController = Depends(get_controller),
) -> InventoryReportResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return InventoryReportResponse.from_record(record)


@router.get('/{object_id}', response_model=InventoryReportResponse)
def get_inventory_report(
    object_id: str,
    tenant_id: str,
    controller: InventoryReportController = Depends(get_controller),
) -> InventoryReportResponse:
    record = controller.get(object_id, tenant_id)
    return InventoryReportResponse.from_record(record)


@router.get('', response_model=list[InventoryReportResponse])
def list_inventory_report(
    tenant_id: str,
    controller: InventoryReportController = Depends(get_controller),
) -> list[InventoryReportResponse]:
    records = controller.list(tenant_id)
    return [InventoryReportResponse.from_record(record) for record in records]
