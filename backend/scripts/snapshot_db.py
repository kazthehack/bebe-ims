from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from typing import Any

from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

from app.core.config import get_settings
from app.db.dynamodb import get_dynamodb_client


def _to_json_compatible(value: Any) -> Any:
    if isinstance(value, Decimal):
        if value == value.to_integral_value():
            return int(value)
        return float(value)
    if isinstance(value, list):
        return [_to_json_compatible(item) for item in value]
    if isinstance(value, dict):
        return {key: _to_json_compatible(item) for key, item in value.items()}
    return value


def _to_dynamo_compatible(value: Any) -> Any:
    if isinstance(value, float):
        return Decimal(str(value))
    if isinstance(value, list):
        return [_to_dynamo_compatible(item) for item in value]
    if isinstance(value, dict):
        return {key: _to_dynamo_compatible(item) for key, item in value.items()}
    return value


def _deserialize_item(raw_item: dict[str, Any], deserializer: TypeDeserializer) -> dict[str, Any]:
    return {key: deserializer.deserialize(value) for key, value in raw_item.items()}


def _serialize_item(item: dict[str, Any], serializer: TypeSerializer) -> dict[str, Any]:
    return {key: serializer.serialize(_to_dynamo_compatible(value)) for key, value in item.items()}


def _default_snapshot_path() -> Path:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return Path(__file__).resolve().parents[1] / "backups" / f"db_snapshot_{timestamp}.json"


def create_snapshot(output_path: Path, tenant_id: str | None, all_tenants: bool) -> None:
    settings = get_settings()
    client = get_dynamodb_client()
    deserializer = TypeDeserializer()
    items: list[dict[str, Any]] = []

    if all_tenants:
        scan_kwargs: dict[str, Any] = {"TableName": settings.dynamodb_table_name}
        while True:
            response = client.scan(**scan_kwargs)
            for raw in response.get("Items", []):
                items.append(_deserialize_item(raw, deserializer))
            last_evaluated_key = response.get("LastEvaluatedKey")
            if not last_evaluated_key:
                break
            scan_kwargs["ExclusiveStartKey"] = last_evaluated_key
    else:
        effective_tenant = tenant_id or "tenant-admin"
        pk_value = f"TENANT#{effective_tenant}"
        query_kwargs: dict[str, Any] = {
            "TableName": settings.dynamodb_table_name,
            "KeyConditionExpression": "pk = :pk",
            "ExpressionAttributeValues": {
                ":pk": {"S": pk_value},
            },
        }
        while True:
            response = client.query(**query_kwargs)
            for raw in response.get("Items", []):
                items.append(_deserialize_item(raw, deserializer))
            last_evaluated_key = response.get("LastEvaluatedKey")
            if not last_evaluated_key:
                break
            query_kwargs["ExclusiveStartKey"] = last_evaluated_key

    payload = {
        "version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "table_name": settings.dynamodb_table_name,
        "endpoint_url": settings.dynamodb_effective_endpoint_url,
        "scope": {
            "all_tenants": all_tenants,
            "tenant_id": None if all_tenants else (tenant_id or "tenant-admin"),
        },
        "item_count": len(items),
        "items": [_to_json_compatible(item) for item in items],
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"[snapshot] wrote {len(items)} items to {output_path}")


def restore_snapshot(snapshot_path: Path) -> None:
    if not snapshot_path.exists():
        raise FileNotFoundError(f"Snapshot file not found: {snapshot_path}")

    settings = get_settings()
    client = get_dynamodb_client()
    serializer = TypeSerializer()

    raw = json.loads(snapshot_path.read_text(encoding="utf-8"))
    items = raw.get("items", [])
    if not isinstance(items, list):
        raise ValueError("Invalid snapshot format: 'items' must be a list.")

    restored = 0
    for item in items:
        if not isinstance(item, dict):
            continue
        if "pk" not in item or "sk" not in item:
            continue
        client.put_item(
            TableName=settings.dynamodb_table_name,
            Item=_serialize_item(item, serializer),
        )
        restored += 1

    print(f"[snapshot] restored {restored} items from {snapshot_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Snapshot or restore DynamoDB table data.")
    parser.add_argument(
        "--mode",
        choices=("snapshot", "restore"),
        default="snapshot",
        help="Operation mode.",
    )
    parser.add_argument(
        "--tenant-id",
        default="tenant-admin",
        help="Tenant id to snapshot when not using --all-tenants.",
    )
    parser.add_argument(
        "--all-tenants",
        action="store_true",
        help="Snapshot all tenants using a full table scan.",
    )
    parser.add_argument(
        "--output",
        default="",
        help="Output JSON file path for snapshot mode.",
    )
    parser.add_argument(
        "--input",
        default="",
        help="Input JSON file path for restore mode.",
    )
    args = parser.parse_args()

    if args.mode == "snapshot":
        output_path = Path(args.output).expanduser() if args.output else _default_snapshot_path()
        create_snapshot(
            output_path=output_path,
            tenant_id=args.tenant_id,
            all_tenants=bool(args.all_tenants),
        )
        return

    if not args.input.strip():
        raise ValueError("--input is required for --mode restore")
    restore_snapshot(Path(args.input).expanduser())


if __name__ == "__main__":
    main()
