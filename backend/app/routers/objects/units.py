from fastapi import APIRouter, Depends

from app.controllers.units_controller import UnitsController
from app.schemas.objects.units import UnitsResponse, UnitsUpsertRequest


router = APIRouter(prefix='/units', tags=['units'])


def get_controller() -> UnitsController:
    return UnitsController()


@router.post('', response_model=UnitsResponse)
def create_units(
    request: UnitsUpsertRequest,
    controller: UnitsController = Depends(get_controller),
) -> UnitsResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return UnitsResponse.from_record(record)


@router.put('/{object_id}', response_model=UnitsResponse)
def update_units(
    object_id: str,
    request: UnitsUpsertRequest,
    controller: UnitsController = Depends(get_controller),
) -> UnitsResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return UnitsResponse.from_record(record)


@router.get('/{object_id}', response_model=UnitsResponse)
def get_units(
    object_id: str,
    tenant_id: str,
    controller: UnitsController = Depends(get_controller),
) -> UnitsResponse:
    record = controller.get(object_id, tenant_id)
    return UnitsResponse.from_record(record)


@router.get('', response_model=list[UnitsResponse])
def list_units(
    tenant_id: str,
    controller: UnitsController = Depends(get_controller),
) -> list[UnitsResponse]:
    records = controller.list(tenant_id)
    return [UnitsResponse.from_record(record) for record in records]
