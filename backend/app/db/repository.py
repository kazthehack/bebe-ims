from __future__ import annotations

from dataclasses import asdict
from decimal import Decimal
from datetime import datetime
from threading import RLock
from typing import Any

from botocore.exceptions import BotoCoreError, ClientError
from boto3.dynamodb.types import TypeDeserializer, TypeSerializer

from app.core.config import get_settings
from app.db.dynamodb import get_dynamodb_client
from app.domain.object_record import ObjectRecord


class DynamoSingleTableRepository:
    def __init__(self) -> None:
        self._client = get_dynamodb_client()
        self._settings = get_settings()
        self._serializer = TypeSerializer()
        self._deserializer = TypeDeserializer()
        self._lock = RLock()
        self._fallback_objects: dict[tuple[str, str], dict[str, Any]] = {}

    def _to_dynamo_compatible(self, value: Any) -> Any:
        if isinstance(value, float):
            return Decimal(str(value))
        if isinstance(value, list):
            return [self._to_dynamo_compatible(item) for item in value]
        if isinstance(value, dict):
            return {key: self._to_dynamo_compatible(item) for key, item in value.items()}
        return value

    def _to_dynamo_item(self, item: dict[str, Any]) -> dict[str, dict[str, Any]]:
        return {
            key: self._serializer.serialize(self._to_dynamo_compatible(value))
            for key, value in item.items()
        }

    def _from_dynamo_item(self, item: dict[str, dict[str, Any]]) -> dict[str, Any]:
        return {key: self._deserializer.deserialize(value) for key, value in item.items()}

    def _from_fallback(self, item: dict[str, Any]) -> dict[str, Any]:
        data = item.copy()
        if isinstance(data.get("created_at"), str):
            data["created_at"] = datetime.fromisoformat(str(data["created_at"]))
        if isinstance(data.get("updated_at"), str):
            data["updated_at"] = datetime.fromisoformat(str(data["updated_at"]))
        return data

    def upsert_object(self, record: ObjectRecord) -> dict[str, Any]:
        item = asdict(record)
        item["pk"] = record.pk
        item["sk"] = record.sk
        item["gsi1pk"] = f"TYPE#{record.object_type.upper()}"
        item["gsi1sk"] = f"TENANT#{record.tenant_id}#UPDATED#{record.updated_at}#ID#{record.object_id}"
        key = (record.pk, record.sk)

        with self._lock:
            try:
                self._client.put_item(
                    TableName=self._settings.dynamodb_table_name,
                    Item=self._to_dynamo_item(item),
                )
            except (BotoCoreError, ClientError):
                self._fallback_objects[key] = item

            existing = self._fallback_objects.get(key, item)
            return self._from_fallback(existing)

    def get_object(self, tenant_id: str, object_type: str, object_id: str) -> dict[str, Any] | None:
        pk = f"TENANT#{tenant_id}"
        sk = f"{object_type.upper()}#{object_id}"
        key = (pk, sk)

        with self._lock:
            try:
                response = self._client.get_item(
                    TableName=self._settings.dynamodb_table_name,
                    Key=self._to_dynamo_item({"pk": pk, "sk": sk}),
                    ConsistentRead=True,
                )
                if "Item" in response and response["Item"]:
                    row = self._from_dynamo_item(response["Item"])
                    return self._from_fallback(row)
            except (BotoCoreError, ClientError):
                pass

            item = self._fallback_objects.get(key)
            if not item:
                return None
            return self._from_fallback(item)

    def list_objects(self, tenant_id: str, object_type: str) -> list[dict[str, Any]]:
        prefix = f"{object_type.upper()}#"
        pk = f"TENANT#{tenant_id}"
        out: list[dict[str, Any]] = []

        with self._lock:
            try:
                response = self._client.query(
                    TableName=self._settings.dynamodb_table_name,
                    KeyConditionExpression="pk = :pk AND begins_with(sk, :prefix)",
                    ExpressionAttributeValues=self._to_dynamo_item({
                        ":pk": pk,
                        ":prefix": prefix,
                    }),
                )
                for raw in response.get("Items", []):
                    out.append(self._from_fallback(self._from_dynamo_item(raw)))
            except (BotoCoreError, ClientError):
                pass

            for (item_pk, item_sk), item in self._fallback_objects.items():
                if item_pk == pk and item_sk.startswith(prefix):
                    out.append(self._from_fallback(item))

        out.sort(key=lambda x: x["updated_at"], reverse=True)
        return out

    def delete_object(self, tenant_id: str, object_type: str, object_id: str) -> bool:
        pk = f"TENANT#{tenant_id}"
        sk = f"{object_type.upper()}#{object_id}"
        key = (pk, sk)
        deleted = False

        with self._lock:
            try:
                self._client.delete_item(
                    TableName=self._settings.dynamodb_table_name,
                    Key=self._to_dynamo_item({"pk": pk, "sk": sk}),
                )
                deleted = True
            except (BotoCoreError, ClientError):
                pass

            if key in self._fallback_objects:
                self._fallback_objects.pop(key, None)
                deleted = True

        return deleted

class ObjectRepository:
    """Object-oriented repository facade over the Dynamo single-table adapter."""

    def __init__(self, adapter: DynamoSingleTableRepository | None = None) -> None:
        self._adapter = adapter or DynamoSingleTableRepository()

    def upsert_object(self, object_record: ObjectRecord) -> dict[str, Any]:
        return self._adapter.upsert_object(object_record)

    def get_object(self, tenant_id: str, object_type: str, object_id: str) -> dict[str, Any] | None:
        return self._adapter.get_object(tenant_id, object_type, object_id)

    def list_objects(self, tenant_id: str, object_type: str) -> list[dict[str, Any]]:
        return self._adapter.list_objects(tenant_id, object_type)

    def delete_object(self, tenant_id: str, object_type: str, object_id: str) -> bool:
        return self._adapter.delete_object(tenant_id, object_type, object_id)
