from fastapi import APIRouter, Depends

from app.controllers.brand_controller import BrandController
from app.schemas.objects.brand import BrandResponse, BrandUpsertRequest


router = APIRouter(prefix='/brand', tags=['brand'])


def get_controller() -> BrandController:
    return BrandController()


@router.post('', response_model=BrandResponse)
def create_brand(
    request: BrandUpsertRequest,
    controller: BrandController = Depends(get_controller),
) -> BrandResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return BrandResponse.from_record(record)


@router.put('/{object_id}', response_model=BrandResponse)
def update_brand(
    object_id: str,
    request: BrandUpsertRequest,
    controller: BrandController = Depends(get_controller),
) -> BrandResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return BrandResponse.from_record(record)


@router.get('/{object_id}', response_model=BrandResponse)
def get_brand(
    object_id: str,
    tenant_id: str,
    controller: BrandController = Depends(get_controller),
) -> BrandResponse:
    record = controller.get(object_id, tenant_id)
    return BrandResponse.from_record(record)


@router.get('', response_model=list[BrandResponse])
def list_brand(
    tenant_id: str,
    controller: BrandController = Depends(get_controller),
) -> list[BrandResponse]:
    records = controller.list(tenant_id)
    return [BrandResponse.from_record(record) for record in records]
