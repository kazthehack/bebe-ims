from fastapi import APIRouter, Depends

from app.controllers.hardware_controller import HardwareController
from app.schemas.objects.hardware import HardwareResponse, HardwareUpsertRequest


router = APIRouter(prefix='/hardware', tags=['hardware'])


def get_controller() -> HardwareController:
    return HardwareController()


@router.post('', response_model=HardwareResponse)
def create_hardware(
    request: HardwareUpsertRequest,
    controller: HardwareController = Depends(get_controller),
) -> HardwareResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return HardwareResponse.from_record(record)


@router.put('/{object_id}', response_model=HardwareResponse)
def update_hardware(
    object_id: str,
    request: HardwareUpsertRequest,
    controller: HardwareController = Depends(get_controller),
) -> HardwareResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return HardwareResponse.from_record(record)


@router.get('/{object_id}', response_model=HardwareResponse)
def get_hardware(
    object_id: str,
    tenant_id: str,
    controller: HardwareController = Depends(get_controller),
) -> HardwareResponse:
    record = controller.get(object_id, tenant_id)
    return HardwareResponse.from_record(record)


@router.get('', response_model=list[HardwareResponse])
def list_hardware(
    tenant_id: str,
    controller: HardwareController = Depends(get_controller),
) -> list[HardwareResponse]:
    records = controller.list(tenant_id)
    return [HardwareResponse.from_record(record) for record in records]
