from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SaleReceiptDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'sale_receipt'
    id: str | None = None
    receipt_number: str
    site_id: str
    discount_amount: float = 0.0
