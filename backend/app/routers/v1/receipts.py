from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product_stock import ProductStock
from app.controllers.sale_receipt import SaleReceipt
from app.controllers.sale_receipt_item import SaleReceiptItem
from app.controllers.web_pos_session import WebPosSession
from app.domain.enums import InventoryAdjustmentType, StockTargetType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.product_stock import ProductStockDocument
from app.models.sale_receipt import SaleReceiptDocument
from app.models.sale_receipt_item import SaleReceiptItemDocument
from app.models.web_pos_session import WebPosSessionDocument
from app.schemas.receipt import (
    SaleReceiptCreate,
    SaleReceiptItemCreate,
    SaleReceiptItemRead,
    SaleReceiptListResponse,
    SaleReceiptRead,
)

router = APIRouter(prefix='/receipts', tags=['receipts'])

receipt_controller = SaleReceipt()
item_controller = SaleReceiptItem()
stock_controller = ProductStock()
adjustment_controller = InventoryAdjustment()
session_controller = WebPosSession()


def _line_total(qty: int, unit_price: float) -> float:
    return float(qty) * float(unit_price)


def _resolve_receipt_number(payload: SaleReceiptCreate) -> str:
    if payload.receipt_number and payload.receipt_number.strip():
        return payload.receipt_number.strip()
    return f"RCPT-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"


def _normalize_items(payload: SaleReceiptCreate) -> list[SaleReceiptItemCreate]:
    if payload.items:
        return payload.items
    if payload.product_variant_id or payload.inventory_item_id:
        return [SaleReceiptItemCreate(
            product_variant_id=payload.product_variant_id,
            inventory_item_id=payload.inventory_item_id,
            qty=payload.qty,
            unit_price=payload.unit_price,
            cost=payload.cost,
        )]
    return []


def _item_variant_id(item_payload: SaleReceiptItemDocument) -> str | None:
    return item_payload.product_variant_id or item_payload.inventory_item_id


def _build_receipt(
    record: StoredRecord[SaleReceiptDocument],
    item_records: list[StoredRecord[SaleReceiptItemDocument]],
) -> SaleReceiptRead:
    item_models: list[SaleReceiptItemRead] = []
    subtotal = 0.0
    for item_record in item_records:
        line_total = _line_total(int(item_record.payload.qty), float(item_record.payload.unit_price or 0))
        subtotal += line_total
        item_models.append(SaleReceiptItemRead(
            id=item_record.object_id,
            inventory_item_id=item_record.payload.inventory_item_id,
            product_variant_id=item_record.payload.product_variant_id,
            qty=int(item_record.payload.qty),
            unit_price=float(item_record.payload.unit_price or 0),
            line_total=line_total,
        ))

    discount = float(record.payload.discount_amount or 0)
    tax_amount = float(record.payload.tax_amount or 0)
    return SaleReceiptRead(
        id=record.object_id,
        receipt_number=record.payload.receipt_number,
        site_id=record.payload.site_id,
        event_id=record.payload.event_id,
        web_pos_session_id=record.payload.web_pos_session_id,
        discount_amount=discount,
        tax_amount=tax_amount,
        subtotal=subtotal,
        total_amount=subtotal - discount + tax_amount,
        payment_method=record.payload.payment_method,
        paid_amount=record.payload.paid_amount,
        cash_tendered=record.payload.cash_tendered,
        change_amount=record.payload.change_amount,
        status=record.payload.status,
        notes=record.payload.notes,
        created_at=record.created_at,
        items=item_models,
    )


def _deduct_stock_and_log_adjustment(
    tenant_id: str,
    receipt_id: str,
    site_id: str,
    item_payload: SaleReceiptItemDocument,
) -> None:
    variant_id = _item_variant_id(item_payload)
    if not variant_id:
        return
    qty = float(item_payload.qty)
    stock_records = [map_record(record, ProductStockDocument) for record in stock_controller.list(tenant_id)]

    for stock_record in stock_records:
        if stock_record.payload.product_variant_id == variant_id and stock_record.payload.site_id == site_id:
            updated_stock = stock_record.payload.model_copy(update={
                'qty_on_hand': float(stock_record.payload.qty_on_hand or 0) - qty,
            })
            stock_controller.update(stock_record.object_id, tenant_id, updated_stock.model_dump(exclude_none=True))
            adjustment_controller.create(tenant_id, {
                'target_type': StockTargetType.PRODUCT_STOCK,
                'target_id': stock_record.object_id,
                'site_id': site_id,
                'adjustment_type': InventoryAdjustmentType.DISPENSE,
                'qty_delta': -qty,
                'notes': f'Receipt {receipt_id} item dispense',
            })
            break


