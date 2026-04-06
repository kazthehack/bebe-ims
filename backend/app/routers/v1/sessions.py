from __future__ import annotations

from fastapi import APIRouter, Query

from app.controllers.web_pos_cash_movement import WebPosCashMovement
from app.controllers.web_pos_session import WebPosSession
from app.domain.record_mapper import StoredRecord, map_record
from app.models.web_pos_cash_movement import WebPosCashMovementDocument
from app.models.web_pos_session import WebPosSessionDocument
from app.schemas.session import (
    WebPosCashMovementCreate,
    WebPosCashMovementListResponse,
    WebPosCashMovementRead,
    WebPosSessionCreate,
    WebPosSessionListResponse,
    WebPosSessionRead,
)

router = APIRouter(prefix='/sessions/web-pos', tags=['web-pos'])

session_controller = WebPosSession()
movement_controller = WebPosCashMovement()


def _to_session(record: StoredRecord[WebPosSessionDocument]) -> WebPosSessionRead:
    return WebPosSessionRead(
        id=record.object_id,
        site_id=record.payload.site_id,
        employee_id=record.payload.employee_id,
        status=record.payload.status,
        opened_at=record.created_at,
        closed_at=record.payload.closed_at,
    )


def _to_movement(record: StoredRecord[WebPosCashMovementDocument]) -> WebPosCashMovementRead:
    return WebPosCashMovementRead(
        id=record.object_id,
        web_pos_session_id=record.payload.web_pos_session_id,
        movement_type=record.payload.movement_type,
        amount=float(record.payload.amount or 0),
        notes=record.payload.notes,
        created_at=record.created_at,
    )


@router.get('', response_model=WebPosSessionListResponse)
def list_sessions(tenant_id: str = Query('tenant-admin')) -> WebPosSessionListResponse:
    records = [map_record(record, WebPosSessionDocument) for record in session_controller.list(tenant_id)]
    return WebPosSessionListResponse(sessions=[_to_session(record) for record in records])


@router.post('', response_model=WebPosSessionRead)
def create_session(payload: WebPosSessionCreate, tenant_id: str = Query('tenant-admin')) -> WebPosSessionRead:
    record = map_record(
        session_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        WebPosSessionDocument,
    )
    return _to_session(record)


@router.get('/{id}/cash-movements', response_model=WebPosCashMovementListResponse)
def list_cash_movements(id: str, tenant_id: str = Query('tenant-admin')) -> WebPosCashMovementListResponse:
    records = [map_record(record, WebPosCashMovementDocument) for record in movement_controller.list(tenant_id)]
    movements = [
        _to_movement(record)
        for record in records
        if record.payload.web_pos_session_id == id
    ]
    return WebPosCashMovementListResponse(movements=movements)


@router.post('/{id}/cash-movements', response_model=WebPosCashMovementRead)
def create_cash_movement(
    id: str,
    payload: WebPosCashMovementCreate,
    tenant_id: str = Query('tenant-admin'),
) -> WebPosCashMovementRead:
    session_controller.get(id, tenant_id)
    record = map_record(
        movement_controller.create(tenant_id, {
            'web_pos_session_id': id,
            'movement_type': payload.movement_type,
            'amount': payload.amount,
            'notes': payload.notes,
        }),
        WebPosCashMovementDocument,
    )
    return _to_movement(record)
