from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.product import ProductDocument


class Product(BaseObjectController):
    ALLOWED_PRICING_TIERS = {
        'regular_100',
        'special_150',
        'special_200',
        'premium_250',
        'premium_300',
        'premium_custom',
        'discount_custom',
    }
    DEFAULT_PRICING_TIER = 'regular_100'
    PRICING_TIER_DEFAULT_PRICE = {
        'regular_100': 100.0,
        'special_150': 150.0,
        'special_200': 200.0,
        'premium_250': 250.0,
        'premium_300': 300.0,
    }

    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('product', ProductDocument, repository)

    def _line_prefix(self, product_line: str) -> str:
        cleaned = ''.join(ch for ch in (product_line or '').upper() if ch.isalnum())
        if not cleaned:
            return 'GEN'
        return cleaned[:3]

    def _next_product_code(self, tenant_id: str, product_line: str) -> str:
        prefix = self._line_prefix(product_line)
        records = self.list(tenant_id)
        max_number = 0
        for record in records:
            payload = record.get('payload', {})
            product_code = str(payload.get('product_code') or payload.get('sku') or '')
            if not product_code.startswith(f'{prefix}-'):
                continue
            tail = product_code.split('-', 1)[1]
            if tail.isdigit():
                max_number = max(max_number, int(tail))
        return f'{prefix}-{max_number + 1:05d}'

    def create(self, tenant_id: str, payload: dict) -> dict:
        payload = payload.copy()
        category = str(payload.get('category') or '').strip().lower()
        payload['category'] = category if category in self.ALLOWED_PRICING_TIERS else self.DEFAULT_PRICING_TIER
        tier_default_price = self.PRICING_TIER_DEFAULT_PRICE.get(payload['category'])
        if tier_default_price is not None and float(payload.get('list_price') or 0) <= 0:
            payload['list_price'] = tier_default_price
        if not payload.get('product_code'):
            line_value = str(payload.get('product_line_code') or payload.get('product_line_name') or '')
            payload['product_code'] = self._next_product_code(tenant_id, line_value)
        return super().create(tenant_id, payload)

    def update(self, object_id: str, tenant_id: str, payload: dict) -> dict:
        payload = payload.copy()
        category = str(payload.get('category') or '').strip().lower()
        payload['category'] = category if category in self.ALLOWED_PRICING_TIERS else self.DEFAULT_PRICING_TIER
        tier_default_price = self.PRICING_TIER_DEFAULT_PRICE.get(payload['category'])
        if tier_default_price is not None and float(payload.get('list_price') or 0) <= 0:
            payload['list_price'] = tier_default_price
        return super().update(object_id, tenant_id, payload)
