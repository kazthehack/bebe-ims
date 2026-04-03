from fastapi import APIRouter, Depends

from app.controllers.demo_controller import DemoController
from app.schemas.objects.demo import DemoResponse, DemoUpsertRequest


router = APIRouter(prefix='/demo', tags=['demo'])


def get_controller() -> DemoController:
    return DemoController()


@router.post('', response_model=DemoResponse)
def create_demo(
    request: DemoUpsertRequest,
    controller: DemoController = Depends(get_controller),
) -> DemoResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return DemoResponse.from_record(record)


@router.put('/{object_id}', response_model=DemoResponse)
def update_demo(
    object_id: str,
    request: DemoUpsertRequest,
    controller: DemoController = Depends(get_controller),
) -> DemoResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return DemoResponse.from_record(record)


@router.get('/{object_id}', response_model=DemoResponse)
def get_demo(
    object_id: str,
    tenant_id: str,
    controller: DemoController = Depends(get_controller),
) -> DemoResponse:
    record = controller.get(object_id, tenant_id)
    return DemoResponse.from_record(record)


@router.get('', response_model=list[DemoResponse])
def list_demo(
    tenant_id: str,
    controller: DemoController = Depends(get_controller),
) -> list[DemoResponse]:
    records = controller.list(tenant_id)
    return [DemoResponse.from_record(record) for record in records]
