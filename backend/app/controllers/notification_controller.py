from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.notification import NotificationDocument


class NotificationController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('notification', NotificationDocument, repository)
