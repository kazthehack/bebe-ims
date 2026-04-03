from fastapi import APIRouter, Depends

from app.controllers.types_controller import TypesController
from app.schemas.objects.types import TypesResponse, TypesUpsertRequest


router = APIRouter(prefix='/types', tags=['types'])


def get_controller() -> TypesController:
    return TypesController()


@router.post('', response_model=TypesResponse)
def create_types(
    request: TypesUpsertRequest,
    controller: TypesController = Depends(get_controller),
) -> TypesResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TypesResponse.from_record(record)


@router.put('/{object_id}', response_model=TypesResponse)
def update_types(
    object_id: str,
    request: TypesUpsertRequest,
    controller: TypesController = Depends(get_controller),
) -> TypesResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TypesResponse.from_record(record)


@router.get('/{object_id}', response_model=TypesResponse)
def get_types(
    object_id: str,
    tenant_id: str,
    controller: TypesController = Depends(get_controller),
) -> TypesResponse:
    record = controller.get(object_id, tenant_id)
    return TypesResponse.from_record(record)


@router.get('', response_model=list[TypesResponse])
def list_types(
    tenant_id: str,
    controller: TypesController = Depends(get_controller),
) -> list[TypesResponse]:
    records = controller.list(tenant_id)
    return [TypesResponse.from_record(record) for record in records]
