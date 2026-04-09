from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.filament_active import FilamentActiveDocument


class FilamentActive(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('filament_active', FilamentActiveDocument, repository)
