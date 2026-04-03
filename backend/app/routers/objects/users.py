from fastapi import APIRouter, Depends

from app.controllers.users_controller import UsersController
from app.schemas.objects.users import UsersResponse, UsersUpsertRequest


router = APIRouter(prefix='/users', tags=['users'])


def get_controller() -> UsersController:
    return UsersController()


@router.post('', response_model=UsersResponse)
def create_users(
    request: UsersUpsertRequest,
    controller: UsersController = Depends(get_controller),
) -> UsersResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return UsersResponse.from_record(record)


@router.put('/{object_id}', response_model=UsersResponse)
def update_users(
    object_id: str,
    request: UsersUpsertRequest,
    controller: UsersController = Depends(get_controller),
) -> UsersResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return UsersResponse.from_record(record)


@router.get('/{object_id}', response_model=UsersResponse)
def get_users(
    object_id: str,
    tenant_id: str,
    controller: UsersController = Depends(get_controller),
) -> UsersResponse:
    record = controller.get(object_id, tenant_id)
    return UsersResponse.from_record(record)


@router.get('', response_model=list[UsersResponse])
def list_users(
    tenant_id: str,
    controller: UsersController = Depends(get_controller),
) -> list[UsersResponse]:
    records = controller.list(tenant_id)
    return [UsersResponse.from_record(record) for record in records]
