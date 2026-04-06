from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.product_line import ProductLineDocument


class ProductLine(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('product_line', ProductLineDocument, repository)

    def _next_code(self, tenant_id: str) -> str:
        records = self.list(tenant_id)
        max_number = 0
        for record in records:
            payload = record.get('payload', {})
            code = str(payload.get('code', ''))
            if not code.startswith('PLN-'):
                continue
            tail = code.split('-', 1)[1]
            if tail.isdigit():
                max_number = max(max_number, int(tail))
        return f'PLN-{max_number + 1:04d}'

    def create(self, tenant_id: str, payload: dict) -> dict:
        create_payload = payload.copy()
        if not create_payload.get('code'):
            create_payload['code'] = self._next_code(tenant_id)
        return super().create(tenant_id, create_payload)
