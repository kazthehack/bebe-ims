from fastapi import APIRouter

from app.routers.objects import (
    brand,
    changelog,
    compliance,
    customer,
    demo,
    discount,
    hardware,
    integration,
    inventory_report,
    notification,
    online_menu,
    order,
    permissions,
    receipt,
    reward,
    sales_export,
    sales_report,
    sales_type,
    shift,
    shift_report,
    store,
    strain,
    task,
    tax,
    transaction_history_report,
    types,
    units,
    users,
)

router = APIRouter()

router.include_router(brand.router)
router.include_router(changelog.router)
router.include_router(compliance.router)
router.include_router(customer.router)
router.include_router(demo.router)
router.include_router(discount.router)
router.include_router(hardware.router)
router.include_router(integration.router)
router.include_router(inventory_report.router)
router.include_router(notification.router)
router.include_router(online_menu.router)
router.include_router(order.router)
router.include_router(permissions.router)
router.include_router(receipt.router)
router.include_router(reward.router)
router.include_router(sales_export.router)
router.include_router(sales_report.router)
router.include_router(sales_type.router)
router.include_router(shift.router)
router.include_router(shift_report.router)
router.include_router(store.router)
router.include_router(strain.router)
router.include_router(task.router)
router.include_router(tax.router)
router.include_router(transaction_history_report.router)
router.include_router(types.router)
router.include_router(units.router)
router.include_router(users.router)
