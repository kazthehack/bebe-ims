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
from botocore.config import Config
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


def log(message: str) -> None:
    print(f"[port] {message}", flush=True)


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
        config=Config(connect_timeout=5, read_timeout=10, retries={"max_attempts": 1}),
    )


def local_access_key_candidates(
    repo_root: Path,
    region: str,
    explicit_access_key_id: str,
    cloud_access_key_id: str | None,
) -> list[str]:
    candidates = [
        explicit_access_key_id,
        os.getenv("AWS_ACCESS_KEY_ID", ""),
        cloud_access_key_id or "",
        "local",
    ]
    db_dir = repo_root / "dynamodb_local_latest"
    for db_file in sorted(db_dir.glob(f"*_{region}.db")):
        candidates.append(db_file.name[: -len(f"_{region}.db")])

    seen: set[str] = set()
    return [
        candidate
        for candidate in candidates
        if candidate and not (candidate in seen or seen.add(candidate))
    ]


def list_table_names(client: Any) -> list[str]:
    names: list[str] = []
    kwargs: dict[str, Any] = {}
    while True:
        response = client.list_tables(**kwargs)
        names.extend(response.get("TableNames", []))
        last_name = response.get("LastEvaluatedTableName")
        if not last_name:
            return names
        kwargs["ExclusiveStartTableName"] = last_name


