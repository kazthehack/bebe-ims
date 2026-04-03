from fastapi import APIRouter, Depends

from app.controllers.store_controller import StoreController
from app.schemas.objects.store import StoreResponse, StoreUpsertRequest


router = APIRouter(prefix='/store', tags=['store'])


def get_controller() -> StoreController:
    return StoreController()


@router.post('', response_model=StoreResponse)
def create_store(
    request: StoreUpsertRequest,
    controller: StoreController = Depends(get_controller),
) -> StoreResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return StoreResponse.from_record(record)


@router.put('/{object_id}', response_model=StoreResponse)
def update_store(
    object_id: str,
    request: StoreUpsertRequest,
    controller: StoreController = Depends(get_controller),
) -> StoreResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return StoreResponse.from_record(record)


@router.get('/{object_id}', response_model=StoreResponse)
def get_store(
    object_id: str,
    tenant_id: str,
    controller: StoreController = Depends(get_controller),
) -> StoreResponse:
    record = controller.get(object_id, tenant_id)
    return StoreResponse.from_record(record)


@router.get('', response_model=list[StoreResponse])
def list_store(
    tenant_id: str,
    controller: StoreController = Depends(get_controller),
) -> list[StoreResponse]:
    records = controller.list(tenant_id)
    return [StoreResponse.from_record(record) for record in records]
