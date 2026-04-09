from app.models.auth import AuthDocument
from app.models.brand import BrandDocument
from app.models.changelog import ChangelogDocument
from app.models.compliance import ComplianceDocument
from app.models.customer import CustomerDocument
from app.models.demo import DemoDocument
from app.models.discount import DiscountDocument
from app.models.filament_active import FilamentActiveDocument
from app.models.hardware import HardwareDocument
from app.models.integration import IntegrationDocument
from app.models.inventory_report import InventoryReportDocument
from app.models.notification import NotificationDocument
from app.models.online_menu import OnlineMenuDocument
from app.models.order import OrderDocument
from app.models.part import PartDocument
from app.models.permissions import PermissionsDocument
from app.models.receipt import ReceiptDocument
from app.models.reward import RewardDocument
from app.models.sales_export import SalesExportDocument
from app.models.sales_report import SalesReportDocument
from app.models.sales_type import SalesTypeDocument
from app.models.shift import ShiftDocument
from app.models.shift_report import ShiftReportDocument
from app.models.site import SiteDocument
from app.models.store import StoreDocument
from app.models.strain import StrainDocument
from app.models.supply_brand import SupplyBrandDocument
from app.models.task import TaskDocument
from app.models.tax import TaxDocument
from app.models.transaction_history_report import TransactionHistoryReportDocument
from app.models.types import TypesDocument
from app.models.units import UnitsDocument
from app.models.users import UsersDocument

OBJECT_MODELS = {
    "auth": AuthDocument,
    "brand": BrandDocument,
    "changelog": ChangelogDocument,
    "compliance": ComplianceDocument,
    "customer": CustomerDocument,
    "demo": DemoDocument,
    "discount": DiscountDocument,
    "filament_active": FilamentActiveDocument,
    "hardware": HardwareDocument,
    "integration": IntegrationDocument,
    "inventory_report": InventoryReportDocument,
    "notification": NotificationDocument,
    "online_menu": OnlineMenuDocument,
    "order": OrderDocument,
    "part": PartDocument,
    "permissions": PermissionsDocument,
    "receipt": ReceiptDocument,
    "reward": RewardDocument,
    "sales_export": SalesExportDocument,
    "sales_report": SalesReportDocument,
    "sales_type": SalesTypeDocument,
    "shift": ShiftDocument,
    "shift_report": ShiftReportDocument,
    "site": SiteDocument,
    "store": StoreDocument,
    "strain": StrainDocument,
    "supply_brand": SupplyBrandDocument,
    "task": TaskDocument,
    "tax": TaxDocument,
    "transaction_history_report": TransactionHistoryReportDocument,
    "types": TypesDocument,
    "units": UnitsDocument,
    "users": UsersDocument,
}

__all__ = ["OBJECT_MODELS"]
