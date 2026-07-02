from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import UTC, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any

import boto3
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import ClientError, EndpointConnectionError

DEFAULT_INVENTORY_OBJECT_TYPES = {
    "event",
    "inventory_adjustment",
    "inventory_report",
    "part",
    "product",
    "product_line",
    "product_recipe_part",
    "product_stock",
    "product_variant",
    "site",
    "strain",
    "supply",
    "supply_brand",
}


def load_env_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values


def to_json_compatible(value: Any) -> Any:
    if isinstance(value, Decimal):
        if value == value.to_integral_value():
            return int(value)
        return float(value)
    if isinstance(value, list):
        return [to_json_compatible(item) for item in value]
    if isinstance(value, dict):
        return {key: to_json_compatible(item) for key, item in value.items()}
    return value


def dynamodb_client_from_config(config: dict[str, str]) -> Any:
    region = (
        config.get("AWS_REGION")
        or config.get("BEBE_IMS_AWS_REGION")
        or "ap-southeast-1"
    )
    params: dict[str, Any] = {"region_name": region}
    access_key = config.get("AWS_ACCESS_KEY_ID") or config.get(
        "BEBE_IMS_AWS_ACCESS_KEY_ID"
    )
    secret_key = config.get("AWS_SECRET_ACCESS_KEY") or config.get(
        "BEBE_IMS_AWS_SECRET_ACCESS_KEY"
    )
    session_token = config.get("AWS_SESSION_TOKEN") or config.get(
        "BEBE_IMS_AWS_SESSION_TOKEN"
    )
    if access_key and secret_key:
        params["aws_access_key_id"] = access_key
        params["aws_secret_access_key"] = secret_key
    if session_token:
        params["aws_session_token"] = session_token
    if not access_key or not secret_key:
        profile = config.get("AWS_PROFILE", "").strip()
        if profile:
            session = boto3.Session(profile_name=profile, region_name=region)
            return session.client("dynamodb")
    return boto3.client("dynamodb", **params)


def local_dynamodb_client(
    endpoint_url: str,
    region: str,
    access_key_id: str | None,
    secret_access_key: str | None,
) -> Any:
    return boto3.client(
        "dynamodb",
        region_name=region,
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key_id or os.getenv("AWS_ACCESS_KEY_ID", "local"),
        aws_secret_access_key=secret_access_key
        or os.getenv("AWS_SECRET_ACCESS_KEY", "local"),
    )


def scan_items(
    client: Any, table_name: str, tenant_id: str | None
) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    if tenant_id:
        kwargs: dict[str, Any] = {
            "TableName": table_name,
            "KeyConditionExpression": "pk = :pk",
            "ExpressionAttributeValues": {
                ":pk": {"S": f"TENANT#{tenant_id}"},
            },
        }
        while True:
            response = client.query(**kwargs)
            items.extend(response.get("Items", []))
            last_key = response.get("LastEvaluatedKey")
            if not last_key:
                break
            kwargs["ExclusiveStartKey"] = last_key
        return items

    kwargs = {"TableName": table_name}
    while True:
        response = client.scan(**kwargs)
        items.extend(response.get("Items", []))
        last_key = response.get("LastEvaluatedKey")
        if not last_key:
            break
        kwargs["ExclusiveStartKey"] = last_key
    return items


def item_key(raw_item: dict[str, Any]) -> dict[str, Any]:
    return {"pk": raw_item["pk"], "sk": raw_item["sk"]}


def key_id(key: dict[str, Any]) -> str:
    return f"{key['pk']['S']}|{key['sk']['S']}"


def decoded_object_type(
    raw_item: dict[str, Any], deserializer: TypeDeserializer
) -> str:
    raw_type = raw_item.get("object_type")
    if raw_type:
        return str(deserializer.deserialize(raw_type)).lower()
    raw_sk = raw_item.get("sk")
    if raw_sk:
        return str(deserializer.deserialize(raw_sk)).split("#", 1)[0].lower()
    return ""


def get_existing_item(
    client: Any, table_name: str, key: dict[str, Any]
) -> dict[str, Any] | None:
    response = client.get_item(TableName=table_name, Key=key, ConsistentRead=True)
    item = response.get("Item")
    return item if isinstance(item, dict) else None


def write_item(
    client: Any, table_name: str, item: dict[str, Any], overwrite: bool
) -> str:
    kwargs: dict[str, Any] = {"TableName": table_name, "Item": item}
    if not overwrite:
        kwargs["ConditionExpression"] = (
            "attribute_not_exists(pk) AND attribute_not_exists(sk)"
        )
    try:
        client.put_item(**kwargs)
        return "written"
    except ClientError as exc:
        if (
            exc.response.get("Error", {}).get("Code")
            == "ConditionalCheckFailedException"
        ):
            return "skipped_existing"
        raise


