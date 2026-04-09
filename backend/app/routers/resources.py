from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from app.db.repository import ObjectRepository

router = APIRouter(tags=["resources"])


def _next_id(prefix: str, existing: list[BaseModel]) -> str:
    return f"{prefix}-{len(existing) + 1:03d}"


class SiteItem(BaseModel):
    id: str
    code: str
    name: str
    event_label: str
    active: bool


class SiteStockItem(BaseModel):
    id: str
    site_id: str
    sku: str
    product_name: str
    variant: str
    quantity_pieces: int


class UomItem(BaseModel):
    code: str
    label: str
    category: str
    conversion_hint: str


class InventoryItem(BaseModel):
    id: str
    sku: str
    name: str
    variant: str
    quantity_pieces: int
    site_id: str


class StockAdjustmentItem(BaseModel):
    id: str
    site_id: str
    sku: str
    delta: int
    reason: str
    actor_role: str
    created_at: str


class StockAdjustmentCreate(BaseModel):
    site_id: str
    sku: str
    delta: int
    reason: str
    actor_role: str = "admin"


class SupplyItem(BaseModel):
    id: str
    name: str
    type: str
    uom: str
    units_per_pack: int | None = None
    cost_per_unit_php: float


class VendorItem(BaseModel):
    id: str
    name: str
    category: str
    active: bool


class VendorCreate(BaseModel):
    name: str
    category: str


class SupplyPurchaseOrderItem(BaseModel):
    id: str
    vendor_id: str
    reference: str
    status: str
    total_php: float


class SupplyPurchaseOrderCreate(BaseModel):
    vendor_id: str
    reference: str
    total_php: float


class WebPosSessionItem(BaseModel):
    id: str
    site_id: str
    employee_id: str
    status: str
    opened_at: str


class WebPosSessionCreate(BaseModel):
    site_id: str
    employee_id: str


class SalesDeltaItem(BaseModel):
    id: str
    site_id: str
    sku: str
    quantity_delta: int
    reason: str
    at: str


class SalesTimelineItem(BaseModel):
    id: str
    site_id: str
    summary: str
    at: str


class SalesSiteSummaryItem(BaseModel):
    site: str
    gross: float
    rent: float
    operations: float
    currency: str = "PHP"


class EventItem(BaseModel):
    id: str
    title: str
    start_date: str
    end_date: str
    status: str


class NotificationItem(BaseModel):
    id: str
    message: str
    level: str
    timestamp: str


class EventSiteMapItem(BaseModel):
    event_id: str
    event_name: str
    site_id: str
    site_name: str


class CrmAgreementItem(BaseModel):
    id: str
    account_name: str
    agreement_type: str
    status: str


class CrmRemediationItem(BaseModel):
    id: str
    account_name: str
    issue: str
    status: str


class EmployeeItem(BaseModel):
    id: str
    name: str
    role: str
    site_id: str


class PayrollEntryItem(BaseModel):
    id: str
    employee_id: str
    period: str
    base_php: float
    overtime_php: float


class OvertimeEntryItem(BaseModel):
    id: str
    employee_id: str
    hours: float
    status: str


class ReportTemplateItem(BaseModel):
    id: str
    name: str
    frequency: str


class ReportRunItem(BaseModel):
    id: str
    template_id: str
    ran_at: str
    status: str


class SiteListResponse(BaseModel):
    sites: list[SiteItem]


class SiteStockListResponse(BaseModel):
    items: list[SiteStockItem]


class UomListResponse(BaseModel):
    units: list[UomItem]


class InventoryListResponse(BaseModel):
    items: list[InventoryItem]


class StockAdjustmentListResponse(BaseModel):
    adjustments: list[StockAdjustmentItem]


class SupplyListResponse(BaseModel):
    supplies: list[SupplyItem]


class VendorListResponse(BaseModel):
    vendors: list[VendorItem]


class SupplyPurchaseOrderListResponse(BaseModel):
    purchase_orders: list[SupplyPurchaseOrderItem]


class WebPosSessionListResponse(BaseModel):
    sessions: list[WebPosSessionItem]


class SalesDeltaListResponse(BaseModel):
    deltas: list[SalesDeltaItem]


