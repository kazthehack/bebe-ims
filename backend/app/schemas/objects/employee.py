from app.models.employee import EmployeeDocument
from app.schemas.objects.base import BaseObjectResponse, BaseObjectUpsertRequest


class EmployeeUpsertRequest(BaseObjectUpsertRequest):
    payload: EmployeeDocument


class EmployeeResponse(BaseObjectResponse):
    payload: EmployeeDocument

    @classmethod
    def from_record(cls, record: dict) -> "EmployeeResponse":
        return cls(
            object_type=record["object_type"],
            tenant_id=record["tenant_id"],
            object_id=record["object_id"],
            payload=EmployeeDocument.model_validate(record.get("payload", {})),
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )
