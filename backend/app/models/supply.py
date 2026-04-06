from pydantic import ConfigDict, Field

from app.models.base import ObjectDocument


class SupplyDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'supply'
    id: str | None = None
    name: str
    supply_type: str = 'filament'
    brand: str | None = None
    material_type: str | None = None
    sub_type: str | None = None
    color: str | None = None
    stock_spools: float = 0.0
    spool_weight_grams: float = 1000.0
    estimated_remaining_weight_grams: float = 0.0
    source: str | None = None
    source_urls: list[str] = Field(default_factory=list)
    pieces_per_pack: float = 1.0
    cost_per_pack_min: float = 0.0
    cost_per_pack_max: float = 0.0
    cost_per_pack: float = 0.0
    cost_per_kilo: float = 0.0
    cost_per_piece: float = 0.0
    qty_on_hand: float = 0.0
    qty_reserved: float = 0.0
    grams_on_hand: float = 0.0
    grams_reserved: float = 0.0
