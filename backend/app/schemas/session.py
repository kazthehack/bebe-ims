from datetime import datetime

from pydantic import BaseModel

from app.domain.enums import WebPosCashMovementType, WebPosSessionStatus


class WebPosSessionCreate(BaseModel):
    site_id: str
    employee_id: str
    event_id: str | None = None
    opening_cash: float = 0.0


class WebPosSessionRead(BaseModel):
    id: str
    site_id: str
    employee_id: str
    event_id: str | None = None
    opening_cash: float = 0.0
    closing_cash: float | None = None
    close_notes: str | None = None
    status: WebPosSessionStatus
    opened_at: datetime
    closed_at: datetime | None = None


class WebPosSessionListResponse(BaseModel):
    sessions: list[WebPosSessionRead]


class WebPosSessionCloseCreate(BaseModel):
    closing_cash: float = 0.0
    close_notes: str | None = None


class WebPosCashMovementCreate(BaseModel):
    movement_type: WebPosCashMovementType
    amount: float
    notes: str | None = None


class WebPosCashMovementRead(BaseModel):
    id: str
    web_pos_session_id: str
    movement_type: WebPosCashMovementType
    amount: float
    notes: str | None = None
    created_at: datetime


class WebPosCashMovementListResponse(BaseModel):
    movements: list[WebPosCashMovementRead]
