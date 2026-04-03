from fastapi import APIRouter, Depends

from app.controllers.strain_controller import StrainController
from app.schemas.objects.strain import StrainResponse, StrainUpsertRequest


router = APIRouter(prefix='/strain', tags=['strain'])


def get_controller() -> StrainController:
    return StrainController()


@router.post('', response_model=StrainResponse)
def create_strain(
    request: StrainUpsertRequest,
    controller: StrainController = Depends(get_controller),
) -> StrainResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return StrainResponse.from_record(record)


@router.put('/{object_id}', response_model=StrainResponse)
def update_strain(
    object_id: str,
    request: StrainUpsertRequest,
    controller: StrainController = Depends(get_controller),
) -> StrainResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return StrainResponse.from_record(record)


@router.get('/{object_id}', response_model=StrainResponse)
def get_strain(
    object_id: str,
    tenant_id: str,
    controller: StrainController = Depends(get_controller),
) -> StrainResponse:
    record = controller.get(object_id, tenant_id)
    return StrainResponse.from_record(record)


@router.get('', response_model=list[StrainResponse])
def list_strain(
    tenant_id: str,
    controller: StrainController = Depends(get_controller),
) -> list[StrainResponse]:
    records = controller.list(tenant_id)
    return [StrainResponse.from_record(record) for record in records]
