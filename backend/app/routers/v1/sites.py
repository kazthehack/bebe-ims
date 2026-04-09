from __future__ import annotations

from fastapi import APIRouter, Query

from app.controllers.site import Site
from app.domain.record_mapper import StoredRecord, map_record
from app.models.site import SiteDocument
from app.schemas.site import SiteCreate, SiteListResponse, SiteRead, SiteUpdate

router = APIRouter(prefix='/sites', tags=['sites'])

site_controller = Site()


def _to_site(record: StoredRecord[SiteDocument]) -> SiteRead:
    return SiteRead(
        id=record.object_id,
        code=record.payload.code,
        name=record.payload.name,
        location=record.payload.location,
        active=bool(record.payload.active),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


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
    update_payload = payload.model_dump(exclude_none=True)
    update_payload['code'] = existing.payload.code
    record = map_record(site_controller.update(id, tenant_id, update_payload), SiteDocument)
    return _to_site(record)


@router.delete('/{id}')
def delete_site(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    return {'deleted': site_controller.delete(id, tenant_id)}
