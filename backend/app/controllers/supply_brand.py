from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.supply_brand import SupplyBrandDocument


class SupplyBrand(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('supply_brand', SupplyBrandDocument, repository)