def delete_item(client: Any, table_name: str, key: dict[str, Any]) -> None:
    client.delete_item(TableName=table_name, Key=key)


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(to_json_compatible(payload), indent=2), encoding="utf-8")


def rollback_written_items(
    client: Any,
    table_name: str,
    rollback_items: dict[str, dict[str, Any] | None],
    written_keys: list[dict[str, Any]],
    deleted_keys: list[dict[str, Any]] | None = None,
) -> None:
    for key in reversed(deleted_keys or []):
        previous = rollback_items.get(key_id(key))
        if previous:
            client.put_item(TableName=table_name, Item=previous)
    for key in reversed(written_keys):
        previous = rollback_items.get(key_id(key))
        if previous:
            client.put_item(TableName=table_name, Item=previous)
        else:
            client.delete_item(TableName=table_name, Key=key)


def endpoint_from_local_config(path: Path) -> str:
    if not path.exists():
        return "http://localhost:8000"
    data = json.loads(path.read_text(encoding="utf-8"))
    port = int(data.get("Port") or 8000)
    host = str(data.get("host") or "localhost")
    scheme = str(data.get("scheme") or "http")
    return f"{scheme}://{host}:{port}"


def main() -> None:
    repo_root = Path(__file__).resolve().parents[2]
    default_cloud_config = repo_root / "infra" / "cdk" / "deploy.env"
    default_local_config = repo_root / "backend" / "config" / "dynamodb.local.json"
    default_rollback_file = (
        repo_root
        / "backend"
        / "backups"
        / (
            f"cloud_port_inventory_rollback_{datetime.now(UTC).strftime('%Y%m%d_%H%M%S')}.json"
        )
    )

    parser = argparse.ArgumentParser(
        description="Port or clone local DynamoDB records to AWS DynamoDB."
    )
    parser.add_argument(
        "--tenant-id",
        default="tenant-admin",
        help="Tenant to copy. Ignored with --all-tenants.",
    )
    parser.add_argument(
        "--all-tenants",
        action="store_true",
        help="Copy all tenants with a full source table scan.",
    )
    parser.add_argument(
        "--local-table", default="bebe_ims", help="Local DynamoDB table name."
    )
    parser.add_argument(
        "--local-endpoint", default="", help="Local DynamoDB endpoint URL."
    )
    parser.add_argument(
        "--local-access-key-id",
        default="",
        help="Access key namespace used by DynamoDB Local when -sharedDb is off.",
    )
    parser.add_argument(
        "--local-secret-access-key",
        default="local",
        help="Secret key for DynamoDB Local. The value only selects local credentials.",
    )
    parser.add_argument(
        "--local-config",
        default=str(default_local_config),
        help="Local DynamoDB JSON config path.",
    )
    parser.add_argument(
        "--cloud-config",
        default=str(default_cloud_config),
        help="Cloud deploy.env config path.",
    )
    parser.add_argument(
        "--cloud-table",
        default="",
        help="Cloud DynamoDB table name. Defaults to TABLE_NAME.",
    )
    parser.add_argument(
        "--cloud-region", default="", help="Cloud AWS region. Defaults to AWS_REGION."
    )
    parser.add_argument(
        "--object-types",
        default=",".join(sorted(DEFAULT_INVENTORY_OBJECT_TYPES)),
        help="Comma-separated object types to copy.",
    )
    parser.add_argument(
        "--all-object-types",
        action="store_true",
        help="Copy every object type, including auth/session data.",
    )
    parser.add_argument(
        "--full-clone",
        action="store_true",
        help=(
            "Clone the selected local scope to cloud exactly: all tenants, all object "
            "types, overwrite matching records, and prune cloud-only records."
        ),
    )
    parser.add_argument(
        "--prune-destination",
        action="store_true",
        help="Delete cloud records in scope that are not present in local source.",
    )
    parser.add_argument(
        "--overwrite", action="store_true", help="Overwrite matching cloud items."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Report what would be copied without writing.",
    )
    parser.add_argument(
        "--rollback-file",
        default=str(default_rollback_file),
        help="Rollback metadata output path.",
    )
    parser.add_argument(
        "--no-rollback-on-failure",
        action="store_true",
        help="Leave partial writes if the port fails.",
    )
    parser.add_argument(
        "--confirm-prod-clone",
        default="",
        help="Required value for full clone writes: clone-local-to-prod.",
    )
    args = parser.parse_args()

    if args.full_clone:
        args.all_tenants = True
        args.all_object_types = True
        args.overwrite = True
        args.prune_destination = True

    if (
        args.full_clone
        and not args.dry_run
        and args.confirm_prod_clone != "clone-local-to-prod"
    ):
        raise SystemExit(
            "Refusing full production clone without "
            "--confirm-prod-clone clone-local-to-prod"
        )

    cloud_config = load_env_file(Path(args.cloud_config).expanduser())
    if args.cloud_region:
        cloud_config["AWS_REGION"] = args.cloud_region
    cloud_region = cloud_config.get("AWS_REGION", "ap-southeast-1")
    cloud_table = args.cloud_table or cloud_config.get("TABLE_NAME") or "bebe_ims"
    local_endpoint = args.local_endpoint or endpoint_from_local_config(
        Path(args.local_config).expanduser()
    )

    local_client = local_dynamodb_client(
        local_endpoint,
        cloud_region,
        args.local_access_key_id or cloud_config.get("AWS_ACCESS_KEY_ID"),
        args.local_secret_access_key,
    )
    cloud_client = dynamodb_client_from_config(cloud_config)
    deserializer = TypeDeserializer()
    selected_types = {
        value.strip().lower() for value in args.object_types.split(",") if value.strip()
    }

    try:
        source_items = scan_items(
            local_client,
            args.local_table,
            None if args.all_tenants else args.tenant_id,
        )
    except EndpointConnectionError as exc:
        raise SystemExit(
            f"Could not connect to local DynamoDB at {local_endpoint}. "
            "Start it with `make run-dynamodb-local` from the repository root, "
            "then retry `make port-inventory-cloud`."
        ) from exc
    filtered_items = [
        item
        for item in source_items
        if args.all_object_types
        or decoded_object_type(item, deserializer) in selected_types
    ]
    destination_items: list[dict[str, Any]] = []
    destination_by_key: dict[str, dict[str, Any]] = {}
    source_by_key = {key_id(item_key(item)): item for item in filtered_items}
    destination_only_keys: list[dict[str, Any]] = []

    if args.prune_destination:
        destination_items = scan_items(
            cloud_client,
            cloud_table,
            None if args.all_tenants else args.tenant_id,
        )
        destination_by_key = {
            key_id(item_key(item)): item
            for item in destination_items
            if args.all_object_types
            or decoded_object_type(item, deserializer) in selected_types
        }
        destination_only_keys = [
            item_key(item)
            for identifier, item in destination_by_key.items()
            if identifier not in source_by_key
        ]

    print(f"[port] source: {args.local_table} at {local_endpoint}")
    print(f"[port] destination: {cloud_table} in {cloud_region}")
    print(
        f"[port] scanned={len(source_items)} selected={len(filtered_items)} "
        f"overwrite={args.overwrite} prune={args.prune_destination}"
    )
    if args.prune_destination:
        print(
            f"[port] destination scanned={len(destination_items)} "
            f"destination_only={len(destination_only_keys)}"
        )
    if args.dry_run:
        print("[port] dry run only; no cloud writes performed")
        return

    rollback_items: dict[str, dict[str, Any] | None] = {}
    written_keys: list[dict[str, Any]] = []
    deleted_keys: list[dict[str, Any]] = []
    written = 0
    skipped_existing = 0
    deleted = 0

    try:
        for item in filtered_items:
            key = item_key(item)
            identifier = key_id(key)
            if identifier not in rollback_items:
                rollback_items[identifier] = get_existing_item(
                    cloud_client, cloud_table, key
                )
            result = write_item(cloud_client, cloud_table, item, args.overwrite)
            if result == "written":
                written += 1
                written_keys.append(key)
            elif result == "skipped_existing":
                skipped_existing += 1

        for key in destination_only_keys:
            identifier = key_id(key)
            if identifier not in rollback_items:
                rollback_items[identifier] = destination_by_key.get(identifier)
            delete_item(cloud_client, cloud_table, key)
            deleted += 1
            deleted_keys.append(key)

        write_json(
            Path(args.rollback_file).expanduser(),
            {
                "created_at": datetime.now(UTC).isoformat(),
                "cloud_table": cloud_table,
                "cloud_region": cloud_region,
                "source_table": args.local_table,
                "source_endpoint": local_endpoint,
                "full_clone": args.full_clone,
                "overwrite": args.overwrite,
                "prune_destination": args.prune_destination,
                "written_count": written,
                "skipped_existing_count": skipped_existing,
                "deleted_count": deleted,
                "previous_items_by_key": rollback_items,
                "written_keys": written_keys,
                "deleted_keys": deleted_keys,
            },
        )
    except Exception:
        if not args.no_rollback_on_failure and (written_keys or deleted_keys):
            print("[port] failure detected; rolling back cloud writes", file=sys.stderr)
            rollback_written_items(
                cloud_client,
                cloud_table,
                rollback_items,
                written_keys,
                deleted_keys,
            )
        raise

    print(
        f"[port] complete: written={written}, skipped_existing={skipped_existing}, "
        f"deleted={deleted}"
    )
    print(f"[port] rollback metadata: {Path(args.rollback_file).expanduser()}")


if __name__ == "__main__":
    main()
