from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.web_pos_cash_movement import WebPosCashMovementDocument


class WebPosCashMovement(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('web_pos_cash_movement', WebPosCashMovementDocument, repository)
