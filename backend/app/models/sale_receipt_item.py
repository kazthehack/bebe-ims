from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SaleReceiptItemDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'sale_receipt_item'
    id: str | None = None
    sale_receipt_id: str
    product_variant_id: str
    qty: int
    unit_price: float