class SalesTimelineListResponse(BaseModel):
    timeline: list[SalesTimelineItem]


class EventsResponse(BaseModel):
    events: list[EventItem]


class NotificationsResponse(BaseModel):
    notifications: list[NotificationItem]


class EventSiteMapListResponse(BaseModel):
    mappings: list[EventSiteMapItem]


class CrmAgreementListResponse(BaseModel):
    agreements: list[CrmAgreementItem]


class CrmRemediationListResponse(BaseModel):
    remediations: list[CrmRemediationItem]


class EmployeeListResponse(BaseModel):
    employees: list[EmployeeItem]


class PayrollListResponse(BaseModel):
    payroll: list[PayrollEntryItem]


class OvertimeListResponse(BaseModel):
    overtime: list[OvertimeEntryItem]


class ReportTemplateListResponse(BaseModel):
    templates: list[ReportTemplateItem]


class ReportRunListResponse(BaseModel):
    runs: list[ReportRunItem]


_SITES = [
    SiteItem(id="site-001", code="site1", name="Primary (A)", event_label="Orchard", active=True),
    SiteItem(id="site-002", code="site2", name="Secondary (B)", event_label="SMP", active=True),
    SiteItem(id="site-003", code="site3", name="Tertiary (C)", event_label="Newpoint", active=True),
]

_SITE_STOCK = [
    SiteStockItem(id="sst-001", site_id="site-001", sku="PRD-001", product_name="Keychain Alpha", variant="Red", quantity_pieces=72),
    SiteStockItem(id="sst-002", site_id="site-001", sku="PRD-004", product_name="Tag Clip", variant="Standard", quantity_pieces=180),
    SiteStockItem(id="sst-003", site_id="site-002", sku="PRD-002", product_name="Keyring Beta", variant="Blue", quantity_pieces=58),
    SiteStockItem(id="sst-004", site_id="site-003", sku="PRD-003", product_name="Lanyard Hook", variant="Black", quantity_pieces=93),
]

_UNITS = [
    UomItem(code="piece", label="Piece", category="inventory", conversion_hint="Base unit for inventory"),
    UomItem(code="grams", label="Grams", category="supply", conversion_hint="Filament consumption"),
    UomItem(code="pack", label="Pack", category="supply", conversion_hint="Use units_per_pack"),
    UomItem(code="percent", label="Percent", category="product", conversion_hint="Variant/mixture ratio"),
]

_INVENTORY_ITEMS = [
    InventoryItem(id="inv-001", sku="PRD-001", name="Keychain Alpha", variant="Red", quantity_pieces=210, site_id="site-001"),
    InventoryItem(id="inv-002", sku="PRD-002", name="Keyring Beta", variant="Blue", quantity_pieces=134, site_id="site-002"),
]

_STOCK_ADJUSTMENTS = [
    StockAdjustmentItem(
        id="adj-001",
        site_id="site-001",
        sku="PRD-001",
        delta=-2,
        reason="Damaged on event table",
        actor_role="admin",
        created_at="2026-04-03T08:15:00Z",
    ),
]

_SUPPLIES = [
    SupplyItem(id="sup-001", name="Filament Red PLA", type="filament", uom="grams", cost_per_unit_php=1.80),
    SupplyItem(id="sup-002", name="Keyring", type="consumable", uom="pack", units_per_pack=100, cost_per_unit_php=2.50),
]

_VENDORS = [
    VendorItem(id="ven-001", name="Filament Hub PH", category="filament", active=True),
    VendorItem(id="ven-002", name="Clasps and Rings Supply Co", category="consumables", active=True),
    VendorItem(id="ven-003", name="Machine Parts Depot", category="machine", active=True),
]

_SUPPLY_PURCHASE_ORDERS = [
    SupplyPurchaseOrderItem(id="spo-001", vendor_id="ven-001", reference="PO-2026-041", status="received", total_php=12450.00),
    SupplyPurchaseOrderItem(id="spo-002", vendor_id="ven-002", reference="PO-2026-042", status="open", total_php=5320.00),
]

