from fastapi import APIRouter, Depends

from app.controllers.reward_controller import RewardController
from app.schemas.objects.reward import RewardResponse, RewardUpsertRequest


router = APIRouter(prefix='/reward', tags=['reward'])


def get_controller() -> RewardController:
    return RewardController()


@router.post('', response_model=RewardResponse)
def create_reward(
    request: RewardUpsertRequest,
    controller: RewardController = Depends(get_controller),
) -> RewardResponse:
    record = controller.create(request.tenant_id, request.payload.model_dump(exclude_none=True))
    return RewardResponse.from_record(record)


@router.put('/{object_id}', response_model=RewardResponse)
def update_reward(
    object_id: str,
    request: RewardUpsertRequest,
    controller: RewardController = Depends(get_controller),
) -> RewardResponse:
    record = controller.update(object_id, request.tenant_id, request.payload.model_dump(exclude_none=True))
    return RewardResponse.from_record(record)


@router.get('/{object_id}', response_model=RewardResponse)
def get_reward(
    object_id: str,
    tenant_id: str,
    controller: RewardController = Depends(get_controller),
) -> RewardResponse:
    record = controller.get(object_id, tenant_id)
    return RewardResponse.from_record(record)


@router.get('', response_model=list[RewardResponse])
def list_reward(
    tenant_id: str,
    controller: RewardController = Depends(get_controller),
) -> list[RewardResponse]:
    records = controller.list(tenant_id)
    return [RewardResponse.from_record(record) for record in records]
