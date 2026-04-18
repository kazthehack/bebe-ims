from __future__ import annotations

import argparse
from datetime import datetime, timezone
from hashlib import sha1
from pathlib import Path
import os
import re
import xml.etree.ElementTree as ET
import zipfile

from botocore.exceptions import ClientError

from app.core.config import get_settings
from app.db.dynamodb import get_dynamodb_client
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord

GSI1_NAME = "gsi1"
DEFAULT_EVENTS = [
    ("evt-001", "Orchard Easter", "2026-04-04", "2026-04-05", "scheduled"),
    ("evt-002", "SMP", "2026-04-04", "2026-04-07", "scheduled"),
    ("evt-003", "Orchard", "2026-04-09", "2026-04-12", "scheduled"),
    ("evt-004", "Newpoint", "2026-04-15", "2026-04-19", "scheduled"),
    ("evt-005", "Orchard", "2026-04-16", "2026-04-19", "scheduled"),
    ("evt-006", "Mabalacat City Colleges", "2026-04-21", "2026-04-25", "scheduled"),
    ("evt-007", "Orchard", "2026-04-24", "2026-04-26", "scheduled"),
]
DEFAULT_SUPPLY_BRANDS = [
    "Bambu",
    "Esun",
    "Sunlu",
    "Overture",
]
DEFAULT_SITES = [
    ("site1", "SITE-001", "Primary (A)", "Primary (A)"),
    ("site2", "SITE-002", "Secondary (B)", "Secondary (B)"),
    ("site3", "SITE-003", "Tertiary (C)", "Tertiary (C)"),
]
INVENTORY_SEED_SOURCE = "inventory_xlsm_seed_v2"
INVENTORY_CATEGORY_SHEETS = (
    "BEBESWEETS",
    "BEBENTO",
    "BEBEEATS",
    "BEBEPLAYS",
    "BEBECATS",
    "BEBEDOGS",
    "BEBEMONS",
    "BEBESAURS",
)
INVENTORY_EXTRA_PRODUCT_LINES = (
    "BEBESPORTS",
    "BEBEANIME",
    "BEBETOYS",
    "BEBETREND",
)
INVENTORY_IMPORT_SOURCES = (
    Path(__file__).resolve().parents[1] / "data" / "inventory_seed.xlsm",
)
PRODUCT_VARIANT_OVERRIDES: dict[str, tuple[str, ...]] = {
    "matcha whisk": ("Gray", "Black", "Marble"),
    "treasure chest": ("Closed", "Tongue"),
    "potion": ("Red", "Gold", "Blue"),
    "tuna nigiri": ("Original", "With a Smile"),
    "tempura": ("Original", "With a Smile"),
    "sunny side up egg": ("Original", "With a Smile"),
    "salmon nigiri": ("Original", "With a Smile"),
    "cup noodles": ("Red", "Blue"),
    "butter toast": ("Original", "With a Smile"),
    "bacon": ("Original", "With a Smile"),
    "grumpy cat": ("Pink", "Gray"),
    "flexi cat": ("White", "Black", "Tuxedo", "Gray", "Glow"),
    "dog paw xl": ("Black", "Brown"),
    "corgi butt": ("Pink", "Gray"),
    "calico butt": ("Pink", "Gray"),
    "cat paw xl": ("White", "Black"),
    "cat ice cream": ("Chocolate", "Strawberry"),
}
IGNORED_ITEM_PREFIXES = (
    "total",
    "subtotal",
    "grand total",
)
GENERIC_VARIANT_VALUES = {
    "multicolor",
    "multi color",
    "assorted",
    "mixed",
    "n/a",
    "na",
    "none",
    "default",
    "-",
}


def normalize_brand_id(value: str) -> str:
    base = re.sub(r"\s+", " ", str(value or "").strip().lower())
    slug = re.sub(r"[^a-z0-9 -]", "", base).replace(" ", "-")
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def normalize_brand_display(value: str) -> str:
    cleaned = re.sub(r"\s+", " ", str(value or "").strip())
    if not cleaned:
        return ""
    return " ".join(part[:1].upper() + part[1:].lower() for part in cleaned.split(" "))


def slugify(value: str) -> str:
    base = re.sub(r"\s+", " ", str(value or "").strip().lower())
    slug = re.sub(r"[^a-z0-9 -]", "", base).replace(" ", "-")
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def stable_id(prefix: str, *parts: str) -> str:
    text = "|".join(str(part or "").strip().lower() for part in parts)
    digest = sha1(text.encode("utf-8")).hexdigest()[:16]
    return f"{prefix}-{digest}"


