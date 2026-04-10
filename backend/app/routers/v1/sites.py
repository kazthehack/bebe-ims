from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.controllers.event import Event
from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product_stock import ProductStock
from app.controllers.site import Site
from app.domain.enums import InventoryAdjustmentType, StockTargetType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.event import EventDocument
from app.models.product_stock import ProductStockDocument
from app.models.site import SiteDocument
from app.schemas.site import (
    SiteCreate,
    SiteEventAssignCreate,
    SiteEventCloseRead,
    SiteEventListResponse,
    SiteEventRead,
    SiteListResponse,
    SiteRead,
    SiteReturnInventoryRead,
    SiteUpdate,
)

router = APIRouter(prefix='/sites', tags=['sites'])

site_controller = Site()
event_controller = Event()
product_stock_controller = ProductStock()
adjustment_controller = InventoryAdjustment()

MAIN_SITE_ID = 'main'


def _to_site(record: StoredRecord[SiteDocument]) -> SiteRead:
    return SiteRead(
        id=record.object_id,
        code=record.payload.code,
        name=record.payload.name,
        location=record.payload.location,
        active=bool(record.payload.active),
        assigned_event_ids=list(record.payload.assigned_event_ids or []),
        active_event_id=record.payload.active_event_id,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def _upsert_main_stock(
    tenant_id: str,
    product_variant_id: str,
    qty_delta: float,
) -> StoredRecord[ProductStockDocument]:
    records = [map_record(record, ProductStockDocument) for record in product_stock_controller.list(tenant_id)]
    existing = next(
        (
            record for record in records
            if record.payload.product_variant_id == product_variant_id
            and str(record.payload.site_id or '').strip().lower() in ('main', 'global', 'storage')
        ),
        None,
    )
    if existing:
        payload = existing.payload.model_dump(exclude_none=True)
        payload['qty_on_hand'] = float(payload.get('qty_on_hand') or 0) + float(qty_delta or 0)
        updated = map_record(product_stock_controller.update(existing.object_id, tenant_id, payload), ProductStockDocument)
        return updated
    created = map_record(
        product_stock_controller.create(tenant_id, {
            'product_variant_id': product_variant_id,
            'site_id': MAIN_SITE_ID,
            'qty_on_hand': float(qty_delta or 0),
            'qty_reserved': 0.0,
            'low_stock_threshold': 0.0,
        }),
        ProductStockDocument,
    )
    return created


def _create_adjustment(
    tenant_id: str,
    target_id: str,
    site_id: str,
    adjustment_type: InventoryAdjustmentType,
    qty_delta: float,
    notes: str,
) -> None:
    adjustment_controller.create(tenant_id, {
        'target_type': StockTargetType.PRODUCT_STOCK.value,
        'target_id': target_id,
        'site_id': site_id,
        'adjustment_type': adjustment_type.value,
        'qty_delta': float(qty_delta or 0),
        'notes': notes,
    })


@router.get('', response_model=SiteListResponse)
def list_sites(tenant_id: str = Query('tenant-admin')) -> SiteListResponse:
    records = [map_record(record, SiteDocument) for record in site_controller.list(tenant_id)]
    sites = [_to_site(record) for record in records]
    sites.sort(key=lambda site: ((site.name or '').strip().casefold(), (site.code or '').strip().casefold(), site.id.casefold()))
    return SiteListResponse(sites=sites)


@router.get('/{id}', response_model=SiteRead)
def get_site(id: str, tenant_id: str = Query('tenant-admin')) -> SiteRead:
    return _to_site(map_record(site_controller.get(id, tenant_id), SiteDocument))


@router.post('', response_model=SiteRead)
def create_site(payload: SiteCreate, tenant_id: str = Query('tenant-admin')) -> SiteRead:
    record = map_record(site_controller.create(tenant_id, payload.model_dump(exclude_none=True)), SiteDocument)
    return _to_site(record)


@router.put('/{id}', response_model=SiteRead)
def update_site(id: str, payload: SiteUpdate, tenant_id: str = Query('tenant-admin')) -> SiteRead:
    existing = map_record(site_controller.get(id, tenant_id), SiteDocument)
    merged = existing.payload.model_dump(exclude_none=True)
    updates = payload.model_dump(exclude_none=True)
    merged.update(updates)
    merged['code'] = existing.payload.code
    record = map_record(site_controller.update(id, tenant_id, merged), SiteDocument)
    return _to_site(record)


@router.delete('/{id}')
def delete_site(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    return {'deleted': site_controller.delete(id, tenant_id)}


@router.get('/{id}/events', response_model=SiteEventListResponse)
def list_site_events(id: str, tenant_id: str = Query('tenant-admin')) -> SiteEventListResponse:
    site = map_record(site_controller.get(id, tenant_id), SiteDocument)
    assigned_ids = list(site.payload.assigned_event_ids or [])
    event_records = [map_record(record, EventDocument) for record in event_controller.list(tenant_id)]
    event_by_id = {record.object_id: record for record in event_records}
    rows: list[SiteEventRead] = []
    for event_id in assigned_ids:
        event = event_by_id.get(event_id)
        if not event:
            continue
        rows.append(SiteEventRead(
            id=event.object_id,
            code=event.payload.code or f'EVT-{event.object_id.split("-")[-1][:6].upper()}',
            title=event.payload.title or 'Untitled Event',
            start_date=event.payload.start_date,
            end_date=event.payload.end_date,
            status=event.payload.status,
            active_for_site=site.payload.active_event_id == event.object_id,
        ))
    return SiteEventListResponse(events=rows)


@router.post('/{id}/events/assign', response_model=SiteRead)
def assign_event_to_site(
    id: str,
    payload: SiteEventAssignCreate,
    tenant_id: str = Query('tenant-admin'),
) -> SiteRead:
    site = map_record(site_controller.get(id, tenant_id), SiteDocument)
    event = map_record(event_controller.get(payload.event_id, tenant_id), EventDocument)
    merged = site.payload.model_dump(exclude_none=True)
    assigned_ids = [value for value in (merged.get('assigned_event_ids') or []) if value]
    if event.object_id not in assigned_ids:
        assigned_ids.append(event.object_id)
    merged['assigned_event_ids'] = assigned_ids
    if payload.make_active:
        merged['active_event_id'] = event.object_id
    updated = map_record(site_controller.update(id, tenant_id, merged), SiteDocument)
    event_payload = event.payload.model_dump(exclude_none=True)
    event_payload['site_id'] = id
    if payload.make_active:
        event_payload['status'] = 'active'
    event_controller.update(event.object_id, tenant_id, event_payload)
    return _to_site(updated)


@router.post('/{id}/events/{event_id}/close', response_model=SiteEventCloseRead)
def close_site_event(id: str, event_id: str, tenant_id: str = Query('tenant-admin')) -> SiteEventCloseRead:
    site = map_record(site_controller.get(id, tenant_id), SiteDocument)
    event = map_record(event_controller.get(event_id, tenant_id), EventDocument)
    assigned_ids = list(site.payload.assigned_event_ids or [])
    is_assigned = event.object_id in assigned_ids
    is_active = site.payload.active_event_id == event.object_id
    if not is_assigned and not is_active:
        raise HTTPException(status_code=409, detail='Event is not assigned to this site.')

    event_payload = event.payload.model_dump(exclude_none=True)
    event_payload['status'] = 'done'
    event_payload['site_id'] = id
    closed_event = map_record(event_controller.update(event.object_id, tenant_id, event_payload), EventDocument)

    site_payload = site.payload.model_dump(exclude_none=True)
    if site_payload.get('active_event_id') == event.object_id:
        site_payload['active_event_id'] = None
    site_controller.update(id, tenant_id, site_payload)

    return SiteEventCloseRead(
        site_id=id,
        event=SiteEventRead(
            id=closed_event.object_id,
            code=closed_event.payload.code or f'EVT-{closed_event.object_id.split("-")[-1][:6].upper()}',
            title=closed_event.payload.title or 'Untitled Event',
            start_date=closed_event.payload.start_date,
            end_date=closed_event.payload.end_date,
            status=closed_event.payload.status,
            active_for_site=False,
        ),
    )


@router.post('/{id}/inventory/return-all', response_model=SiteReturnInventoryRead)
def return_site_inventory_to_global(id: str, tenant_id: str = Query('tenant-admin')) -> SiteReturnInventoryRead:
    site = map_record(site_controller.get(id, tenant_id), SiteDocument)
    if not site.payload.active:
        raise HTTPException(status_code=409, detail='Cannot return inventory from an inactive site.')

    site_stock_records = [
        map_record(record, ProductStockDocument)
        for record in product_stock_controller.list(tenant_id)
        if str(record.get('payload', {}).get('site_id') or '') == id
    ]

    moved_variants = 0
    moved_qty = 0.0
    for site_stock in site_stock_records:
        qty = float(site_stock.payload.qty_on_hand or 0)
        if qty <= 0:
            continue
        updated_site_payload = site_stock.payload.model_dump(exclude_none=True)
        updated_site_payload['qty_on_hand'] = float(updated_site_payload.get('qty_on_hand') or 0) - qty
        updated_site = map_record(
            product_stock_controller.update(site_stock.object_id, tenant_id, updated_site_payload),
            ProductStockDocument,
        )
        updated_main = _upsert_main_stock(tenant_id, site_stock.payload.product_variant_id, qty)
        _create_adjustment(
            tenant_id=tenant_id,
            target_id=updated_site.object_id,
            site_id=id,
            adjustment_type=InventoryAdjustmentType.TRANSFER_OUT,
            qty_delta=-abs(qty),
            notes='Returned to global inventory',
        )
        _create_adjustment(
            tenant_id=tenant_id,
            target_id=updated_main.object_id,
            site_id=MAIN_SITE_ID,
            adjustment_type=InventoryAdjustmentType.TRANSFER_IN,
            qty_delta=abs(qty),
            notes=f'Returned from site {id}',
        )
        moved_variants += 1
        moved_qty += qty

    return SiteReturnInventoryRead(site_id=id, moved_variants=moved_variants, moved_qty=moved_qty)
