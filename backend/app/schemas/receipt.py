from datetime import datetime

from pydantic import BaseModel, Field


class SaleReceiptItemCreate(BaseModel):
    product_variant_id: str | None = None
    inventory_item_id: str | None = None
    qty: int = Field(default=1, ge=1)
    unit_price: float | None = None
    cost: float | None = None


class SaleReceiptCreate(BaseModel):
    receipt_number: str | None = None
    site_id: str
    event_id: str | None = None
    web_pos_session_id: str | None = None
    discount_amount: float = 0.0
    tax_amount: float = 0.0
    payment_method: str | None = None
    paid_amount: float | None = None
    cash_tendered: float | None = None
    change_amount: float | None = None
    status: str = "posted"
    notes: str | None = None
    created_at: datetime | None = None

    # Compatibility for current one-item-per-receipt flow.
    product_variant_id: str | None = None
    inventory_item_id: str | None = None
    qty: int = Field(default=1, ge=1)
    cost: float | None = None
    unit_price: float | None = None
    items: list[SaleReceiptItemCreate] = Field(default_factory=list)


class SaleReceiptItemRead(BaseModel):
    id: str
    product_variant_id: str | None = None
    inventory_item_id: str | None = None
    qty: int
    unit_price: float
    line_total: float


class SaleReceiptRead(BaseModel):
    id: str
    receipt_number: str
    site_id: str
    event_id: str | None = None
    web_pos_session_id: str | None = None
    discount_amount: float
    tax_amount: float
    subtotal: float
    total_amount: float
    payment_method: str | None = None
    paid_amount: float | None = None
    cash_tendered: float | None = None
    change_amount: float | None = None
    status: str
    notes: str | None = None
    created_at: datetime
    items: list[SaleReceiptItemRead]


class SaleReceiptListResponse(BaseModel):
    receipts: list[SaleReceiptRead]