def to_float(value: object) -> float:
    if value in (None, ""):
        return 0.0
    try:
        return float(value)
    except (TypeError, ValueError):
        raw = re.sub(r"[^0-9.\-]", "", str(value))
        if not raw:
            return 0.0
        try:
            return float(raw)
        except ValueError:
            return 0.0


def to_text(value: object) -> str:
    return str(value or "").strip()


def find_inventory_workbook() -> Path | None:
    env_path = os.getenv("INVENTORY_SEED_XLSX", "").strip()
    candidates: list[Path] = []
    if env_path:
        candidates.append(Path(env_path).expanduser())
    candidates.extend(INVENTORY_IMPORT_SOURCES)
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def col_to_index(ref: str) -> int:
    letters = "".join(ch for ch in ref if ch.isalpha()).upper()
    value = 0
    for ch in letters:
        value = value * 26 + (ord(ch) - ord("A") + 1)
    return max(0, value - 1)


def parse_xlsx_sheet_rows(path: Path, sheet_name: str) -> list[list[object]]:
    ns_main = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ns_rel_doc = {"r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    ns_pkg_rel = {"pr": "http://schemas.openxmlformats.org/package/2006/relationships"}

    with zipfile.ZipFile(path, "r") as archive:
        workbook_xml = ET.fromstring(archive.read("xl/workbook.xml"))
        rels_xml = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            sst_xml = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for si in sst_xml.findall("m:si", ns_main):
                parts = [node.text or "" for node in si.findall(".//m:t", ns_main)]
                shared_strings.append("".join(parts))

        rel_target_by_id: dict[str, str] = {}
        for rel in rels_xml.findall("pr:Relationship", ns_pkg_rel):
            rel_id = rel.attrib.get("Id", "")
            target = rel.attrib.get("Target", "")
            if rel_id and target:
                rel_target_by_id[rel_id] = target

        sheet_target = ""
        for sheet in workbook_xml.findall("m:sheets/m:sheet", ns_main):
            if sheet.attrib.get("name") != sheet_name:
                continue
            rel_id = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
            if not rel_id:
                continue
            target = rel_target_by_id.get(rel_id, "")
            if not target:
                continue
            normalized_target = target.strip().lstrip("/")
            sheet_target = (
                normalized_target
                if normalized_target.startswith("xl/")
                else f"xl/{normalized_target}"
            )
            break
        if not sheet_target:
            return []

        sheet_xml = ET.fromstring(archive.read(sheet_target))
        rows: list[list[object]] = []
        for row_node in sheet_xml.findall("m:sheetData/m:row", ns_main):
            values_by_col: dict[int, object] = {}
            max_col = -1
            for cell in row_node.findall("m:c", ns_main):
                ref = cell.attrib.get("r", "")
                col_idx = col_to_index(ref) if ref else (max(values_by_col.keys()) + 1 if values_by_col else 0)
                max_col = max(max_col, col_idx)
                cell_type = cell.attrib.get("t")
                value_node = cell.find("m:v", ns_main)
                value_text = value_node.text if value_node is not None else None
                if cell_type == "s":
                    shared_idx = int(value_text or 0)
                    value = shared_strings[shared_idx] if 0 <= shared_idx < len(shared_strings) else ""
                elif cell_type == "inlineStr":
                    text_nodes = cell.findall(".//m:t", ns_main)
                    value = "".join(node.text or "" for node in text_nodes)
                elif cell_type in ("str", "b"):
                    value = value_text or ""
                else:
                    raw = value_text or ""
                    if raw == "":
                        value = ""
                    else:
                        try:
                            number = float(raw)
                            value = int(number) if number.is_integer() else number
                        except ValueError:
                            value = raw
                values_by_col[col_idx] = value
            if max_col < 0:
                continue
            row_values = [values_by_col.get(idx, "") for idx in range(max_col + 1)]
            rows.append(row_values)
        return rows


def normalize_header(value: object) -> str:
    return str(value or "").strip().casefold()


def pick_header_index(header: list[object], *candidates: str) -> int | None:
    normalized = [normalize_header(value) for value in header]
    for candidate in candidates:
        target = normalize_header(candidate)
        for idx, value in enumerate(normalized):
            if value == target:
                return idx
    return None


def parse_grouped_inventory_rows(workbook_path: Path) -> tuple[dict[tuple[str, str, str], dict], str]:
    grouped: dict[tuple[str, str, str], dict] = {}

    # v2 format: one sheet per product line with headers at row 4.
    for line_name in INVENTORY_CATEGORY_SHEETS:
        rows = parse_xlsx_sheet_rows(workbook_path, line_name)
        if not rows:
            continue
        header_row_index = -1
        for idx, row in enumerate(rows[:15]):
            if pick_header_index(row, "SKU") is not None and pick_header_index(row, "Item") is not None:
                header_row_index = idx
                break
        if header_row_index < 0:
            continue

        header = rows[header_row_index]
        idx_sku = pick_header_index(header, "SKU")
        idx_item = pick_header_index(header, "Item")
        idx_color = pick_header_index(header, "Color / Variant", "Color", "Variant")
        idx_ip = pick_header_index(header, "IP", "Ip", "Intellectual Property")
        idx_display_a = pick_header_index(header, "Display A", "Acrylic A")
        idx_display_b = pick_header_index(header, "Display B", "Acrylic B")
        idx_display_c = pick_header_index(header, "Display C", "Acrylic C")
        idx_back_stock = pick_header_index(header, "Back Stock", "Main Stocks")
        idx_original = pick_header_index(header, "Original Inventory", "Current Inventory as of March 22", "Current Inventory")
        idx_photo = pick_header_index(header, "Photo")

        if None in (idx_sku, idx_item, idx_display_a, idx_display_b, idx_display_c, idx_back_stock):
            continue

        for row in rows[header_row_index + 1:]:
            sku = to_text(row[idx_sku]) if idx_sku < len(row) else ""
            item = to_text(row[idx_item]) if idx_item < len(row) else ""
            if not sku and not item:
                continue
            if not item:
                continue
            color = to_text(row[idx_color]) if idx_color is not None and idx_color < len(row) else ""
            ip = to_text(row[idx_ip]) if idx_ip is not None and idx_ip < len(row) else ""
            display_a = to_float(row[idx_display_a]) if idx_display_a < len(row) else 0
            display_b = to_float(row[idx_display_b]) if idx_display_b < len(row) else 0
            display_c = to_float(row[idx_display_c]) if idx_display_c < len(row) else 0
            back_stock = to_float(row[idx_back_stock]) if idx_back_stock < len(row) else 0
            original_inventory = to_float(row[idx_original]) if idx_original is not None and idx_original < len(row) else 0
            photo = to_text(row[idx_photo]) if idx_photo is not None and idx_photo < len(row) else ""

            if back_stock <= 0 and original_inventory > 0:
                inferred_main = original_inventory - (display_a + display_b + display_c)
                if inferred_main > 0:
                    back_stock = inferred_main

            item_name = item.strip()
            color_name = color.strip()
            normalized_item = item_name.casefold()
            if not item_name:
                continue
            if any(normalized_item.startswith(prefix) for prefix in IGNORED_ITEM_PREFIXES):
                continue
            if color_name.casefold() in GENERIC_VARIANT_VALUES:
                color_name = ""

            # If the item cell includes the variant suffix already and a dedicated
            # color/variant value exists, keep product as base item name.
            if color_name and item_name.casefold().endswith(f" {color_name}".casefold()):
                item_name = item_name[: -len(color_name)].strip()

            # If color is absent, try known variant overrides to split base product
            # and variant from combined item names.
            if not color_name:
                normalized_item = item_name.casefold()
                for normalized_product_name, desired_variants in PRODUCT_VARIANT_OVERRIDES.items():
                    base = str(normalized_product_name or "").strip()
                    if not base:
                        continue
                    base_cf = base.casefold()
                    for desired_variant in desired_variants:
                        variant_display = str(desired_variant or "").strip()
                        if not variant_display:
                            continue
                        combined_cf = f"{base_cf} {variant_display.casefold()}"
                        if normalized_item == combined_cf:
                            item_name = " ".join(part.capitalize() for part in base.split())
                            color_name = variant_display
                            break
                    if color_name:
                        break

            # Variant rule: use explicit/split variant when present; otherwise
            # fallback to the base product name itself.
            variant_name = color_name or item_name
            key = (line_name, item_name, variant_name)
            entry = grouped.get(key)
            if not entry:
                entry = {
                    "line_name": line_name,
                    "product_name": item_name,
                    "variant_name": variant_name,
                    "legacy_sku": sku,
                    "batch_size": 1,
                    "grams_per_piece": 0.0,
                    "photo": photo,
                    "category": "regular_100",
                    "ip": ip or "",
                    "main_qty": 0.0,
                    "site1_qty": 0.0,
                    "site2_qty": 0.0,
                    "site3_qty": 0.0,
                }
                grouped[key] = entry
            entry["main_qty"] += max(0.0, back_stock)
            entry["site1_qty"] += max(0.0, display_a)
            entry["site2_qty"] += max(0.0, display_b)
            entry["site3_qty"] += max(0.0, display_c)
            if not entry["legacy_sku"] and sku:
                entry["legacy_sku"] = sku
            if not entry["category"]:
                entry["category"] = "regular_100"
            if not entry["ip"] and ip:
                entry["ip"] = ip
            if not entry["photo"] and photo:
                entry["photo"] = photo

    return grouped, "v2-category-tabs-only"


def apply_product_variant_overrides(grouped: dict[tuple[str, str, str], dict]) -> dict[tuple[str, str, str], dict]:
    if not grouped:
        return grouped

    updated = dict(grouped)
    for normalized_product_name, desired_variants in PRODUCT_VARIANT_OVERRIDES.items():
        product_keys = [
            key for key in updated.keys()
            if str(key[1] or "").strip().casefold() == normalized_product_name
        ]
        if not product_keys:
            continue

        template = updated[product_keys[0]].copy()
        desired_map = {
            str(variant).strip().casefold(): str(variant).strip()
            for variant in desired_variants
            if str(variant).strip()
        }

        for key in product_keys:
            variant_name = str(key[2] or "").strip().casefold()
            if variant_name not in desired_map:
                updated.pop(key, None)

        for normalized_variant, display_variant in desired_map.items():
            override_key = (template["line_name"], template["product_name"], display_variant)
            if override_key in updated:
                row = updated[override_key]
                row["variant_name"] = display_variant
                continue
            updated[override_key] = {
                "line_name": template["line_name"],
                "product_name": template["product_name"],
                "variant_name": display_variant,
                "legacy_sku": "",
                "batch_size": int(template.get("batch_size") or 1),
                "grams_per_piece": float(template.get("grams_per_piece") or 0.0),
                "photo": template.get("photo") or "",
                "category": "regular_100",
                "ip": template.get("ip") or "",
                "main_qty": 0.0,
                "site1_qty": 0.0,
                "site2_qty": 0.0,
                "site3_qty": 0.0,
            }

    return updated

def ensure_table_exists() -> None:
    settings = get_settings()
    client = get_dynamodb_client()
    table_name = settings.dynamodb_table_name

    try:
        client.describe_table(TableName=table_name)
        print(f"[migrate] table exists: {table_name}")
        return
    except ClientError as exc:
        code = exc.response.get("Error", {}).get("Code", "")
        if code != "ResourceNotFoundException":
            raise

    print(f"[migrate] creating table: {table_name}")
    client.create_table(
        TableName=table_name,
        BillingMode="PAY_PER_REQUEST",
        AttributeDefinitions=[
            {"AttributeName": "pk", "AttributeType": "S"},
            {"AttributeName": "sk", "AttributeType": "S"},
            {"AttributeName": "gsi1pk", "AttributeType": "S"},
            {"AttributeName": "gsi1sk", "AttributeType": "S"},
        ],
        KeySchema=[
            {"AttributeName": "pk", "KeyType": "HASH"},
            {"AttributeName": "sk", "KeyType": "RANGE"},
        ],
        GlobalSecondaryIndexes=[
            {
                "IndexName": GSI1_NAME,
                "KeySchema": [
                    {"AttributeName": "gsi1pk", "KeyType": "HASH"},
                    {"AttributeName": "gsi1sk", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
            }
        ],
    )
    waiter = client.get_waiter("table_exists")
    waiter.wait(TableName=table_name)
    print(f"[migrate] table ready: {table_name}")


def create_object_if_missing(
    repository: ObjectRepository,
    *,
    tenant_id: str,
    object_type: str,
    object_id: str,
    payload: dict,
) -> bool:
    now = datetime.now(timezone.utc).isoformat()
    existing = repository.get_object(tenant_id, object_type, object_id)
    if existing:
        return False

    record = ObjectRecord(
        object_type=object_type,
        tenant_id=tenant_id,
        object_id=object_id,
        payload=payload,
        created_at=now,
        updated_at=now,
    )
    repository.upsert_object(record)
    return True


def upsert_object(
    repository: ObjectRepository,
    *,
    tenant_id: str,
    object_type: str,
    object_id: str,
    payload: dict,
) -> None:
    now = datetime.now(timezone.utc).isoformat()
    existing = repository.get_object(tenant_id, object_type, object_id)
    created_at = now
    if existing and existing.get("created_at"):
        existing_created_at = existing["created_at"]
        if isinstance(existing_created_at, datetime):
            created_at = existing_created_at.isoformat()
        else:
            created_at = str(existing_created_at)
    record = ObjectRecord(
        object_type=object_type,
        tenant_id=tenant_id,
        object_id=object_id,
        payload=payload,
        created_at=created_at,
        updated_at=now,
    )
    repository.upsert_object(record)


def seed_default_accounts() -> None:
    settings = get_settings()
    repository = ObjectRepository()
    users = ["admin", "site1", "site2", "site3"]

    for username in users:
        tenant_id = f"tenant-{username}"
        store_id = f"store-{username}"
        user_id = f"user-{username}"

        user_created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="users",
            object_id=user_id,
            payload={
                "name": username.title(),
                "short_name": username,
                "email": f"{username}@local.bebe",
                "password": settings.local_auth_password,
                "global_active": True,
                "active": True,
                "store_id": store_id,
            },
        )

        store_created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="store",
            object_id=store_id,
            payload={
                "id": store_id,
                "name": f"{username.title()} Store",
                "owner": {
                    "id": user_id,
                    "username": username,
                },
                "settings": {
                    "timezone": "Asia/Manila",
                    "enableNewDashboard": False,
                    "allowDashboardSelection": False,
                },
            },
        )
        if user_created or store_created:
            print(f"[migrate] seeded account: {username} (tenant={tenant_id}, store={store_id})")
        else:
            print(f"[migrate] skip existing account: {username} (tenant={tenant_id})")


def seed_default_events() -> None:
    repository = ObjectRepository()
    tenant_id = "tenant-admin"

    for index, (event_id, title, start_date, end_date, status) in enumerate(DEFAULT_EVENTS, start=1):
        created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="event",
            object_id=event_id,
            payload={
                "code": f"EVT-{index:03d}",
                "title": title,
                "organizer": "Bebe Inventory",
                "rent_cost_per_day": 0.0,
                "start_date": start_date,
                "end_date": end_date,
                "start_time": "09:00",
                "end_time": "18:00",
                "location": None,
                "status": status,
            },
        )
        if created:
            print(f"[migrate] seeded event: {event_id} ({title})")
        else:
            print(f"[migrate] skip existing event: {event_id}")