_WEB_POS_SESSIONS = [
    WebPosSessionItem(
        id="wps-001",
        site_id="site-001",
        employee_id="emp-001",
        status="open",
        opened_at="2026-04-03T07:30:00Z",
    )
]

_SALES_DELTAS = [
    SalesDeltaItem(id="sdl-001", site_id="site-001", sku="PRD-001", quantity_delta=-3, reason="sold", at="2026-04-03T09:02:00Z"),
    SalesDeltaItem(id="sdl-002", site_id="site-001", sku="PRD-001", quantity_delta=-1, reason="adjustment", at="2026-04-03T09:20:00Z"),
]

_SALES_TIMELINE = [
    SalesTimelineItem(id="stl-001", site_id="site-001", summary="Sale INV-0901 posted", at="2026-04-03T09:02:00Z"),
    SalesTimelineItem(id="stl-002", site_id="site-002", summary="Sale INV-0902 posted", at="2026-04-03T09:11:00Z"),
]

_SALES_SITE_SUMMARY = {
    "site1": SalesSiteSummaryItem(site="Primary (A)", gross=12480.0, rent=3200.0, operations=2860.0, currency="PHP"),
    "site2": SalesSiteSummaryItem(site="Secondary (B)", gross=9730.0, rent=2800.0, operations=2430.0, currency="PHP"),
    "site3": SalesSiteSummaryItem(site="Tertiary (C)", gross=14210.0, rent=3600.0, operations=3310.0, currency="PHP"),
}

_EVENTS = [
    EventItem(id="evt-001", title="Orchard Easter", start_date="2026-04-04", end_date="2026-04-05", status="scheduled"),
    EventItem(id="evt-002", title="SMP", start_date="2026-04-04", end_date="2026-04-07", status="scheduled"),
    EventItem(id="evt-003", title="Orchard", start_date="2026-04-09", end_date="2026-04-12", status="scheduled"),
    EventItem(id="evt-004", title="Newpoint", start_date="2026-04-15", end_date="2026-04-19", status="scheduled"),
    EventItem(id="evt-005", title="Orchard", start_date="2026-04-16", end_date="2026-04-19", status="scheduled"),
    EventItem(id="evt-006", title="Mabalacat City Colleges", start_date="2026-04-21", end_date="2026-04-25", status="scheduled"),
    EventItem(id="evt-007", title="Orchard", start_date="2026-04-24", end_date="2026-04-26", status="scheduled"),
]

_NOTIFICATIONS = [
    NotificationItem(
        id="note-001",
        message="POS sync queue is in standby mode.",
        level="info",
        timestamp="2026-04-03T09:00:00Z",
    ),
    NotificationItem(
        id="note-002",
        message="Daily sales export will run at 11:59 PM.",
        level="info",
        timestamp="2026-04-03T09:05:00Z",
    ),
    NotificationItem(
        id="note-003",
        message="Audit log retention check pending review.",
        level="warning",
        timestamp="2026-04-03T09:10:00Z",
    ),
]

_EVENT_SITE_MAPPINGS = [
    EventSiteMapItem(event_id="evt-001", event_name="Orchard Easter", site_id="site-001", site_name="Primary (A)"),
    EventSiteMapItem(event_id="evt-002", event_name="SMP", site_id="site-002", site_name="Secondary (B)"),
]

_CRM_AGREEMENTS = [
    CrmAgreementItem(id="agr-001", account_name="Orchard", agreement_type="consignment", status="active"),
]

_CRM_REMEDIATIONS = [
    CrmRemediationItem(id="rem-001", account_name="SMP", issue="Late liquidation", status="open"),
]

_EMPLOYEES = [
    EmployeeItem(id="emp-001", name="Admin User", role="admin", site_id="site-001"),
    EmployeeItem(id="emp-002", name="Primary (A) Staff", role="cashier", site_id="site-001"),
]

_PAYROLL = [
    PayrollEntryItem(id="pay-001", employee_id="emp-002", period="2026-W14", base_php=6500.0, overtime_php=450.0),
]

_OVERTIME = [
    OvertimeEntryItem(id="ot-001", employee_id="emp-002", hours=3.5, status="approved"),
]

