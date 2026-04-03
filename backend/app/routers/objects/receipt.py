from fastapi import APIRouter, Depends

from app.controllers.receipt_controller import ReceiptController
from app.schemas.objects.receipt import ReceiptResponse, ReceiptUpsertRequest


router = APIRouter(prefix='/receipt', tags=['receipt'])


def get_controller() -> ReceiptController:
    return ReceiptController()


@router.post('', response_model=ReceiptResponse)
def create_receipt(
    request: ReceiptUpsertRequest,
    controller: ReceiptController = Depends(get_controller),
) -> ReceiptResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ReceiptResponse.from_record(record)


@router.put('/{object_id}', response_model=ReceiptResponse)
def update_receipt(
    object_id: str,
    request: ReceiptUpsertRequest,
    controller: ReceiptController = Depends(get_controller),
) -> ReceiptResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ReceiptResponse.from_record(record)


@router.get('/{object_id}', response_model=ReceiptResponse)
def get_receipt(
    object_id: str,
    tenant_id: str,
    controller: ReceiptController = Depends(get_controller),
) -> ReceiptResponse:
    record = controller.get(object_id, tenant_id)
    return ReceiptResponse.from_record(record)


@router.get('', response_model=list[ReceiptResponse])
def list_receipt(
    tenant_id: str,
    controller: ReceiptController = Depends(get_controller),
) -> list[ReceiptResponse]:
    records = controller.list(tenant_id)
    return [ReceiptResponse.from_record(record) for record in records]
