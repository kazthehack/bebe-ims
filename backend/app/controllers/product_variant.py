from datetime import datetime, timezone
from uuid import uuid4

from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord
from app.models.product_variant import ProductVariantDocument


class ProductVariant(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('product_variant', ProductVariantDocument, repository)

    def _build_qr_code(self, product_id: str, sku: str, object_id: str) -> str:
        compact_sku = ''.join(ch for ch in str(sku or '').upper() if ch.isalnum())[:10] or 'SKU'
        compact_product = ''.join(ch for ch in str(product_id or '').upper() if ch.isalnum())[:8] or 'PRD'
        compact_id = ''.join(ch for ch in str(object_id or '').upper() if ch.isalnum())[:12] or 'VARIANT'
        return f'QR-{compact_product}-{compact_sku}-{compact_id}'

    def _variant_prefix(self, product_id: str) -> str:
        compact_product = ''.join(ch for ch in str(product_id or '').upper() if ch.isalnum())
        if not compact_product:
            return 'VAR'
        return compact_product[:6]

    def _next_variant_sku(self, tenant_id: str, product_id: str) -> str:
        prefix = self._variant_prefix(product_id)
        max_number = 0
        for record in self.list(tenant_id):
            payload = record.get('payload', {})
            if str(payload.get('product_id')) != str(product_id):
                continue
            sku = str(payload.get('sku') or '')
            if not sku.startswith(f'{prefix}-'):
                continue
            tail = sku.split('-', 1)[1]
            if tail.isdigit():
                max_number = max(max_number, int(tail))
        return f'{prefix}-{max_number + 1:04d}'

    def create(self, tenant_id: str, payload: dict) -> dict:
        now = datetime.now(timezone.utc).isoformat()
        object_id = str(uuid4())
        payload_copy = payload.copy()
        payload_copy['sku'] = self._next_variant_sku(
            tenant_id=tenant_id,
            product_id=str(payload_copy.get('product_id') or ''),
        )
        payload_copy['qr_code'] = self._build_qr_code(
            product_id=str(payload_copy.get('product_id') or ''),
            sku=str(payload_copy.get('sku') or ''),
            object_id=object_id,
        )
        record = ObjectRecord(
            object_type=self.object_type,
            tenant_id=tenant_id,
            object_id=object_id,
            payload=self._validate_payload(payload_copy),
            created_at=now,
            updated_at=now,
        )
        return self.repository.upsert_object(record)
