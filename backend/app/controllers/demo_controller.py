from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.demo import DemoDocument


class DemoController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('demo', DemoDocument, repository)
