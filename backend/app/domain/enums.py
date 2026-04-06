from enum import Enum


class StockTargetType(str, Enum):
    PRODUCT_STOCK = 'product_stock'
    SUPPLY = 'supply'
    FILAMENT = 'filament'


class InventoryAdjustmentType(str, Enum):
    ADD = 'add'
    DEDUCT = 'deduct'
    RECOUNT = 'recount'
    TRANSFER_IN = 'transfer_in'
    TRANSFER_OUT = 'transfer_out'
    WASTE = 'waste'
    DAMAGE = 'damage'
    CORRECTION = 'correction'
    DISPENSE = 'dispense'
    REFILL = 'refill'


class SupplyType(str, Enum):
    FILAMENT = 'filament'
    CONSUMABLE = 'consumable'


class WebPosSessionStatus(str, Enum):
    OPEN = 'open'
    CLOSING = 'closing'
    CLOSED = 'closed'
    CANCELLED = 'cancelled'


class WebPosCashMovementType(str, Enum):
    OPENING_FLOAT = 'opening_float'
    CASH_IN = 'cash_in'
    CASH_OUT = 'cash_out'
    SAFE_DROP = 'safe_drop'
    ADJUSTMENT = 'adjustment'
    CLOSING_RECOUNT = 'closing_recount'
