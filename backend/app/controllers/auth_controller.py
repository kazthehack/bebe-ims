from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import HTTPException

from app.core.config import Settings
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord


class AuthController:
    def __init__(self, settings: Settings, repository: ObjectRepository | None = None) -> None:
        self.settings = settings
        self.repository = repository or ObjectRepository()

    def _utc_now(self) -> datetime:
        return datetime.now(timezone.utc)

    def _expires_in_hours(self, hours: int) -> str:
        return (self._utc_now() + timedelta(hours=hours)).isoformat()

    def _is_expired(self, iso_timestamp: str | None) -> bool:
        if not iso_timestamp:
            return True
        try:
            return datetime.fromisoformat(iso_timestamp) <= self._utc_now()
        except ValueError:
            return True

    def _validate_local_credentials(self, username: str, password: str) -> str:
        normalized = username.strip().lower()
        valid_user = normalized in self.settings.local_auth_user_list
        valid_password = password == self.settings.local_auth_password
        if not (valid_user and valid_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        return normalized

    def _list_auth_records(self, tenant_id: str) -> list[dict]:
        return self.repository.list_objects(tenant_id, "auth")

    def _upsert_auth_payload(self, tenant_id: str, payload: dict, object_id: str | None = None) -> dict:
        now = self._utc_now().isoformat()
        object_id = object_id or str(uuid4())
        existing = self.repository.get_object(tenant_id, "auth", object_id) if object_id else None
        created_at = existing["created_at"].isoformat() if existing else now
        record = ObjectRecord(
            object_type="auth",
            tenant_id=tenant_id,
            object_id=object_id,
            payload=payload,
            created_at=created_at,
            updated_at=now,
        )
        return self.repository.upsert_object(record)

    def _create_refresh_token(self, tenant_id: str, username: str) -> dict:
        refresh_token = f"refresh-{uuid4()}"
        default_store_id = self._default_store_id(username)
        payload = {
            "kind": "refresh_token",
            "token": refresh_token,
            "username": username,
            "tenant_id": tenant_id,
            "store_id": default_store_id,
            "expires": self._expires_in_hours(24),
            "active": True,
        }
        return self._upsert_auth_payload(tenant_id, payload)

    def _create_access_token(self, tenant_id: str, username: str, refresh_record: dict) -> dict:
        access_token = f"access-{uuid4()}"
        default_store_id = self._default_store_id(username)
        payload = {
            "kind": "access_token",
            "token": access_token,
            "username": username,
            "tenant_id": tenant_id,
            "store_id": default_store_id,
            "refresh_object_id": refresh_record["object_id"],
            "expires": self._expires_in_hours(12),
            "active": True,
        }
        return self._upsert_auth_payload(tenant_id, payload)

    def _owner_id(self, username: str) -> str:
        return f"user-{username}"

    def _canonical_tenant_id(self, username: str) -> str:
        return f"tenant-{username}"

    def _default_store_id(self, username: str) -> str:
        return f"store-{username}"

    def _ensure_default_store(self, tenant_id: str, username: str) -> str:
        store_id = self._default_store_id(username)
        existing = self.repository.get_object(tenant_id, "store", store_id)
        if existing:
            return store_id

        now = self._utc_now().isoformat()
        payload = {
            "id": store_id,
            "name": f"{username.title()} Store",
            "owner": {
                "id": self._owner_id(username),
                "username": username,
            },
            "settings": {
                "timezone": "America/Los_Angeles",
                "enableNewDashboard": False,
                "allowDashboardSelection": False,
            },
        }
        record = ObjectRecord(
            object_type="store",
            tenant_id=tenant_id,
            object_id=store_id,
            payload=payload,
            created_at=now,
            updated_at=now,
        )
        self.repository.upsert_object(record)
        return store_id

    def login(self, _tenant_id: str, username: str, password: str) -> dict:
        normalized_user = self._validate_local_credentials(username, password)
        tenant_id = self._canonical_tenant_id(normalized_user)
        store_id = self._ensure_default_store(tenant_id, normalized_user)
        refresh_record = self._create_refresh_token(tenant_id, normalized_user)
        access_record = self._create_access_token(tenant_id, normalized_user, refresh_record)
        return {
            "access_token": access_record["payload"]["token"],
            "refresh_token": refresh_record["payload"]["token"],
            "expires": access_record["payload"]["expires"],
            "tenant_id": tenant_id,
            "store_id": store_id,
            "owner_id": self._owner_id(normalized_user),
            "username": normalized_user,
        }

    def refresh(self, tenant_id: str, refresh_token: str) -> dict:
        records = self._list_auth_records(tenant_id)
        refresh_record = next(
            (
                record
                for record in records
                if record["payload"].get("kind") == "refresh_token"
                and record["payload"].get("token") == refresh_token
            ),
            None,
        )
        if not refresh_record:
            raise HTTPException(status_code=401, detail="Token not found")
        if self._is_expired(refresh_record["payload"].get("expires")):
            raise HTTPException(status_code=401, detail="Token is expired")

        username = refresh_record["payload"].get("username", "")
        access_record = self._create_access_token(tenant_id, username, refresh_record)
        return {
            "access_token": access_record["payload"]["token"],
            "refresh_token": refresh_token,
            "expires": access_record["payload"]["expires"],
            "tenant_id": tenant_id,
            "store_id": refresh_record["payload"].get("store_id", self._default_store_id(username)),
            "owner_id": self._owner_id(username),
            "username": username,
        }

    def logout(self, tenant_id: str, access_token: str) -> dict:
        records = self._list_auth_records(tenant_id)
        access_record = next(
            (
                record
                for record in records
                if record["payload"].get("kind") == "access_token"
                and record["payload"].get("token") == access_token
            ),
            None,
        )
        if not access_record:
            raise HTTPException(status_code=401, detail="Token not found")

        now_iso = self._utc_now().isoformat()
        access_payload = {**access_record["payload"], "active": False, "expires": now_iso}
        self._upsert_auth_payload(tenant_id, access_payload, object_id=access_record["object_id"])

        refresh_id = access_record["payload"].get("refresh_object_id")
        if refresh_id:
            refresh_record = self.repository.get_object(tenant_id, "auth", refresh_id)
            if refresh_record:
                refresh_payload = {**refresh_record["payload"], "active": False, "expires": now_iso}
                self._upsert_auth_payload(tenant_id, refresh_payload, object_id=refresh_id)

        return {"success": True}

    def verify_password_token(self, tenant_id: str, _token: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}

    def reset_password(self, tenant_id: str, _token: str, _new_password: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}

    def send_reset_password_email(self, tenant_id: str, _email: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}
