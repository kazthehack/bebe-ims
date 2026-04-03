from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.brand import BrandDocument


class BrandController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('brand', BrandDocument, repository)
