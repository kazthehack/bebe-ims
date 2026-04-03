from fastapi import APIRouter, Depends

from app.controllers.notification_controller import NotificationController
from app.schemas.objects.notification import NotificationResponse, NotificationUpsertRequest


router = APIRouter(prefix='/notification', tags=['notification'])


def get_controller() -> NotificationController:
    return NotificationController()


@router.post('', response_model=NotificationResponse)
def create_notification(
    request: NotificationUpsertRequest,
    controller: NotificationController = Depends(get_controller),
) -> NotificationResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return NotificationResponse.from_record(record)


@router.put('/{object_id}', response_model=NotificationResponse)
def update_notification(
    object_id: str,
    request: NotificationUpsertRequest,
    controller: NotificationController = Depends(get_controller),
) -> NotificationResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return NotificationResponse.from_record(record)


@router.get('/{object_id}', response_model=NotificationResponse)
def get_notification(
    object_id: str,
    tenant_id: str,
    controller: NotificationController = Depends(get_controller),
) -> NotificationResponse:
    record = controller.get(object_id, tenant_id)
    return NotificationResponse.from_record(record)


@router.get('', response_model=list[NotificationResponse])
def list_notification(
    tenant_id: str,
    controller: NotificationController = Depends(get_controller),
) -> list[NotificationResponse]:
    records = controller.list(tenant_id)
    return [NotificationResponse.from_record(record) for record in records]
