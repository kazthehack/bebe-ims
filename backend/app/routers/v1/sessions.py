from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from app.controllers.event import Event
from app.controllers.site import Site
from app.controllers.web_pos_cash_movement import WebPosCashMovement
from app.controllers.web_pos_session import WebPosSession
from app.domain.enums import WebPosSessionStatus
from app.domain.record_mapper import StoredRecord, map_record
from app.models.event import EventDocument
from app.models.site import SiteDocument
from app.models.web_pos_cash_movement import WebPosCashMovementDocument
from app.models.web_pos_session import WebPosSessionDocument
from app.schemas.session import (
    WebPosCashMovementCreate,
    WebPosCashMovementListResponse,
    WebPosCashMovementRead,
    WebPosSessionCloseCreate,
    WebPosSessionCreate,
    WebPosSessionListResponse,
    WebPosSessionRead,
)

router = APIRouter(prefix='/sessions/web-pos', tags=['web-pos'])

session_controller = WebPosSession()
movement_controller = WebPosCashMovement()
site_controller = Site()
event_controller = Event()


def _to_session(record: StoredRecord[WebPosSessionDocument]) -> WebPosSessionRead:
    return WebPosSessionRead(
        id=record.object_id,
        site_id=record.payload.site_id,
        employee_id=record.payload.employee_id,
        event_id=record.payload.event_id,
        opening_cash=float(record.payload.opening_cash or 0),
        closing_cash=float(record.payload.closing_cash) if record.payload.closing_cash is not None else None,
        close_notes=record.payload.close_notes,
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
    _ = map_record(site_controller.get(payload.site_id, tenant_id), SiteDocument)
    if payload.event_id:
        _ = map_record(event_controller.get(payload.event_id, tenant_id), EventDocument)

    open_sessions = [
        map_record(record, WebPosSessionDocument)
        for record in session_controller.list(tenant_id)
        if str(record.get('payload', {}).get('status') or '') == WebPosSessionStatus.OPEN.value
        and str(record.get('payload', {}).get('site_id') or '') == payload.site_id
    ]
    if open_sessions:
        raise HTTPException(status_code=409, detail='An open register already exists for this site.')

    record = map_record(
        session_controller.create(tenant_id, {
            'site_id': payload.site_id,
            'employee_id': payload.employee_id,
            'event_id': payload.event_id,
            'opening_cash': float(payload.opening_cash or 0),
            'status': WebPosSessionStatus.OPEN.value,
            'closed_at': None,
            'closing_cash': None,
            'close_notes': None,
        }),
        WebPosSessionDocument,
    )
    movement_controller.create(tenant_id, {
        'web_pos_session_id': record.object_id,
        'movement_type': 'opening_float',
        'amount': float(payload.opening_cash or 0),
        'notes': 'Opening register float',
    })
    return _to_session(record)


@router.post('/{id}/close', response_model=WebPosSessionRead)
def close_session(
    id: str,
    payload: WebPosSessionCloseCreate,
    tenant_id: str = Query('tenant-admin'),
) -> WebPosSessionRead:
    existing = map_record(session_controller.get(id, tenant_id), WebPosSessionDocument)
    if existing.payload.status != WebPosSessionStatus.OPEN:
        raise HTTPException(status_code=409, detail='Only open registers can be closed.')

    merged = existing.payload.model_dump(exclude_none=True)
    merged['status'] = WebPosSessionStatus.CLOSED.value
    merged['closed_at'] = datetime.now(timezone.utc).isoformat()
    merged['closing_cash'] = float(payload.closing_cash or 0)
    merged['close_notes'] = payload.close_notes
    updated = map_record(session_controller.update(id, tenant_id, merged), WebPosSessionDocument)
    movement_controller.create(tenant_id, {
        'web_pos_session_id': id,
        'movement_type': 'closing_recount',
        'amount': float(payload.closing_cash or 0),
        'notes': payload.close_notes or 'Register closed',
    })
    return _to_session(updated)


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
