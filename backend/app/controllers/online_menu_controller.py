from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.online_menu import OnlineMenuDocument


class OnlineMenuController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('online_menu', OnlineMenuDocument, repository)
