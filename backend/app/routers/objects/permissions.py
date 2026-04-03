from fastapi import APIRouter, Depends

from app.controllers.permissions_controller import PermissionsController
from app.schemas.objects.permissions import PermissionsResponse, PermissionsUpsertRequest


router = APIRouter(prefix='/permissions', tags=['permissions'])


def get_controller() -> PermissionsController:
    return PermissionsController()


@router.post('', response_model=PermissionsResponse)
def create_permissions(
    request: PermissionsUpsertRequest,
    controller: PermissionsController = Depends(get_controller),
) -> PermissionsResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return PermissionsResponse.from_record(record)


@router.put('/{object_id}', response_model=PermissionsResponse)
def update_permissions(
    object_id: str,
    request: PermissionsUpsertRequest,
    controller: PermissionsController = Depends(get_controller),
) -> PermissionsResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return PermissionsResponse.from_record(record)


@router.get('/{object_id}', response_model=PermissionsResponse)
def get_permissions(
    object_id: str,
    tenant_id: str,
    controller: PermissionsController = Depends(get_controller),
) -> PermissionsResponse:
    record = controller.get(object_id, tenant_id)
    return PermissionsResponse.from_record(record)


@router.get('', response_model=list[PermissionsResponse])
def list_permissions(
    tenant_id: str,
    controller: PermissionsController = Depends(get_controller),
) -> list[PermissionsResponse]:
    records = controller.list(tenant_id)
    return [PermissionsResponse.from_record(record) for record in records]
