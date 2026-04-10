from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SaleReceiptDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'sale_receipt'
    id: str | None = None
    receipt_number: str
    site_id: str
    event_id: str | None = None
    web_pos_session_id: str | None = None
    discount_amount: float = 0.0
    tax_amount: float = 0.0
    payment_method: str | None = None
    paid_amount: float | None = None
    cash_tendered: float | None = None
    change_amount: float | None = None
    status: str = 'posted'
    notes: str | None = None
