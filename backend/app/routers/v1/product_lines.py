from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.controllers.product_line import ProductLine
from app.controllers.product import Product
from app.domain.permissions import require_permission
from app.domain.record_mapper import StoredRecord, map_record
from app.models.product_line import ProductLineDocument
from app.models.product import ProductDocument
from app.schemas.product_line import ProductLineCreate, ProductLineListResponse, ProductLineRead, ProductLineUpdate

router = APIRouter(prefix='/product-lines', tags=['product-lines'])

product_line_controller = ProductLine()
product_controller = Product()


def _paginate(items: list, page: int | None, page_size: int | None) -> tuple[list, int]:
    total = len(items)
    if page is None or page_size is None:
        return items, total
    start = (page - 1) * page_size
    return items[start:start + page_size], total


def _to_product_line(
    record: StoredRecord[ProductLineDocument],
    products_count: int = 0,
) -> ProductLineRead:
    return ProductLineRead(
        id=record.object_id,
        code=record.payload.code,
        name=record.payload.name,
        description=record.payload.description,
        active=bool(record.payload.active),
        products_count=products_count,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.get('', response_model=ProductLineListResponse)
def list_product_lines(
    tenant_id: str = Query('tenant-admin'),
    page: int | None = Query(default=None, ge=1),
    page_size: int | None = Query(default=None, ge=1, le=250),
    search: str | None = Query(default=None),
) -> ProductLineListResponse:
    line_records = [map_record(record, ProductLineDocument) for record in product_line_controller.list(tenant_id)]
    product_records = [map_record(record, ProductDocument) for record in product_controller.list(tenant_id)]
    line_counts: dict[str, int] = {}

    for product in product_records:
        line_id = product.payload.product_line_id
        if not line_id:
            continue
        line_counts[line_id] = line_counts.get(line_id, 0) + 1

    product_lines = [_to_product_line(record, line_counts.get(record.object_id, 0)) for record in line_records]
    query = str(search or '').strip().casefold()
    if query:
        product_lines = [
            line for line in product_lines
            if query in ' '.join([line.code, line.name, line.description or '']).casefold()
        ]
    product_lines.sort(key=lambda line: (line.name.casefold(), line.code.casefold(), line.id.casefold()))
    paged, total = _paginate(product_lines, page, page_size)

    return ProductLineListResponse(product_lines=paged, total=total, page=page, page_size=page_size)


@router.post('', response_model=ProductLineRead, dependencies=[Depends(require_permission("products:create"))])
def create_product_line(payload: ProductLineCreate, tenant_id: str = Query('tenant-admin')) -> ProductLineRead:
    record = map_record(
        product_line_controller.create(tenant_id, payload.model_dump(exclude_none=True)),
        ProductLineDocument,
    )
    return _to_product_line(record)


@router.put('/{id}', response_model=ProductLineRead, dependencies=[Depends(require_permission("products:update"))])
def update_product_line(
    id: str,
    payload: ProductLineUpdate,
    tenant_id: str = Query('tenant-admin'),
) -> ProductLineRead:
    existing = map_record(product_line_controller.get(id, tenant_id), ProductLineDocument)
    update_payload = payload.model_dump(exclude_none=True)
    update_payload['code'] = existing.payload.code
    record = map_record(
        product_line_controller.update(id, tenant_id, update_payload),
        ProductLineDocument,
    )
    product_records = [map_record(record, ProductDocument) for record in product_controller.list(tenant_id)]
    products_count = sum(1 for product in product_records if product.payload.product_line_id == id)
    return _to_product_line(record, products_count)


@router.delete('/{id}', dependencies=[Depends(require_permission("products:delete"))])
def delete_product_line(id: str, tenant_id: str = Query('tenant-admin')) -> dict[str, bool]:
    product_records = [map_record(record, ProductDocument) for record in product_controller.list(tenant_id)]
    has_associated_products = any(product.payload.product_line_id == id for product in product_records)
    if has_associated_products:
        raise HTTPException(
            status_code=409,
            detail='Cannot delete product line with associated products',
        )
    return {'deleted': product_line_controller.delete(id, tenant_id)}