_REPORT_TEMPLATES = [
    ReportTemplateItem(id="rpt-001", name="Daily Site Sales", frequency="daily"),
    ReportTemplateItem(id="rpt-002", name="Weekly Inventory Movement", frequency="weekly"),
]

_REPORT_RUNS = [
    ReportRunItem(id="run-001", template_id="rpt-001", ran_at="2026-04-03T23:59:00Z", status="success"),
]

_resource_repository = ObjectRepository()


def _load_seeded_events(tenant_id: str = "tenant-admin") -> list[EventItem]:
    records = _resource_repository.list_objects(tenant_id, "event")
    events: list[EventItem] = []
    for record in records:
        payload = record.get("payload", {})
        if not isinstance(payload, dict):
            continue
        try:
            events.append(
                EventItem.model_validate({
                    "id": record.get("object_id"),
                    "title": payload.get("title"),
                    "start_date": payload.get("start_date"),
                    "end_date": payload.get("end_date"),
                    "status": payload.get("status"),
                })
            )
        except Exception:
            continue
    return events


@router.get("/sites", response_model=SiteListResponse)
def list_sites() -> SiteListResponse:
    sites = sorted(
        _SITES,
        key=lambda site: (
            (site.name or "").strip().casefold(),
            (site.code or "").strip().casefold(),
            site.id.casefold(),
        ),
    )
    return SiteListResponse(sites=sites)


@router.post("/sites", response_model=SiteItem)
def create_site(payload: SiteItem) -> SiteItem:
    site = payload.model_copy(update={"id": _next_id("site", _SITES)})
    _SITES.append(site)
    return site


@router.get("/inventory", response_model=InventoryListResponse)
def list_inventory_items() -> InventoryListResponse:
    return InventoryListResponse(items=_INVENTORY_ITEMS)


@router.get("/inventory/site-stock", response_model=SiteStockListResponse)
def list_site_stock() -> SiteStockListResponse:
    return SiteStockListResponse(items=_SITE_STOCK)


@router.get("/inventory/uom", response_model=UomListResponse)
def list_inventory_units() -> UomListResponse:
    return UomListResponse(units=_UNITS)


@router.post("/inventory/adjustments", response_model=StockAdjustmentItem)
def create_stock_adjustment(payload: StockAdjustmentCreate) -> StockAdjustmentItem:
    item = StockAdjustmentItem(
        id=_next_id("adj", _STOCK_ADJUSTMENTS),
        site_id=payload.site_id,
        sku=payload.sku,
        delta=payload.delta,
        reason=payload.reason,
        actor_role=payload.actor_role,
        created_at=datetime.utcnow().isoformat() + "Z",
    )
    _STOCK_ADJUSTMENTS.append(item)
    return item


@router.get("/web-pos/adjustments", response_model=StockAdjustmentListResponse)
def list_web_pos_adjustments() -> StockAdjustmentListResponse:
    return StockAdjustmentListResponse(adjustments=_STOCK_ADJUSTMENTS)


@router.get("/supplies", response_model=SupplyListResponse)
def list_supplies() -> SupplyListResponse:
    return SupplyListResponse(supplies=_SUPPLIES)


@router.get("/supplies/vendors", response_model=VendorListResponse)
def list_vendors() -> VendorListResponse:
    return VendorListResponse(vendors=_VENDORS)


@router.post("/supplies/vendors", response_model=VendorItem)
def create_vendor(payload: VendorCreate) -> VendorItem:
    vendor = VendorItem(
        id=_next_id("ven", _VENDORS),
        name=payload.name,
        category=payload.category,
        active=True,
    )
    _VENDORS.append(vendor)
    return vendor


@router.get("/supplies/purchase-orders", response_model=SupplyPurchaseOrderListResponse)
def list_supply_purchase_orders() -> SupplyPurchaseOrderListResponse:
    return SupplyPurchaseOrderListResponse(purchase_orders=_SUPPLY_PURCHASE_ORDERS)