def _site_available_qty(tenant_id: str, site_id: str, product_variant_id: str) -> float:
    stock_records = [map_record(record, ProductStockDocument) for record in stock_controller.list(tenant_id)]
    for stock_record in stock_records:
        if (
            stock_record.payload.product_variant_id == product_variant_id
            and stock_record.payload.site_id == site_id
        ):
            return float(stock_record.payload.qty_on_hand or 0) - float(stock_record.payload.qty_reserved or 0)
    return 0.0


@router.get('', response_model=SaleReceiptListResponse)
def list_receipts(tenant_id: str = Query('tenant-admin')) -> SaleReceiptListResponse:
    receipts = [map_record(record, SaleReceiptDocument) for record in receipt_controller.list(tenant_id)]
    item_records = [map_record(record, SaleReceiptItemDocument) for record in item_controller.list(tenant_id)]

    models: list[SaleReceiptRead] = []
    for receipt in receipts:
        receipt_items = [
            item_record
            for item_record in item_records
            if item_record.payload.sale_receipt_id == receipt.object_id
        ]
        models.append(_build_receipt(receipt, receipt_items))
    return SaleReceiptListResponse(receipts=models)


@router.post('', response_model=SaleReceiptRead)
def create_receipt(payload: SaleReceiptCreate, tenant_id: str = Query('tenant-admin')) -> SaleReceiptRead:
    normalized_items = _normalize_items(payload)
    if not normalized_items:
        raise HTTPException(status_code=400, detail='Receipt must include at least one item.')

    resolved_event_id = payload.event_id
    if payload.web_pos_session_id:
        session = map_record(session_controller.get(payload.web_pos_session_id, tenant_id), WebPosSessionDocument)
        if str(session.payload.site_id or '') != str(payload.site_id or ''):
            raise HTTPException(status_code=409, detail='Session site does not match receipt site.')
        session_status = (
            session.payload.status.value
            if hasattr(session.payload.status, 'value')
            else str(session.payload.status or '')
        )
        if str(session_status).strip().lower() != 'open':
            raise HTTPException(status_code=409, detail='Session is not open.')
        if not resolved_event_id and session.payload.event_id:
            resolved_event_id = session.payload.event_id

    requested_by_variant: dict[str, float] = {}
    for item in normalized_items:
        variant_id = item.product_variant_id or item.inventory_item_id
        if not variant_id:
            continue
        requested_by_variant[variant_id] = requested_by_variant.get(variant_id, 0.0) + float(item.qty or 0)
    for variant_id, requested_qty in requested_by_variant.items():
        available_qty = _site_available_qty(tenant_id, payload.site_id, variant_id)
        if float(requested_qty) > float(available_qty):
            raise HTTPException(
                status_code=409,
                detail=f'Insufficient site stock for variant {variant_id}. Available={available_qty}, requested={requested_qty}.',
            )

    receipt_record = map_record(
        receipt_controller.create(tenant_id, {
            'receipt_number': _resolve_receipt_number(payload),
            'site_id': payload.site_id,
            'event_id': resolved_event_id,
            'web_pos_session_id': payload.web_pos_session_id,
            'discount_amount': payload.discount_amount,
            'tax_amount': payload.tax_amount,
            'payment_method': payload.payment_method,
            'paid_amount': payload.paid_amount,
            'cash_tendered': payload.cash_tendered,
            'change_amount': payload.change_amount,
            'status': payload.status,
            'notes': payload.notes,
        }),
        SaleReceiptDocument,
    )

    item_records: list[StoredRecord[SaleReceiptItemDocument]] = []
    for item in normalized_items:
        item_unit_price = float(item.unit_price if item.unit_price is not None else (item.cost or 0))
        item_payload = SaleReceiptItemDocument(
            sale_receipt_id=receipt_record.object_id,
            inventory_item_id=item.inventory_item_id,
            product_variant_id=item.product_variant_id,
            qty=item.qty,
            unit_price=item_unit_price,
        )
        item_record = map_record(
            item_controller.create(tenant_id, item_payload.model_dump(exclude_none=True)),
            SaleReceiptItemDocument,
        )
        item_records.append(item_record)
        _deduct_stock_and_log_adjustment(tenant_id, receipt_record.object_id, payload.site_id, item_payload)

    return _build_receipt(receipt_record, item_records)


@router.get('/{id}', response_model=SaleReceiptRead)
def get_receipt(id: str, tenant_id: str = Query('tenant-admin')) -> SaleReceiptRead:
    receipt = map_record(receipt_controller.get(id, tenant_id), SaleReceiptDocument)
    mapped_items = [map_record(item_record, SaleReceiptItemDocument) for item_record in item_controller.list(tenant_id)]
    items = [
        item_record
        for item_record in mapped_items
        if item_record.payload.sale_receipt_id == id
    ]
    return _build_receipt(receipt, items)
