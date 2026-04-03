from fastapi import APIRouter, Depends

from app.controllers.discount_controller import DiscountController
from app.schemas.objects.discount import DiscountResponse, DiscountUpsertRequest


router = APIRouter(prefix='/discount', tags=['discount'])


def get_controller() -> DiscountController:
    return DiscountController()


@router.post('', response_model=DiscountResponse)
def create_discount(
    request: DiscountUpsertRequest,
    controller: DiscountController = Depends(get_controller),
) -> DiscountResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return DiscountResponse.from_record(record)


@router.put('/{object_id}', response_model=DiscountResponse)
def update_discount(
    object_id: str,
    request: DiscountUpsertRequest,
    controller: DiscountController = Depends(get_controller),
) -> DiscountResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return DiscountResponse.from_record(record)


@router.get('/{object_id}', response_model=DiscountResponse)
def get_discount(
    object_id: str,
    tenant_id: str,
    controller: DiscountController = Depends(get_controller),
) -> DiscountResponse:
    record = controller.get(object_id, tenant_id)
    return DiscountResponse.from_record(record)


@router.get('', response_model=list[DiscountResponse])
def list_discount(
    tenant_id: str,
    controller: DiscountController = Depends(get_controller),
) -> list[DiscountResponse]:
    records = controller.list(tenant_id)
    return [DiscountResponse.from_record(record) for record in records]