@router.post("/supplies/purchase-orders", response_model=SupplyPurchaseOrderItem)
def create_supply_purchase_order(payload: SupplyPurchaseOrderCreate) -> SupplyPurchaseOrderItem:
    po = SupplyPurchaseOrderItem(
        id=_next_id("spo", _SUPPLY_PURCHASE_ORDERS),
        vendor_id=payload.vendor_id,
        reference=payload.reference,
        status="open",
        total_php=payload.total_php,
    )
    _SUPPLY_PURCHASE_ORDERS.append(po)
    return po


@router.get("/supplies/uom", response_model=UomListResponse)
def list_supply_units() -> UomListResponse:
    return UomListResponse(units=_UNITS)


@router.get("/web-pos", response_model=WebPosSessionListResponse)
def list_web_pos_sessions() -> WebPosSessionListResponse:
    return WebPosSessionListResponse(sessions=_WEB_POS_SESSIONS)


@router.post("/web-pos", response_model=WebPosSessionItem)
def create_web_pos_session(payload: WebPosSessionCreate) -> WebPosSessionItem:
    session = WebPosSessionItem(
        id=_next_id("wps", _WEB_POS_SESSIONS),
        site_id=payload.site_id,
        employee_id=payload.employee_id,
        status="open",
        opened_at=datetime.utcnow().isoformat() + "Z",
    )
    _WEB_POS_SESSIONS.append(session)
    return session


@router.get("/sales", response_model=SalesDeltaListResponse)
def list_sales_deltas() -> SalesDeltaListResponse:
    return SalesDeltaListResponse(deltas=_SALES_DELTAS)


@router.get("/sales/timeline", response_model=SalesTimelineListResponse)
def list_sales_timeline() -> SalesTimelineListResponse:
    return SalesTimelineListResponse(timeline=_SALES_TIMELINE)


@router.get("/sales/sites/{site_id}/summary", response_model=SalesSiteSummaryItem)
def get_sales_site_summary(site_id: str) -> SalesSiteSummaryItem:
    key = (site_id or "").strip().lower()
    if key in _SALES_SITE_SUMMARY:
        return _SALES_SITE_SUMMARY[key]
    return SalesSiteSummaryItem(site=site_id, gross=0.0, rent=0.0, operations=0.0, currency="PHP")


@router.get("/events", response_model=EventsResponse)
def list_events() -> EventsResponse:
    seeded_events = _load_seeded_events()
    if seeded_events:
        return EventsResponse(events=seeded_events)
    return EventsResponse(events=_EVENTS)


@router.get("/notifications", response_model=NotificationsResponse)
def list_notifications() -> NotificationsResponse:
    return NotificationsResponse(notifications=_NOTIFICATIONS)


@router.get("/events/sites", response_model=EventSiteMapListResponse)
def list_event_site_mapping() -> EventSiteMapListResponse:
    return EventSiteMapListResponse(mappings=_EVENT_SITE_MAPPINGS)


@router.get("/crm/agreements", response_model=CrmAgreementListResponse)
def list_crm_agreements() -> CrmAgreementListResponse:
    return CrmAgreementListResponse(agreements=_CRM_AGREEMENTS)


@router.get("/crm/remediations", response_model=CrmRemediationListResponse)
def list_crm_remediations() -> CrmRemediationListResponse:
    return CrmRemediationListResponse(remediations=_CRM_REMEDIATIONS)


@router.get("/employees", response_model=EmployeeListResponse)
def list_employees() -> EmployeeListResponse:
    return EmployeeListResponse(employees=_EMPLOYEES)


@router.get("/employees/payroll", response_model=PayrollListResponse)
def list_payroll() -> PayrollListResponse:
    return PayrollListResponse(payroll=_PAYROLL)


@router.get("/employees/overtime", response_model=OvertimeListResponse)
def list_overtime() -> OvertimeListResponse:
    return OvertimeListResponse(overtime=_OVERTIME)


@router.get("/reports/templates", response_model=ReportTemplateListResponse)
def list_report_templates() -> ReportTemplateListResponse:
    return ReportTemplateListResponse(templates=_REPORT_TEMPLATES)


@router.get("/reports/runs", response_model=ReportRunListResponse)
def list_report_runs() -> ReportRunListResponse:
    return ReportRunListResponse(runs=_REPORT_RUNS)
