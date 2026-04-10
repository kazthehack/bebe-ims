from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.event import EventDocument


class Event(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('event', EventDocument, repository)

    def _next_code(self, tenant_id: str) -> str:
        records = self.list(tenant_id)
        max_number = 0
        for record in records:
            payload = record.get('payload', {})
            code = str(payload.get('code') or '')
            if not code.startswith('EVT-'):
                continue
            tail = code.split('-', 1)[1]
            if tail.isdigit():
                max_number = max(max_number, int(tail))
        return f'EVT-{max_number + 1:03d}'

    def _code_exists(self, tenant_id: str, code: str) -> bool:
        target = str(code or '').strip().upper()
        if not target:
            return False
        for record in self.list(tenant_id):
            payload = record.get('payload', {})
            existing = str(payload.get('code') or '').strip().upper()
            if existing == target:
                return True
        return False

    def create(self, tenant_id: str, payload: dict) -> dict:
        create_payload = payload.copy()
        incoming_code = str(create_payload.get('code') or '').strip().upper()
        if incoming_code and not self._code_exists(tenant_id, incoming_code):
            create_payload['code'] = incoming_code
        else:
            create_payload['code'] = self._next_code(tenant_id)
        return super().create(tenant_id, create_payload)
