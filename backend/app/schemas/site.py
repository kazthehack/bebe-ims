from datetime import datetime

from pydantic import BaseModel


class SiteCreate(BaseModel):
    code: str | None = None
    name: str
    location: str | None = None
    active: bool = True
    assigned_event_ids: list[str] | None = None
    active_event_id: str | None = None


class SiteUpdate(BaseModel):
    name: str
    location: str | None = None
    active: bool = True
    assigned_event_ids: list[str] | None = None
    active_event_id: str | None = None


class SiteRead(BaseModel):
    id: str
    code: str
    name: str
    location: str | None = None
    active: bool
    assigned_event_ids: list[str] = []
    active_event_id: str | None = None
    created_at: datetime
    updated_at: datetime


class SiteListResponse(BaseModel):
    sites: list[SiteRead]


class SiteEventAssignCreate(BaseModel):
    event_id: str
    make_active: bool = True


class SiteEventRead(BaseModel):
    id: str
    code: str
    title: str
    start_date: str
    end_date: str
    status: str
    active_for_site: bool


class SiteEventListResponse(BaseModel):
    events: list[SiteEventRead]


class SiteEventCloseRead(BaseModel):
    site_id: str
    event: SiteEventRead


class SiteReturnInventoryRead(BaseModel):
    site_id: str
    moved_variants: int
    moved_qty: float
