from fastapi import APIRouter, Depends

from app.controllers.task_controller import TaskController
from app.schemas.objects.task import TaskResponse, TaskUpsertRequest


router = APIRouter(prefix='/task', tags=['task'])


def get_controller() -> TaskController:
    return TaskController()


@router.post('', response_model=TaskResponse)
def create_task(
    request: TaskUpsertRequest,
    controller: TaskController = Depends(get_controller),
) -> TaskResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TaskResponse.from_record(record)


@router.put('/{object_id}', response_model=TaskResponse)
def update_task(
    object_id: str,
    request: TaskUpsertRequest,
    controller: TaskController = Depends(get_controller),
) -> TaskResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TaskResponse.from_record(record)


@router.get('/{object_id}', response_model=TaskResponse)
def get_task(
    object_id: str,
    tenant_id: str,
    controller: TaskController = Depends(get_controller),
) -> TaskResponse:
    record = controller.get(object_id, tenant_id)
    return TaskResponse.from_record(record)


@router.get('', response_model=list[TaskResponse])
def list_task(
    tenant_id: str,
    controller: TaskController = Depends(get_controller),
) -> list[TaskResponse]:
    records = controller.list(tenant_id)
    return [TaskResponse.from_record(record) for record in records]
