from fastapi import APIRouter, Depends

from app.controllers.sales_type_controller import SalesTypeController
from app.schemas.objects.sales_type import SalesTypeResponse, SalesTypeUpsertRequest


router = APIRouter(prefix='/sales_type', tags=['sales_type'])


def get_controller() -> SalesTypeController:
    return SalesTypeController()


@router.post('', response_model=SalesTypeResponse)
def create_sales_type(
    request: SalesTypeUpsertRequest,
    controller: SalesTypeController = Depends(get_controller),
) -> SalesTypeResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesTypeResponse.from_record(record)


@router.put('/{object_id}', response_model=SalesTypeResponse)
def update_sales_type(
    object_id: str,
    request: SalesTypeUpsertRequest,
    controller: SalesTypeController = Depends(get_controller),
) -> SalesTypeResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return SalesTypeResponse.from_record(record)


@router.get('/{object_id}', response_model=SalesTypeResponse)
def get_sales_type(
    object_id: str,
    tenant_id: str,
    controller: SalesTypeController = Depends(get_controller),
) -> SalesTypeResponse:
    record = controller.get(object_id, tenant_id)
    return SalesTypeResponse.from_record(record)


@router.get('', response_model=list[SalesTypeResponse])
def list_sales_type(
    tenant_id: str,
    controller: SalesTypeController = Depends(get_controller),
) -> list[SalesTypeResponse]:
    records = controller.list(tenant_id)
    return [SalesTypeResponse.from_record(record) for record in records]
