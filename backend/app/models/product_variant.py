from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class ProductVariantDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'product_variant'
    id: str | None = None
    product_id: str
    sku: str
    name: str | None = None
    yield_units: int = 1
    print_hours: float = 0.0
    qr_code: str | None = None
    image_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
