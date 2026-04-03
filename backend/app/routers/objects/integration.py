from fastapi import APIRouter, Depends

from app.controllers.integration_controller import IntegrationController
from app.schemas.objects.integration import IntegrationResponse, IntegrationUpsertRequest


router = APIRouter(prefix='/integration', tags=['integration'])


def get_controller() -> IntegrationController:
    return IntegrationController()


@router.post('', response_model=IntegrationResponse)
def create_integration(
    request: IntegrationUpsertRequest,
    controller: IntegrationController = Depends(get_controller),
) -> IntegrationResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return IntegrationResponse.from_record(record)


@router.put('/{object_id}', response_model=IntegrationResponse)
def update_integration(
    object_id: str,
    request: IntegrationUpsertRequest,
    controller: IntegrationController = Depends(get_controller),
) -> IntegrationResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return IntegrationResponse.from_record(record)


@router.get('/{object_id}', response_model=IntegrationResponse)
def get_integration(
    object_id: str,
    tenant_id: str,
    controller: IntegrationController = Depends(get_controller),
) -> IntegrationResponse:
    record = controller.get(object_id, tenant_id)
    return IntegrationResponse.from_record(record)


@router.get('', response_model=list[IntegrationResponse])
def list_integration(
    tenant_id: str,
    controller: IntegrationController = Depends(get_controller),
) -> list[IntegrationResponse]:
    records = controller.list(tenant_id)
    return [IntegrationResponse.from_record(record) for record in records]
