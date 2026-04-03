from fastapi import APIRouter, Depends

from app.controllers.tax_controller import TaxController
from app.schemas.objects.tax import TaxResponse, TaxUpsertRequest


router = APIRouter(prefix='/tax', tags=['tax'])


def get_controller() -> TaxController:
    return TaxController()


@router.post('', response_model=TaxResponse)
def create_tax(
    request: TaxUpsertRequest,
    controller: TaxController = Depends(get_controller),
) -> TaxResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TaxResponse.from_record(record)


@router.put('/{object_id}', response_model=TaxResponse)
def update_tax(
    object_id: str,
    request: TaxUpsertRequest,
    controller: TaxController = Depends(get_controller),
) -> TaxResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return TaxResponse.from_record(record)


@router.get('/{object_id}', response_model=TaxResponse)
def get_tax(
    object_id: str,
    tenant_id: str,
    controller: TaxController = Depends(get_controller),
) -> TaxResponse:
    record = controller.get(object_id, tenant_id)
    return TaxResponse.from_record(record)


@router.get('', response_model=list[TaxResponse])
def list_tax(
    tenant_id: str,
    controller: TaxController = Depends(get_controller),
) -> list[TaxResponse]:
    records = controller.list(tenant_id)
    return [TaxResponse.from_record(record) for record in records]
