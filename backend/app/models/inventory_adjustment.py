from datetime import datetime

from pydantic import ConfigDict

from app.domain.enums import InventoryAdjustmentType, StockTargetType
from app.models.base import ObjectDocument


class InventoryAdjustmentDocument(ObjectDocument):
    model_config = ConfigDict(extra='forbid')

    object_type: str = 'inventory_adjustment'
    id: str | None = None
    target_type: StockTargetType
    target_id: str
    site_id: str | None = None
    adjustment_type: InventoryAdjustmentType
    qty_delta: float
    notes: str | None = None
    created_at: datetime | None = None
