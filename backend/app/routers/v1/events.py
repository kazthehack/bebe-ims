from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Query

from app.controllers.event import Event
from app.controllers.site import Site
from app.domain.record_mapper import StoredRecord, map_record
from app.models.event import EventDocument
from app.schemas.event import EventCreate, EventListResponse, EventRead, EventUpdate

router = APIRouter(prefix='/events', tags=['events'])

event_controller = Event()
site_controller = Site()


def _derive_days(start_date: str, end_date: str) -> int:
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end = datetime.strptime(end_date, '%Y-%m-%d').date()
        return max(1, (end - start).days + 1)
    except ValueError:
        return 1


def _to_event(record: StoredRecord[EventDocument]) -> EventRead:
    days = _derive_days(record.payload.start_date, record.payload.end_date)
    rent_cost_per_day = float(record.payload.rent_cost_per_day or 0)
    fallback_code = f'EVT-{str(record.object_id or "").split("-")[-1].upper()[:6]}' if record.object_id else 'EVT-000'
    return EventRead(
        id=record.object_id,
        code=record.payload.code or fallback_code,
        title=record.payload.title or 'Untitled Event',
        organizer=record.payload.organizer,
        rent_cost_per_day=rent_cost_per_day,
        start_date=record.payload.start_date,
        end_date=record.payload.end_date,
        start_time=record.payload.start_time,
        end_time=record.payload.end_time,
        location=record.payload.location,
        site_id=record.payload.site_id,
        status=record.payload.status,
        days=days,
        total_rent_cost=round(days * rent_cost_per_day, 2),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _dedupe_event_codes(events: list[EventRead]) -> list[EventRead]:
    used_codes: set[str] = set()
    max_numeric = 0
    for event in events:
        code = str(event.code or '').strip().upper()
        if code.startswith('EVT-'):
            tail = code.split('-', 1)[1]
            if tail.isdigit():
                max_numeric = max(max_numeric, int(tail))

    result: list[EventRead] = []
    for event in events:
        code = str(event.code or '').strip().upper()
        next_code = code
        if not next_code or next_code in used_codes:
            max_numeric += 1
            next_code = f'EVT-{max_numeric:03d}'
        used_codes.add(next_code)
        result.append(event.model_copy(update={'code': next_code}))
    return result


@router.get('', response_model=EventListResponse)
def list_events(tenant_id: str = Query('tenant-admin')) -> EventListResponse:
    records = [map_record(record, EventDocument) for record in event_controller.list(tenant_id)]
    events = [_to_event(record) for record in records]
    events.sort(key=lambda event: ((event.start_date or '').strip(), (event.title or '').strip().casefold(), event.id.casefold()))
    return EventListResponse(events=_dedupe_event_codes(events))


@router.get('/sites')
def list_event_site_mapping(tenant_id: str = Query('tenant-admin')) -> dict[str, list[dict[str, str]]]:
    event_records = [map_record(record, EventDocument) for record in event_controller.list(tenant_id)]
    site_records = site_controller.list(tenant_id)
    site_rows = sorted(
        [
            {
                'site_id': str(row.get('object_id') or ''),
                'site_name': str((row.get('payload') or {}).get('name') or (row.get('payload') or {}).get('code') or ''),
            }
            for row in site_records
        ],
        key=lambda row: (row['site_name'].casefold(), row['site_id'].casefold()),
    )
    site_name_by_id = {row['site_id']: row['site_name'] for row in site_rows}
    mappings: list[dict[str, str]] = []
    for event_record in event_records:
        event = _to_event(event_record)
        if not event.site_id:
            continue
        site_name = site_name_by_id.get(event.site_id, '')
        mappings.append({
            'event_id': event.id,
            'event_name': event.title,
            'site_id': event.site_id,
            'site_name': site_name,
        })
    return {'mappings': mappings}


@router.get('/{id}', response_model=EventRead)
def get_event(id: str, tenant_id: str = Query('tenant-admin')) -> EventRead:
    return _to_event(map_record(event_controller.get(id, tenant_id), EventDocument))


@router.post('', response_model=EventRead)
def create_event(payload: EventCreate, tenant_id: str = Query('tenant-admin')) -> EventRead:
    record = map_record(event_controller.create(tenant_id, payload.model_dump(exclude_none=True)), EventDocument)
    return _to_event(record)


@router.put('/{id}', response_model=EventRead)
def update_event(id: str, payload: EventUpdate, tenant_id: str = Query('tenant-admin')) -> EventRead:
    existing = map_record(event_controller.get(id, tenant_id), EventDocument)
    merged = existing.payload.model_dump(exclude_none=True)
    updates = payload.model_dump(exclude_none=True)
    merged.update(updates)
    merged['code'] = existing.payload.code
    record = map_record(event_controller.update(id, tenant_id, merged), EventDocument)
    return _to_event(record)


@router.delete('/{id}')
def delete_event(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    return {'deleted': event_controller.delete(id, tenant_id)}
