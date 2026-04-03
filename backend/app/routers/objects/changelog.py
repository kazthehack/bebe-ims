from fastapi import APIRouter, Depends

from app.controllers.changelog_controller import ChangelogController
from app.schemas.objects.changelog import ChangelogResponse, ChangelogUpsertRequest


router = APIRouter(prefix='/changelog', tags=['changelog'])


def get_controller() -> ChangelogController:
    return ChangelogController()


@router.post('', response_model=ChangelogResponse)
def create_changelog(
    request: ChangelogUpsertRequest,
    controller: ChangelogController = Depends(get_controller),
) -> ChangelogResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ChangelogResponse.from_record(record)


@router.put('/{object_id}', response_model=ChangelogResponse)
def update_changelog(
    object_id: str,
    request: ChangelogUpsertRequest,
    controller: ChangelogController = Depends(get_controller),
) -> ChangelogResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return ChangelogResponse.from_record(record)


@router.get('/{object_id}', response_model=ChangelogResponse)
def get_changelog(
    object_id: str,
    tenant_id: str,
    controller: ChangelogController = Depends(get_controller),
) -> ChangelogResponse:
    record = controller.get(object_id, tenant_id)
    return ChangelogResponse.from_record(record)


@router.get('', response_model=list[ChangelogResponse])
def list_changelog(
    tenant_id: str,
    controller: ChangelogController = Depends(get_controller),
) -> list[ChangelogResponse]:
    records = controller.list(tenant_id)
    return [ChangelogResponse.from_record(record) for record in records]
