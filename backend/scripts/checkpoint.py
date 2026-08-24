from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord
from scripts.snapshot_db import create_snapshot


ZERO_FIELDS_BY_OBJECT_TYPE = {
    "product_stock": ("qty_on_hand", "qty_reserved"),
    "supply": ("qty_on_hand", "qty_reserved", "grams_on_hand", "grams_reserved"),
}


def _default_paths() -> tuple[Path, Path]:
    root = Path(__file__).resolve().parents[1]
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    timestamped_baseline = root / "backups" / f"migrate_init_baseline_{timestamp}.json"
    active_baseline = root / "data" / "migrate_init_baseline.json"
    return timestamped_baseline, active_baseline


def _to_iso(value: Any) -> str:
    if isinstance(value, datetime):
        return value.isoformat()
    text = str(value or "").strip()
    return text or datetime.now(timezone.utc).isoformat()


def _clear_numbers_for_object_type(
    repository: ObjectRepository,
    tenant_id: str,
    object_type: str,
    fields: tuple[str, ...],
) -> tuple[int, int]:
    records = repository.list_objects(tenant_id, object_type)
    touched = 0
    changed = 0
    for raw in records:
        object_id = str(raw.get("object_id") or "")
        payload = raw.get("payload", {}) if isinstance(raw.get("payload"), dict) else {}
        if not object_id:
            continue
        touched += 1
        next_payload = dict(payload)
        did_change = False
        for field in fields:
            if float(next_payload.get(field) or 0.0) != 0.0:
                next_payload[field] = 0.0
                did_change = True
        if not did_change:
            continue
        repository.upsert_object(ObjectRecord(
            object_type=object_type,
            tenant_id=tenant_id,
            object_id=object_id,
            payload=next_payload,
            created_at=_to_iso(raw.get("created_at")),
            updated_at=datetime.now(timezone.utc).isoformat(),
        ))
        changed += 1
    return touched, changed


def clear_inventory_numbers(tenant_id: str) -> dict[str, tuple[int, int]]:
    repository = ObjectRepository()
    summary: dict[str, tuple[int, int]] = {}
    for object_type, fields in ZERO_FIELDS_BY_OBJECT_TYPE.items():
        summary[object_type] = _clear_numbers_for_object_type(
            repository=repository,
            tenant_id=tenant_id,
            object_type=object_type,
            fields=fields,
        )
    return summary


def create_checkpoint(tenant_id: str, all_tenants: bool = False) -> None:
    if all_tenants:
        raise ValueError("checkpoint currently supports one tenant at a time so clear-before-snapshot is explicit")
    clear_summary = clear_inventory_numbers(tenant_id)
    timestamped_baseline_path, active_baseline_path = _default_paths()
    timestamped_baseline_path.parent.mkdir(parents=True, exist_ok=True)
    active_baseline_path.parent.mkdir(parents=True, exist_ok=True)
    create_snapshot(timestamped_baseline_path, tenant_id=tenant_id, all_tenants=False)
    active_baseline_path.write_text(timestamped_baseline_path.read_text(encoding="utf-8"), encoding="utf-8")
    for object_type, (touched, changed) in clear_summary.items():
        print(f"[checkpoint] cleared {object_type}: records_seen={touched}, records_changed={changed}")
    print(f"[checkpoint] timestamped baseline: {timestamped_baseline_path}")
    print(f"[checkpoint] active migrate-init baseline: {active_baseline_path}")
    print("[checkpoint] done: inventory numbers cleared before snapshot")


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Clear inventory numbers, then snapshot the DB as the migrate-init baseline.",
    )
    parser.add_argument(
        "--tenant-id",
        default="tenant-admin",
        help="Tenant id to checkpoint when not using --all-tenants.",
    )
    parser.add_argument(
        "--all-tenants",
        action="store_true",
        help="Reserved; checkpoint currently clears one tenant at a time.",
    )
    args = parser.parse_args(argv)
    create_checkpoint(tenant_id=args.tenant_id, all_tenants=bool(args.all_tenants))


if __name__ == "__main__":
    main()
