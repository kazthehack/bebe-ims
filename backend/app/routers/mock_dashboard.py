from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["mock-dashboard"])


class EventItem(BaseModel):
    id: str
    title: str
    time: str
    status: str


class EventsResponse(BaseModel):
    events: list[EventItem]


class NotificationItem(BaseModel):
    id: str
    message: str
    level: str
    timestamp: str


class NotificationsResponse(BaseModel):
    notifications: list[NotificationItem]


class SalesResponse(BaseModel):
    site: str
    total_sales: float
    transactions: int
    average_ticket: float
    currency: str = "USD"


_EVENTS = [
    EventItem(id="evt-001", title="Store Opening Prep", time="08:30 AM", status="scheduled"),
    EventItem(id="evt-002", title="Shift Handover", time="02:00 PM", status="scheduled"),
    EventItem(id="evt-003", title="Inventory Reconciliation", time="06:00 PM", status="scheduled"),
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

_SALES_BY_SITE = {
    "site1": SalesResponse(site="Site 1", total_sales=12480.0, transactions=142, average_ticket=87.89),
    "site2": SalesResponse(site="Site 2", total_sales=9730.0, transactions=118, average_ticket=82.46),
    "site3": SalesResponse(site="Site 3", total_sales=14210.0, transactions=169, average_ticket=84.08),
}


@router.get("/events", response_model=EventsResponse)
def list_events() -> EventsResponse:
    return EventsResponse(events=_EVENTS)


@router.get("/notifications", response_model=NotificationsResponse)
def list_notifications() -> NotificationsResponse:
    return NotificationsResponse(notifications=_NOTIFICATIONS)


@router.get("/sales/{site}", response_model=SalesResponse)
def get_sales(site: str) -> SalesResponse:
    key = (site or "").strip().lower()
    if key in _SALES_BY_SITE:
        return _SALES_BY_SITE[key]
    return SalesResponse(site=site, total_sales=0.0, transactions=0, average_ticket=0.0)
