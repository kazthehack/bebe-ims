from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


@dataclass(slots=True)
class ObjectRecord:
    object_type: str
    tenant_id: str
    object_id: str = field(default_factory=lambda: str(uuid4()))
    payload: dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @property
    def pk(self) -> str:
        return f"TENANT#{self.tenant_id}"

    @property
    def sk(self) -> str:
        return f"{self.object_type.upper()}#{self.object_id}"
