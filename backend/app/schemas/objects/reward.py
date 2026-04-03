from app.models.reward import RewardDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class RewardUpsertRequest(BaseObjectUpsertRequest):
    payload: RewardDocument


class RewardResponse(BaseObjectResponse):
    payload: RewardDocument

    @classmethod
    def from_record(cls, record: dict) -> 'RewardResponse':
        return cls(
            object_type=record['object_type'],
            tenant_id=record['tenant_id'],
            object_id=record['object_id'],
            payload=RewardDocument.model_validate(record.get('payload', {})),
            created_at=record['created_at'],
            updated_at=record['updated_at'],
        )
