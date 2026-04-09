from __future__ import annotations

import argparse
from datetime import datetime, timezone

from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord


def _to_iso(value: object) -> str:
    if isinstance(value, datetime):
        return value.isoformat()
    text = str(value or "").strip()
    return text or datetime.now(timezone.utc).isoformat()


def reset_inventory_for_tenant(tenant_id: str) -> tuple[int, int]:
    repository = ObjectRepository()
    records = repository.list_objects(tenant_id, "product_stock")
    touched = 0
    changed = 0

    for raw in records:
        object_id = str(raw.get("object_id") or "")
        if not object_id:
            continue
        payload = raw.get("payload", {}) if isinstance(raw.get("payload"), dict) else {}
        qty_on_hand = float(payload.get("qty_on_hand") or 0.0)
        qty_reserved = float(payload.get("qty_reserved") or 0.0)
        touched += 1

        if qty_on_hand == 0.0 and qty_reserved == 0.0:
            continue

        next_payload = dict(payload)
        next_payload["qty_on_hand"] = 0.0
        next_payload["qty_reserved"] = 0.0

        repository.upsert_object(ObjectRecord(
            object_type="product_stock",
            tenant_id=tenant_id,
            object_id=object_id,
            payload=next_payload,
            created_at=_to_iso(raw.get("created_at")),
            updated_at=datetime.now(timezone.utc).isoformat(),
        ))
        changed += 1

    return touched, changed


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Zero out inventory stock quantities.")
    parser.add_argument(
        "--tenant-id",
        action="append",
        dest="tenant_ids",
        help="Tenant ID to reset (repeatable). Defaults to tenant-admin.",
    )
    args = parser.parse_args(argv)

    tenant_ids = args.tenant_ids or ["tenant-admin"]
    for tenant_id in tenant_ids:
        touched, changed = reset_inventory_for_tenant(tenant_id)
        print(f"[reset-inventory] tenant={tenant_id} stocks_seen={touched} stocks_zeroed={changed}")
    print("[reset-inventory] done")


if __name__ == "__main__":
    main()