def seed_default_supply_brands() -> None:
    repository = ObjectRepository()
    tenant_id = "tenant-admin"

    for raw_brand in DEFAULT_SUPPLY_BRANDS:
        brand_id = normalize_brand_id(raw_brand)
        display_name = normalize_brand_display(raw_brand)
        if not brand_id or not display_name:
            continue
        created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="supply_brand",
            object_id=brand_id,
            payload={
                "id": brand_id,
                "display_name": display_name,
            },
        )
        if created:
            print(f"[migrate] seeded supply_brand: {brand_id} ({display_name})")
        else:
            print(f"[migrate] skip existing supply_brand: {brand_id}")


def seed_default_sites() -> None:
    repository = ObjectRepository()
    tenant_id = "tenant-admin"

    for object_id, code, name, location in DEFAULT_SITES:
        created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="site",
            object_id=object_id,
            payload={
                "id": object_id,
                "code": code,
                "name": name,
                "location": location,
                "active": True,
            },
        )
        if created:
            print(f"[migrate] seeded site: {object_id} ({name})")
        else:
            print(f"[migrate] skip existing site: {object_id}")


def seed_inventory_from_workbook() -> None:
    workbook_path = find_inventory_workbook()
    if not workbook_path:
        print("[migrate] skip inventory import: workbook not found (set INVENTORY_SEED_XLSX to override)")
        return

    grouped, detected_format = parse_grouped_inventory_rows(workbook_path)
    if not grouped:
        print("[migrate] skip inventory import: no importable rows found in workbook")
        return
    grouped = apply_product_variant_overrides(grouped)
    print(f"[migrate] inventory format detected: {detected_format} ({len(grouped)} variant rows)")
    imported_from = workbook_path.name

    tenant_id = "tenant-admin"
    repository = ObjectRepository()

    # One-time cleanup for earlier bad imports that produced summary rows
    # and generic placeholder variants.
    bad_product_ids: set[str] = set()
    bad_variant_ids: set[str] = set()
    removed_bad_products = 0
    removed_bad_variants = 0
    removed_bad_stocks = 0

    for record in repository.list_objects(tenant_id, "product"):
        payload = record.get("payload", {}) if isinstance(record.get("payload"), dict) else {}
        name = str(payload.get("name") or "").strip().casefold()
        if any(name.startswith(prefix) for prefix in IGNORED_ITEM_PREFIXES):
            object_id = str(record.get("object_id") or "")
            if object_id and repository.delete_object(tenant_id, "product", object_id):
                bad_product_ids.add(object_id)
                removed_bad_products += 1

    for record in repository.list_objects(tenant_id, "product_variant"):
        payload = record.get("payload", {}) if isinstance(record.get("payload"), dict) else {}
        object_id = str(record.get("object_id") or "")
        variant_name = str(payload.get("name") or "").strip().casefold()
        product_id = str(payload.get("product_id") or "")
        if product_id in bad_product_ids or variant_name in GENERIC_VARIANT_VALUES:
            if object_id and repository.delete_object(tenant_id, "product_variant", object_id):
                bad_variant_ids.add(object_id)
                removed_bad_variants += 1

    for record in repository.list_objects(tenant_id, "product_stock"):
        payload = record.get("payload", {}) if isinstance(record.get("payload"), dict) else {}
        object_id = str(record.get("object_id") or "")
        variant_id = str(payload.get("product_variant_id") or "")
        if variant_id in bad_variant_ids:
            if object_id and repository.delete_object(tenant_id, "product_stock", object_id):
                removed_bad_stocks += 1

    expected_ids: dict[str, set[str]] = {
        "product_line": set(),
        "product": set(),
        "product_variant": set(),
        "product_stock": set(),
    }
    line_upserted = 0
    product_upserted = 0
    variant_upserted = 0
    stock_ensured = 0
    stock_preserved = 0

    line_names = {
        str(row.get("line_name") or "").strip()
        for row in grouped.values()
        if str(row.get("line_name") or "").strip()
    }
    line_names.update(INVENTORY_EXTRA_PRODUCT_LINES)
    for line_name in sorted(line_names):
        line_id = stable_id("pline", line_name)
        expected_ids["product_line"].add(line_id)
        upsert_object(
            repository,
            tenant_id=tenant_id,
            object_type="product_line",
            object_id=line_id,
            payload={
                "id": line_id,
                "code": line_name.upper(),
                "name": line_name,
                "description": f"Imported from {imported_from}",
                "active": True,
                "seed_source": INVENTORY_SEED_SOURCE,
            },
        )
        line_upserted += 1

    for key in sorted(grouped.keys()):
        row = grouped[key]
        line_name = row["line_name"]
        product_name = row["product_name"]
        variant_name = row["variant_name"]
        line_slug = slugify(line_name) or "unassigned"
        product_slug = slugify(product_name) or "item"
        variant_slug = slugify(variant_name) or "default"

        line_id = stable_id("pline", line_name)
        line_code = line_name.upper()
        product_id = stable_id("prod", line_name, product_name)
        variant_id = stable_id("var", line_name, product_name, variant_name)
        expected_ids["product_line"].add(line_id)
        expected_ids["product"].add(product_id)
        expected_ids["product_variant"].add(variant_id)

        product_code = f"{line_slug[:3].upper()}-{sha1(f'{line_name}|{product_name}'.encode('utf-8')).hexdigest()[:5].upper()}"
        product_description = (
            f"Imported from {imported_from} | Batch Size: {row['batch_size']} | Grams/Pcs: {row['grams_per_piece']:.2f}"
            if row["grams_per_piece"] > 0
            else f"Imported from {imported_from} | Batch Size: {row['batch_size']}"
        )
        upsert_object(
            repository,
            tenant_id=tenant_id,
            object_type="product",
            object_id=product_id,
            payload={
                "id": product_id,
                "product_code": product_code,
                "name": product_name,
                "product_line_id": line_id,
                "product_line_name": line_name,
                "product_line_code": line_code,
                "ip": row["ip"] or None,
                "category": "regular_100",
                "list_price": 100.0,
                "description": product_description,
                "image_url": row["photo"] or None,
                "seed_source": INVENTORY_SEED_SOURCE,
            },
        )
        product_upserted += 1

        variant_sku = (
            row["legacy_sku"]
            or f"{product_slug[:3].upper()}-{variant_slug[:3].upper()}-{sha1(f'{product_id}|{variant_name}'.encode('utf-8')).hexdigest()[:4].upper()}"
        )
        upsert_object(
            repository,
            tenant_id=tenant_id,
            object_type="product_variant",
            object_id=variant_id,
            payload={
                "id": variant_id,
                "product_id": product_id,
                "sku": variant_sku,
                "name": variant_name,
                "yield_units": max(1, int(row["batch_size"] or 1)),
                "print_hours": 0.0,
                "qr_code": f"QR-{variant_id.upper()}",
                "image_url": row["photo"] or None,
                "seed_source": INVENTORY_SEED_SOURCE,
            },
        )
        variant_upserted += 1

        for site_id, default_qty in (
            ("main", 0.0),
            ("site1", 0.0),
            ("site2", 0.0),
            ("site3", 0.0),
        ):
            stock_id = stable_id("stock", variant_id, site_id)
            expected_ids["product_stock"].add(stock_id)
            existing_stock = repository.get_object(tenant_id, "product_stock", stock_id)
            existing_payload = existing_stock.get("payload", {}) if isinstance(existing_stock, dict) else {}
            qty_on_hand = float(existing_payload.get("qty_on_hand", default_qty) or default_qty)
            qty_reserved = float(existing_payload.get("qty_reserved", 0.0) or 0.0)
            low_stock_threshold = float(existing_payload.get("low_stock_threshold", 0.0) or 0.0)
            upsert_object(
                repository,
                tenant_id=tenant_id,
                object_type="product_stock",
                object_id=stock_id,
                payload={
                    "id": stock_id,
                    "product_variant_id": variant_id,
                    "site_id": site_id,
                    "qty_on_hand": qty_on_hand,
                    "qty_reserved": qty_reserved,
                    "low_stock_threshold": low_stock_threshold,
                    "seed_source": INVENTORY_SEED_SOURCE,
                },
            )
            stock_ensured += 1
            if existing_stock:
                stock_preserved += 1

    removed: dict[str, int] = {}
    for object_type in ("product_variant", "product", "product_line"):
        removed_count = 0
        existing_records = repository.list_objects(tenant_id, object_type)
        for record in existing_records:
            object_id = str(record.get("object_id") or "")
            payload = record.get("payload", {}) if isinstance(record.get("payload"), dict) else {}
            if payload.get("seed_source") != INVENTORY_SEED_SOURCE:
                continue
            if object_id in expected_ids[object_type]:
                continue
            if repository.delete_object(tenant_id, object_type, object_id):
                removed_count += 1
        removed[object_type] = removed_count

    print(
        "[migrate] inventory import summary: "
        f"lines upserted={line_upserted}, removed={removed.get('product_line', 0)}; "
        f"products upserted={product_upserted}, removed={removed.get('product', 0)}; "
        f"variants upserted={variant_upserted}, removed={removed.get('product_variant', 0)}; "
        f"stocks ensured={stock_ensured}, preserved={stock_preserved}; "
        f"cleanup bad products={removed_bad_products}, bad variants={removed_bad_variants}, bad stocks={removed_bad_stocks}"
    )


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Run DynamoDB migration and seed tasks.")
    parser.add_argument(
        "--include-inventory-seed",
        action="store_true",
        help="Import and catalog-sync inventory from backend/data/inventory_seed.xlsm (preserves existing stock numbers).",
    )
    args = parser.parse_args(argv)

    ensure_table_exists()
    seed_default_accounts()
    seed_default_events()
    seed_default_supply_brands()
    seed_default_sites()
    if args.include_inventory_seed:
        seed_inventory_from_workbook()
    else:
        print("[migrate] skip inventory import (use --include-inventory-seed to enable)")
    print("[migrate] done")


if __name__ == "__main__":
    main()
