from pydantic import ConfigDict

from app.models.base import ObjectDocument


class SupplyBrandDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'supply_brand'
    id: str
    display_name: str
