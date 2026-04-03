from fastapi import APIRouter, Depends

from app.controllers.customer_controller import CustomerController
from app.schemas.objects.customer import CustomerResponse, CustomerUpsertRequest


router = APIRouter(prefix='/customer', tags=['customer'])


def get_controller() -> CustomerController:
    return CustomerController()


@router.post('', response_model=CustomerResponse)
def create_customer(
    request: CustomerUpsertRequest,
    controller: CustomerController = Depends(get_controller),
) -> CustomerResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return CustomerResponse.from_record(record)


@router.put('/{object_id}', response_model=CustomerResponse)
def update_customer(
    object_id: str,
    request: CustomerUpsertRequest,
    controller: CustomerController = Depends(get_controller),
) -> CustomerResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return CustomerResponse.from_record(record)


@router.get('/{object_id}', response_model=CustomerResponse)
def get_customer(
    object_id: str,
    tenant_id: str,
    controller: CustomerController = Depends(get_controller),
) -> CustomerResponse:
    record = controller.get(object_id, tenant_id)
    return CustomerResponse.from_record(record)


@router.get('', response_model=list[CustomerResponse])
def list_customer(
    tenant_id: str,
    controller: CustomerController = Depends(get_controller),
) -> list[CustomerResponse]:
    records = controller.list(tenant_id)
    return [CustomerResponse.from_record(record) for record in records]
