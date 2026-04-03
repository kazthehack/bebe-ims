from fastapi import APIRouter, Depends

from app.controllers.shift_controller import ShiftController
from app.schemas.objects.shift import ShiftResponse, ShiftUpsertRequest


router = APIRouter(prefix='/shift', tags=['shift'])


def get_controller() -> ShiftController:
    return ShiftController()


@router.post('', response_model=ShiftResponse)
def create_shift(
    request: ShiftUpsertRequest,
    controller: ShiftController = Depends(get_controller),
) -> ShiftResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ShiftResponse.from_record(record)


@router.put('/{object_id}', response_model=ShiftResponse)
def update_shift(
    object_id: str,
    request: ShiftUpsertRequest,
    controller: ShiftController = Depends(get_controller),
) -> ShiftResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ShiftResponse.from_record(record)


@router.get('/{object_id}', response_model=ShiftResponse)
def get_shift(
    object_id: str,
    tenant_id: str,
    controller: ShiftController = Depends(get_controller),
) -> ShiftResponse:
    record = controller.get(object_id, tenant_id)
    return ShiftResponse.from_record(record)


@router.get('', response_model=list[ShiftResponse])
def list_shift(
    tenant_id: str,
    controller: ShiftController = Depends(get_controller),
) -> list[ShiftResponse]:
    records = controller.list(tenant_id)
    return [ShiftResponse.from_record(record) for record in records]
