from datetime import datetime

from pydantic import BaseModel

from app.domain.enums import WebPosCashMovementType, WebPosSessionStatus


class WebPosSessionCreate(BaseModel):
    site_id: str
    employee_id: str


class WebPosSessionRead(BaseModel):
    id: str
    site_id: str
    employee_id: str
    status: WebPosSessionStatus
    opened_at: datetime
    closed_at: datetime | None = None


class WebPosSessionListResponse(BaseModel):
    sessions: list[WebPosSessionRead]


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
