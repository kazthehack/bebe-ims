from fastapi import APIRouter, Depends

from app.controllers.online_menu_controller import OnlineMenuController
from app.schemas.objects.online_menu import OnlineMenuResponse, OnlineMenuUpsertRequest


router = APIRouter(prefix='/online_menu', tags=['online_menu'])


def get_controller() -> OnlineMenuController:
    return OnlineMenuController()


@router.post('', response_model=OnlineMenuResponse)
def create_online_menu(
    request: OnlineMenuUpsertRequest,
    controller: OnlineMenuController = Depends(get_controller),
) -> OnlineMenuResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return OnlineMenuResponse.from_record(record)


@router.put('/{object_id}', response_model=OnlineMenuResponse)
def update_online_menu(
    object_id: str,
    request: OnlineMenuUpsertRequest,
    controller: OnlineMenuController = Depends(get_controller),
) -> OnlineMenuResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return OnlineMenuResponse.from_record(record)


@router.get('/{object_id}', response_model=OnlineMenuResponse)
def get_online_menu(
    object_id: str,
    tenant_id: str,
    controller: OnlineMenuController = Depends(get_controller),
) -> OnlineMenuResponse:
    record = controller.get(object_id, tenant_id)
    return OnlineMenuResponse.from_record(record)


@router.get('', response_model=list[OnlineMenuResponse])
def list_online_menu(
    tenant_id: str,
    controller: OnlineMenuController = Depends(get_controller),
) -> list[OnlineMenuResponse]:
    records = controller.list(tenant_id)
    return [OnlineMenuResponse.from_record(record) for record in records]
