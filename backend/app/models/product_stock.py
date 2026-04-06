from pydantic import ConfigDict

from app.models.base import ObjectDocument


class ProductStockDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'product_stock'
    id: str | None = None
    product_variant_id: str
    site_id: str
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    low_stock_threshold: float = 0.0
