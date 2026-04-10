from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SaleReceiptItemDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'sale_receipt_item'
    id: str | None = None
    sale_receipt_id: str
    product_variant_id: str | None = None
    inventory_item_id: str | None = None
    qty: int = 1
    unit_price: float = 0.0
