from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.units import UnitsDocument


class UnitsController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('units', UnitsDocument, repository)
