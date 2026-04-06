from __future__ import annotations

from fastapi import APIRouter, Query

from app.controllers.inventory_adjustment import InventoryAdjustment
from app.controllers.product_stock import ProductStock
from app.controllers.sale_receipt import SaleReceipt
from app.controllers.sale_receipt_item import SaleReceiptItem
from app.domain.enums import InventoryAdjustmentType, StockTargetType
from app.domain.record_mapper import StoredRecord, map_record
from app.models.product_stock import ProductStockDocument
from app.models.sale_receipt import SaleReceiptDocument
from app.models.sale_receipt_item import SaleReceiptItemDocument
from app.schemas.receipt import (
    SaleReceiptCreate,
    SaleReceiptItemRead,
    SaleReceiptListResponse,
    SaleReceiptRead,
)

router = APIRouter(prefix='/receipts', tags=['receipts'])

receipt_controller = SaleReceipt()
item_controller = SaleReceiptItem()
stock_controller = ProductStock()
adjustment_controller = InventoryAdjustment()


def _line_total(qty: int, unit_price: float) -> float:
    return float(qty) * float(unit_price)


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
            product_variant_id=item_record.payload.product_variant_id,
            qty=int(item_record.payload.qty),
            unit_price=float(item_record.payload.unit_price or 0),
            line_total=line_total,
        ))

    discount = float(record.payload.discount_amount or 0)
    return SaleReceiptRead(
        id=record.object_id,
        receipt_number=record.payload.receipt_number,
        site_id=record.payload.site_id,
        discount_amount=discount,
        subtotal=subtotal,
        total_amount=subtotal - discount,
        items=item_models,
    )


def _deduct_stock_and_log_adjustment(
    tenant_id: str,
    receipt_id: str,
    site_id: str,
    item_payload: SaleReceiptItemDocument,
) -> None:
    variant_id = item_payload.product_variant_id
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
    receipt_record = map_record(
        receipt_controller.create(tenant_id, {
            'receipt_number': payload.receipt_number,
            'site_id': payload.site_id,
            'discount_amount': payload.discount_amount,
        }),
        SaleReceiptDocument,
    )

    item_records: list[StoredRecord[SaleReceiptItemDocument]] = []
    for item in payload.items:
        item_payload = SaleReceiptItemDocument(
            sale_receipt_id=receipt_record.object_id,
            product_variant_id=item.product_variant_id,
            qty=item.qty,
            unit_price=item.unit_price,
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
