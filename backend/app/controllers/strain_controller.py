from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.strain import StrainDocument


class StrainController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('strain', StrainDocument, repository)
