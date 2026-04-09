from pydantic import ConfigDict, model_validator

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
    source_url: str | None = None
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

    @model_validator(mode='before')
    @classmethod
    def normalize_legacy_source_url(cls, data):
        if not isinstance(data, dict):
            return data
        normalized = dict(data)
        if not normalized.get('source_url'):
            legacy_urls = normalized.pop('source_urls', None)
            if isinstance(legacy_urls, list) and legacy_urls:
                normalized['source_url'] = str(legacy_urls[0]).strip() or None
            elif normalized.get('source'):
                normalized['source_url'] = str(normalized.get('source')).strip() or None
        normalized.pop('source', None)
        normalized.pop('source_urls', None)
        return normalized
