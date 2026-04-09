from __future__ import annotations

from io import BytesIO
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import zipfile

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

INVENTORY_IMPORT_SOURCES = (
    Path(__file__).resolve().parents[2] / "data" / "inventory_seed.xlsm",
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


def _normalize_text(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().casefold())


def _col_to_index(ref: str) -> int:
    letters = "".join(ch for ch in ref if ch.isalpha()).upper()
    value = 0
    for ch in letters:
        value = value * 26 + (ord(ch) - ord("A") + 1)
    return max(0, value - 1)


def _index_to_col(index: int) -> str:
    value = index + 1
    chars: list[str] = []
    while value > 0:
        value, remainder = divmod(value - 1, 26)
        chars.append(chr(ord("A") + remainder))
    return "".join(reversed(chars))


def _normalize_header(value: object) -> str:
    return str(value or "").strip().casefold()


def _pick_header_index(header: list[object], *candidates: str) -> int | None:
    normalized = [_normalize_header(value) for value in header]
    for candidate in candidates:
        target = _normalize_header(candidate)
        for idx, value in enumerate(normalized):
            if value == target:
                return idx
    return None


def _read_cell_value(cell: ET.Element, ns_main: dict[str, str], shared_strings: list[str]) -> object:
    cell_type = cell.attrib.get("t")
    value_node = cell.find("m:v", ns_main)
    value_text = value_node.text if value_node is not None else None
    if cell_type == "s":
        shared_idx = int(value_text or 0)
        return shared_strings[shared_idx] if 0 <= shared_idx < len(shared_strings) else ""
    if cell_type == "inlineStr":
        text_nodes = cell.findall(".//m:t", ns_main)
        return "".join(node.text or "" for node in text_nodes)
    if cell_type in ("str", "b"):
        return value_text or ""
    raw = value_text or ""
    if raw == "":
        return ""
    try:
        number = float(raw)
        return int(number) if number.is_integer() else number
    except ValueError:
        return raw


def _set_cell_number(
    row_node: ET.Element,
    row_number: int,
    col_index: int,
    value: float,
    ns_main: dict[str, str],
) -> None:
    cell_ref = f"{_index_to_col(col_index)}{row_number}"
    target_cell: ET.Element | None = None
    for candidate in row_node.findall("m:c", ns_main):
        if candidate.attrib.get("r") == cell_ref:
            target_cell = candidate
            break
    if target_cell is None:
        target_cell = ET.SubElement(
            row_node,
            f"{{{ns_main['m']}}}c",
            {"r": cell_ref},
        )
    target_cell.attrib.pop("t", None)
    for inline_node in list(target_cell.findall("m:is", ns_main)):
        target_cell.remove(inline_node)
    value_node = target_cell.find("m:v", ns_main)
    if value_node is None:
        value_node = ET.SubElement(target_cell, f"{{{ns_main['m']}}}v")
    number = float(value or 0)
    value_node.text = str(int(number)) if number.is_integer() else f"{number:.4f}".rstrip("0").rstrip(".")


def _variant_name(item_name: str, color_value: str) -> str:
    color = str(color_value or "").strip()
    if _normalize_text(color) in GENERIC_VARIANT_VALUES:
        color = ""
    return color or item_name


def export_inventory_workbook_bytes(
    grouped_inventory: dict[tuple[str, str, str], dict[str, float]],
    workbook_path: Path,
) -> bytes:
    ns_main = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    ns_rel_doc = {"r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    ns_pkg_rel = {"pr": "http://schemas.openxmlformats.org/package/2006/relationships"}

    with zipfile.ZipFile(workbook_path, "r") as archive:
        file_bytes = {name: archive.read(name) for name in archive.namelist()}

    workbook_xml = ET.fromstring(file_bytes["xl/workbook.xml"])
    rels_xml = ET.fromstring(file_bytes["xl/_rels/workbook.xml.rels"])

    shared_strings: list[str] = []
    if "xl/sharedStrings.xml" in file_bytes:
        sst_xml = ET.fromstring(file_bytes["xl/sharedStrings.xml"])
        for si in sst_xml.findall("m:si", ns_main):
            parts = [node.text or "" for node in si.findall(".//m:t", ns_main)]
            shared_strings.append("".join(parts))

    rel_target_by_id: dict[str, str] = {}
    for rel in rels_xml.findall("pr:Relationship", ns_pkg_rel):
        rel_id = rel.attrib.get("Id", "")
        target = rel.attrib.get("Target", "")
        if rel_id and target:
            rel_target_by_id[rel_id] = target

    sheet_target_by_name: dict[str, str] = {}
    for sheet in workbook_xml.findall("m:sheets/m:sheet", ns_main):
        sheet_name = sheet.attrib.get("name", "")
        rel_id = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        if not rel_id:
            continue
        target = rel_target_by_id.get(rel_id, "")
        if not target:
            continue
        normalized_target = target.strip().lstrip("/")
        sheet_target_by_name[sheet_name] = (
            normalized_target if normalized_target.startswith("xl/") else f"xl/{normalized_target}"
        )

    for line_name in INVENTORY_CATEGORY_SHEETS:
        sheet_target = sheet_target_by_name.get(line_name)
        if not sheet_target or sheet_target not in file_bytes:
            continue

        sheet_xml = ET.fromstring(file_bytes[sheet_target])
        row_nodes = sheet_xml.findall("m:sheetData/m:row", ns_main)
        if not row_nodes:
            continue

        header_row_node: ET.Element | None = None
        header_map: dict[int, object] = {}
        for row_node in row_nodes[:15]:
            values_by_col: dict[int, object] = {}
            for cell in row_node.findall("m:c", ns_main):
                ref = cell.attrib.get("r", "")
                if not ref:
                    continue
                col_idx = _col_to_index(ref)
                values_by_col[col_idx] = _read_cell_value(cell, ns_main, shared_strings)
            header_values = [values_by_col.get(idx, "") for idx in range((max(values_by_col.keys()) + 1) if values_by_col else 0)]
            if _pick_header_index(header_values, "SKU") is not None and _pick_header_index(header_values, "Item") is not None:
                header_row_node = row_node
                header_map = values_by_col
                break
        if header_row_node is None:
            continue

        max_header_idx = max(header_map.keys()) if header_map else -1
        header = [header_map.get(idx, "") for idx in range(max_header_idx + 1)]
        idx_item = _pick_header_index(header, "Item")
        idx_color = _pick_header_index(header, "Color / Variant", "Color", "Variant")
        idx_display_a = _pick_header_index(header, "Display A", "Acrylic A")
        idx_display_b = _pick_header_index(header, "Display B", "Acrylic B")
        idx_display_c = _pick_header_index(header, "Display C", "Acrylic C")
        idx_back_stock = _pick_header_index(header, "Back Stock", "Main Stocks")
        idx_original = _pick_header_index(header, "Original Inventory", "Current Inventory as of March 22", "Current Inventory")
        if None in (idx_item, idx_display_a, idx_display_b, idx_display_c, idx_back_stock):
            continue

        header_row_number = int(header_row_node.attrib.get("r", "1") or "1")
        for row_node in row_nodes:
            row_number = int(row_node.attrib.get("r", "0") or "0")
            if row_number <= header_row_number:
                continue
            values_by_col: dict[int, object] = {}
            for cell in row_node.findall("m:c", ns_main):
                ref = cell.attrib.get("r", "")
                if not ref:
                    continue
                col_idx = _col_to_index(ref)
                values_by_col[col_idx] = _read_cell_value(cell, ns_main, shared_strings)

            item_name = str(values_by_col.get(idx_item, "")).strip()
            if not item_name:
                continue
            color_value = str(values_by_col.get(idx_color, "")).strip() if idx_color is not None else ""
            variant_name = _variant_name(item_name, color_value)
            key = (_normalize_text(line_name), _normalize_text(item_name), _normalize_text(variant_name))
            quantity = grouped_inventory.get(key)
            if not quantity:
                continue

            display_a = float(quantity.get("site1", 0.0) or 0.0)
            display_b = float(quantity.get("site2", 0.0) or 0.0)
            display_c = float(quantity.get("site3", 0.0) or 0.0)
            back_stock = float(quantity.get("storage", 0.0) or 0.0)
            global_total = float(quantity.get("global", 0.0) or 0.0)
            _set_cell_number(row_node, row_number, idx_display_a, display_a, ns_main)
            _set_cell_number(row_node, row_number, idx_display_b, display_b, ns_main)
            _set_cell_number(row_node, row_number, idx_display_c, display_c, ns_main)
            _set_cell_number(row_node, row_number, idx_back_stock, back_stock, ns_main)
            if idx_original is not None:
                _set_cell_number(row_node, row_number, idx_original, global_total, ns_main)

        file_bytes[sheet_target] = ET.tostring(sheet_xml, encoding="utf-8", xml_declaration=True)

    output_buffer = BytesIO()
    with zipfile.ZipFile(output_buffer, "w", compression=zipfile.ZIP_DEFLATED) as writer:
        for name, content in file_bytes.items():
            writer.writestr(name, content)
    return output_buffer.getvalue()
