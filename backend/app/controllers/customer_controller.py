from app.controllers.base_object_controller import BaseObjectController
from app.db.repository import ObjectRepository
from app.models.customer import CustomerDocument


class CustomerController(BaseObjectController):
    def __init__(self, repository: ObjectRepository | None = None) -> None:
        super().__init__('customer', CustomerDocument, repository)
