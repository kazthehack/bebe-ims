from pydantic import BaseModel


class SaleReceiptItemCreate(BaseModel):
    product_variant_id: str
    qty: int
    unit_price: float


class SaleReceiptCreate(BaseModel):
    receipt_number: str
    site_id: str
    discount_amount: float = 0.0
    items: list[SaleReceiptItemCreate]


class SaleReceiptItemRead(BaseModel):
    id: str
    product_variant_id: str
    qty: int
    unit_price: float
    line_total: float


class SaleReceiptRead(BaseModel):
    id: str
    receipt_number: str
    site_id: str
    discount_amount: float
    subtotal: float
    total_amount: float
    items: list[SaleReceiptItemRead]


class SaleReceiptListResponse(BaseModel):
    receipts: list[SaleReceiptRead]
