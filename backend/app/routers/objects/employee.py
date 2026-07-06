from fastapi import APIRouter, Depends

from app.controllers.employee import Employee
from app.domain.permissions import require_permission
from app.schemas.objects.employee import EmployeeResponse, EmployeeUpsertRequest


router = APIRouter(prefix="/employee", tags=["employee"])


def get_controller() -> Employee:
    return Employee()


@router.post("", response_model=EmployeeResponse, dependencies=[Depends(require_permission("users:create"))])
def create_employee(
    request: EmployeeUpsertRequest,
    controller: Employee = Depends(get_controller),
) -> EmployeeResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return EmployeeResponse.from_record(record)


@router.put("/{object_id}", response_model=EmployeeResponse, dependencies=[Depends(require_permission("users:update"))])
def update_employee(
    object_id: str,
    request: EmployeeUpsertRequest,
    controller: Employee = Depends(get_controller),
) -> EmployeeResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return EmployeeResponse.from_record(record)


@router.get("/{object_id}", response_model=EmployeeResponse, dependencies=[Depends(require_permission("users:read"))])
def get_employee(
    object_id: str,
    tenant_id: str,
    controller: Employee = Depends(get_controller),
) -> EmployeeResponse:
    record = controller.get(object_id, tenant_id)
    return EmployeeResponse.from_record(record)


@router.get("", response_model=list[EmployeeResponse], dependencies=[Depends(require_permission("users:read"))])
def list_employee(
    tenant_id: str,
    controller: Employee = Depends(get_controller),
) -> list[EmployeeResponse]:
    records = controller.list(tenant_id)
    return [EmployeeResponse.from_record(record) for record in records]
