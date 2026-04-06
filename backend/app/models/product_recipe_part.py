from datetime import datetime

from pydantic import ConfigDict

from app.models.base import ObjectDocument


class ProductRecipePartDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'product_recipe_part'
    id: str | None = None
    variant_id: str
    supply_id: str
    supply_name: str
    supply_type: str = 'filament'
    grams: float = 0.0
    quantity: float = 0.0
    print_hours: float = 0.0
    cost_per_kilo: float = 0.0
    cost_per_piece: float = 0.0
    cost_of_part: float = 0.0
    created_at: datetime | None = None
    updated_at: datetime | None = None
