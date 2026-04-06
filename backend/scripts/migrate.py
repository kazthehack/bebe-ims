from __future__ import annotations

from datetime import datetime, timezone

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

    for event_id, title, start_date, end_date, status in DEFAULT_EVENTS:
        created = create_object_if_missing(
            repository,
            tenant_id=tenant_id,
            object_type="event",
            object_id=event_id,
            payload={
                "title": title,
                "start_date": start_date,
                "end_date": end_date,
                "status": status,
            },
        )
        if created:
            print(f"[migrate] seeded event: {event_id} ({title})")
        else:
            print(f"[migrate] skip existing event: {event_id}")


def main() -> None:
    ensure_table_exists()
    seed_default_accounts()
    seed_default_events()
    print("[migrate] done")


if __name__ == "__main__":
    main()
