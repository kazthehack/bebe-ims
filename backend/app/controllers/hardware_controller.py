from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.hardware import HardwareDocument


class HardwareController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('hardware', HardwareDocument, repository)