def resolve_local_client(
    repo_root: Path,
    endpoint_url: str,
    region: str,
    table_name: str,
    explicit_access_key_id: str,
    cloud_access_key_id: str | None,
    secret_access_key: str,
) -> tuple[Any, str, list[str]]:
    last_error: Exception | None = None
    checked: list[str] = []
    for access_key_id in local_access_key_candidates(
        repo_root,
        region,
        explicit_access_key_id,
        cloud_access_key_id,
    ):
        client = local_dynamodb_client(
            endpoint_url,
            region,
            access_key_id,
            secret_access_key,
        )
        try:
            table_names = list_table_names(client)
        except Exception as exc:
            last_error = exc
            continue
        checked.append(f"{access_key_id}: {', '.join(table_names) or '(no tables)'}")
        if table_name in table_names:
            return client, access_key_id, checked

    if last_error and not checked:
        raise SystemExit(
            f"Could not connect to local DynamoDB at {endpoint_url}. "
            "Start it with `make run-dynamodb-local` from the repository root, "
            "then retry `make migrate prod`."
        ) from last_error

    raise SystemExit(
        f"Local DynamoDB table {table_name!r} was not found at {endpoint_url}.\n"
        "Checked local credential namespaces:\n"
        + "\n".join(f"  - {entry}" for entry in checked)
        + "\nStart the populated local DynamoDB database or pass "
        "--local-access-key-id with the namespace that owns the table."
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


def object_type_counts(
    raw_items: list[dict[str, Any]], deserializer: TypeDeserializer
) -> dict[str, int]:
    counts: dict[str, int] = {}
    for item in raw_items:
        object_type = decoded_object_type(item, deserializer) or "(unknown)"
        counts[object_type] = counts.get(object_type, 0) + 1
    return dict(sorted(counts.items()))


def log_object_type_counts(
    label: str,
    raw_items: list[dict[str, Any]],
    deserializer: TypeDeserializer,
) -> None:
    counts = object_type_counts(raw_items, deserializer)
    if not counts:
        log(f"{label}: no records")
        return
    summary = ", ".join(f"{object_type}={count}" for object_type, count in counts.items())
    log(f"{label}: {summary}")


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
    parser.add_argument(
        "--progress-every",
        type=int,
        default=100,
        help="Print write/delete progress every N records. Use 0 to disable.",
    )
    args = parser.parse_args()

    log("starting local-to-cloud DynamoDB migration")
    if args.full_clone:
        args.all_tenants = True
        args.all_object_types = True
        args.overwrite = True
        args.prune_destination = True
        log("mode: full clone (all tenants, all object types, overwrite, prune)")
    else:
        scope = "all tenants" if args.all_tenants else f"tenant={args.tenant_id}"
        type_scope = "all object types" if args.all_object_types else args.object_types
        log(f"mode: selective copy ({scope}; object_types={type_scope})")

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
    rollback_path = Path(args.rollback_file).expanduser()

    log(f"local config: {Path(args.local_config).expanduser()}")
    log(f"cloud config: {Path(args.cloud_config).expanduser()}")
    log(f"source table: {args.local_table} at {local_endpoint}")
    log(f"destination table: {cloud_table} in {cloud_region}")
    log(f"rollback file: {rollback_path}")

    log("resolving local DynamoDB credential namespace")
    local_client, local_access_key_id, checked_local_namespaces = resolve_local_client(
        repo_root,
        local_endpoint,
        cloud_region,
        args.local_table,
        args.local_access_key_id,
        cloud_config.get("AWS_ACCESS_KEY_ID"),
        args.local_secret_access_key,
    )
    log(f"source local access key namespace: {local_access_key_id}")
    if len(checked_local_namespaces) > 1:
        log("checked local namespaces before source match:")
        for namespace in checked_local_namespaces:
            log(f"  {namespace}")

    log("creating cloud DynamoDB client")
    cloud_client = dynamodb_client_from_config(cloud_config)
    deserializer = TypeDeserializer()
    selected_types = {
        value.strip().lower() for value in args.object_types.split(",") if value.strip()
    }

    try:
        scan_scope = "all tenants" if args.all_tenants else f"tenant={args.tenant_id}"
        log(f"scanning source records ({scan_scope})")
        source_items = scan_items(
            local_client,
            args.local_table,
            None if args.all_tenants else args.tenant_id,
        )
    except EndpointConnectionError as exc:
        raise SystemExit(
            f"Could not connect to local DynamoDB at {local_endpoint}. "
            "Start it with `make run-dynamodb-local` from the repository root, "
            "then retry `make migrate prod`."
        ) from exc
    log(f"source scan complete: {len(source_items)} records")
    log_object_type_counts("source object types", source_items, deserializer)

    filtered_items = [
        item
        for item in source_items
        if args.all_object_types
        or decoded_object_type(item, deserializer) in selected_types
    ]
    log(f"selected source records: {len(filtered_items)}")
    if not args.all_object_types:
        log_object_type_counts("selected source object types", filtered_items, deserializer)

    destination_items: list[dict[str, Any]] = []
    destination_by_key: dict[str, dict[str, Any]] = {}
    source_by_key = {key_id(item_key(item)): item for item in filtered_items}
    destination_only_keys: list[dict[str, Any]] = []

    if args.prune_destination:
        log("scanning destination records for prune comparison")
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
        log(f"destination scan complete: {len(destination_items)} records")
        log_object_type_counts(
            "destination object types in scope",
            list(destination_by_key.values()),
            deserializer,
        )
        log(f"destination-only records to delete: {len(destination_only_keys)}")

    log(
        f"summary before write: scanned={len(source_items)} selected={len(filtered_items)} "
        f"overwrite={args.overwrite} prune={args.prune_destination}"
    )
    if args.dry_run:
        log("dry run only; no cloud writes performed")
        return

    rollback_items: dict[str, dict[str, Any] | None] = {}
    written_keys: list[dict[str, Any]] = []
    deleted_keys: list[dict[str, Any]] = []
    written = 0
    skipped_existing = 0
    deleted = 0

    try:
        log("writing selected source records to destination")
        for index, item in enumerate(filtered_items, start=1):
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
            if args.progress_every > 0 and index % args.progress_every == 0:
                log(
                    f"write progress: processed={index}/{len(filtered_items)} "
                    f"written={written} skipped_existing={skipped_existing}"
                )

        log(
            f"write phase complete: written={written}, "
            f"skipped_existing={skipped_existing}"
        )

        if destination_only_keys:
            log("deleting destination-only records")
        for index, key in enumerate(destination_only_keys, start=1):
            identifier = key_id(key)
            if identifier not in rollback_items:
                rollback_items[identifier] = destination_by_key.get(identifier)
            delete_item(cloud_client, cloud_table, key)
            deleted += 1
            deleted_keys.append(key)
            if args.progress_every > 0 and index % args.progress_every == 0:
                log(
                    f"delete progress: processed={index}/{len(destination_only_keys)} "
                    f"deleted={deleted}"
                )

        log(f"delete phase complete: deleted={deleted}")

        log("writing rollback metadata")
        write_json(
            rollback_path,
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
            print("[port] failure detected; rolling back cloud writes", file=sys.stderr, flush=True)
            rollback_written_items(
                cloud_client,
                cloud_table,
                rollback_items,
                written_keys,
                deleted_keys,
            )
            log("rollback complete")
        raise

    log(
        f"complete: written={written}, skipped_existing={skipped_existing}, "
        f"deleted={deleted}"
    )
    log(f"rollback metadata: {rollback_path}")


if __name__ == "__main__":
    main()
