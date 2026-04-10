from datetime import datetime

from pydantic import BaseModel


class EventCreate(BaseModel):
    code: str | None = None
    title: str
    organizer: str | None = None
    rent_cost_per_day: float = 0.0
    start_date: str
    end_date: str
    start_time: str | None = None
    end_time: str | None = None
    location: str | None = None
    site_id: str | None = None
    status: str = 'scheduled'


class EventUpdate(BaseModel):
    title: str | None = None
    organizer: str | None = None
    rent_cost_per_day: float | None = None
    start_date: str | None = None
    end_date: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    location: str | None = None
    site_id: str | None = None
    status: str | None = None


class EventRead(BaseModel):
    id: str
    code: str
    title: str
    organizer: str | None = None
    rent_cost_per_day: float
    start_date: str
    end_date: str
    start_time: str | None = None
    end_time: str | None = None
    location: str | None = None
    site_id: str | None = None
    status: str
    days: int
    total_rent_cost: float
    created_at: datetime
    updated_at: datetime


class EventListResponse(BaseModel):
    events: list[EventRead]
