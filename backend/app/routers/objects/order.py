from fastapi import APIRouter, Depends

from app.controllers.order_controller import OrderController
from app.schemas.objects.order import OrderResponse, OrderUpsertRequest


router = APIRouter(prefix='/order', tags=['order'])


def get_controller() -> OrderController:
    return OrderController()


@router.post('', response_model=OrderResponse)
def create_order(
    request: OrderUpsertRequest,
    controller: OrderController = Depends(get_controller),
) -> OrderResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return OrderResponse.from_record(record)


@router.put('/{object_id}', response_model=OrderResponse)
def update_order(
    object_id: str,
    request: OrderUpsertRequest,
    controller: OrderController = Depends(get_controller),
) -> OrderResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return OrderResponse.from_record(record)


@router.get('/{object_id}', response_model=OrderResponse)
def get_order(
    object_id: str,
    tenant_id: str,
    controller: OrderController = Depends(get_controller),
) -> OrderResponse:
    record = controller.get(object_id, tenant_id)
    return OrderResponse.from_record(record)


@router.get('', response_model=list[OrderResponse])
def list_order(
    tenant_id: str,
    controller: OrderController = Depends(get_controller),
) -> list[OrderResponse]:
    records = controller.list(tenant_id)
    return [OrderResponse.from_record(record) for record in records]
