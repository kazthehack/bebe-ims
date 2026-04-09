from datetime import datetime

from pydantic import ConfigDict, Field

from app.models.base import ObjectDocument


class ProductDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'product'
    id: str | None = None
    product_code: str | None = None
    sku: str | None = None
    name: str
    product_line_id: str | None = None
    product_line_name: str | None = None
    product_line_code: str | None = None
    ip: str | None = None
    category: str | None = None
    list_price: float = 0.0
    description: str | None = None
    design_source: str | None = None
    third_party_source_url: str | None = None
    local_working_files: list[str] = Field(default_factory=list)
    image_url: str | None = None
    seed_source: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
