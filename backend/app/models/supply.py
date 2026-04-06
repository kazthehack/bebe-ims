from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SupplyDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'supply'
    id: str | None = None
    name: str
    supply_type: str = 'filament'
    cost_per_kilo: float = 0.0
    cost_per_piece: float = 0.0
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    grams_on_hand: float = 0.0
    grams_reserved: float = 0.0
