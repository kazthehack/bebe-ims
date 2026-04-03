from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.users import UsersDocument


class UsersController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('users', UsersDocument, repository)
