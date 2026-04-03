from fastapi import APIRouter, Depends

from app.controllers.compliance_controller import ComplianceController
from app.schemas.objects.compliance import ComplianceResponse, ComplianceUpsertRequest


router = APIRouter(prefix='/compliance', tags=['compliance'])


def get_controller() -> ComplianceController:
    return ComplianceController()


@router.post('', response_model=ComplianceResponse)
def create_compliance(
    request: ComplianceUpsertRequest,
    controller: ComplianceController = Depends(get_controller),
) -> ComplianceResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ComplianceResponse.from_record(record)


@router.put('/{object_id}', response_model=ComplianceResponse)
def update_compliance(
    object_id: str,
    request: ComplianceUpsertRequest,
    controller: ComplianceController = Depends(get_controller),
) -> ComplianceResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ComplianceResponse.from_record(record)


@router.get('/{object_id}', response_model=ComplianceResponse)
def get_compliance(
    object_id: str,
    tenant_id: str,
    controller: ComplianceController = Depends(get_controller),
) -> ComplianceResponse:
    record = controller.get(object_id, tenant_id)
    return ComplianceResponse.from_record(record)


@router.get('', response_model=list[ComplianceResponse])
def list_compliance(
    tenant_id: str,
    controller: ComplianceController = Depends(get_controller),
) -> list[ComplianceResponse]:
    records = controller.list(tenant_id)
    return [ComplianceResponse.from_record(record) for record in records]
