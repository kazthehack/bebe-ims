from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.part import PartDocument


class Part(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('part', PartDocument, repository)
