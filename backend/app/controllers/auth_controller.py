from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi import HTTPException

from app.core.auth import hash_password, verify_password
from app.core.config import Settings
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord
from app.domain.permissions import permissions_for_role


class AuthController:
    def __init__(self, settings: Settings, repository: ObjectRepository | None = None) -> None:
        self.settings = settings
        self.repository = repository or ObjectRepository()

    def _utc_now(self) -> datetime:
        return datetime.now(UTC)

    def _expires_in_hours(self, hours: int) -> str:
        return (self._utc_now() + timedelta(hours=hours)).isoformat()

    def _is_expired(self, iso_timestamp: str | None) -> bool:
        if not iso_timestamp:
            return True
        try:
            return datetime.fromisoformat(iso_timestamp) <= self._utc_now()
        except ValueError:
            return True

    def _normalize_username(self, username: str) -> str:
        return str(username or "").strip().lower()

    def _find_user_record(self, tenant_id: str, username: str) -> dict | None:
        normalized = self._normalize_username(username)
        expected_id = self._owner_id(normalized)
        direct = self.repository.get_object(tenant_id, "users", expected_id)
        if direct and self._normalize_username(direct.get("payload", {}).get("username") or direct.get("payload", {}).get("short_name")) == normalized:
            return direct
        for record in self.repository.list_objects(tenant_id, "users"):
            payload = record.get("payload", {})
            candidate = payload.get("username") or payload.get("short_name") or payload.get("email")
            if self._normalize_username(candidate) == normalized:
                return record
        return None

    def _validate_user_credentials(self, tenant_id: str, username: str, password: str) -> dict:
        user_record = self._find_user_record(tenant_id, username)
        if not user_record:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        payload = user_record.get("payload", {})
        if payload.get("active") is False or payload.get("global_active") is False:
            raise HTTPException(status_code=403, detail="User is inactive")

        password_hash = payload.get("password_hash")
        legacy_password = payload.get("password")
        valid_hash = verify_password(password, password_hash)
        valid_legacy = bool(legacy_password) and password == legacy_password
        if not (valid_hash or valid_legacy):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if valid_legacy:
            self._update_user_payload(
                tenant_id,
                user_record["object_id"],
                {
                    **payload,
                    "password_hash": hash_password(password),
                    "password": None,
                    "password_changed_at": self._utc_now().isoformat(),
                },
                created_at=user_record.get("created_at"),
            )
            user_record = self.repository.get_object(tenant_id, "users", user_record["object_id"]) or user_record

        return user_record

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

    def _auth_claims(self, tenant_id: str, user_record: dict) -> dict:
        payload = user_record.get("payload", {})
        username = self._normalize_username(payload.get("username") or payload.get("short_name"))
        user_id = user_record.get("object_id") or self._owner_id(username)
        role = str(payload.get("role") or "user")
        permissions = payload.get("permissions") or permissions_for_role(role)
        store_id = str(payload.get("store_id") or "store-admin")
        return {
            "tenant_id": tenant_id,
            "store_id": store_id,
            "owner_id": user_id,
            "user_id": user_id,
            "employee_id": payload.get("employee_id"),
            "username": username,
            "role": role,
            "permissions": list(permissions),
            "force_password_change": bool(payload.get("force_password_change", False)),
        }

    def _create_refresh_token(self, tenant_id: str, claims: dict) -> dict:
        refresh_token = f"refresh-{uuid4()}"
        payload = {
            "kind": "refresh_token",
            "token": refresh_token,
            **claims,
            "expires": self._expires_in_hours(24),
            "active": True,
        }
        return self._upsert_auth_payload(tenant_id, payload)

    def _create_access_token(self, tenant_id: str, claims: dict, refresh_record: dict) -> dict:
        access_token = f"access-{uuid4()}"
        payload = {
            "kind": "access_token",
            "token": access_token,
            **claims,
            "refresh_object_id": refresh_record["object_id"],
            "expires": self._expires_in_hours(12),
            "active": True,
        }
        return self._upsert_auth_payload(tenant_id, payload)

    def _owner_id(self, username: str) -> str:
        return f"user-{username}"

    def _update_user_payload(
        self,
        tenant_id: str,
        user_id: str,
        payload: dict,
        created_at: datetime | str | None = None,
    ) -> dict:
        now = self._utc_now().isoformat()
        if isinstance(created_at, datetime):
            created = created_at.isoformat()
        else:
            created = str(created_at or now)
        clean_payload = {key: value for key, value in payload.items() if value is not None}
        record = ObjectRecord(
            object_type="users",
            tenant_id=tenant_id,
            object_id=user_id,
            payload=clean_payload,
            created_at=created,
            updated_at=now,
        )
        return self.repository.upsert_object(record)

    def login(self, tenant_id: str, username: str, password: str) -> dict:
        tenant_id = str(tenant_id or "tenant-admin").strip() or "tenant-admin"
        user_record = self._validate_user_credentials(tenant_id, username, password)
        user_payload = user_record.get("payload", {})
        updated_payload = {
            **user_payload,
            "last_login_at": self._utc_now().isoformat(),
        }
        self._update_user_payload(
            tenant_id,
            user_record["object_id"],
            updated_payload,
            created_at=user_record.get("created_at"),
        )
        claims = self._auth_claims(tenant_id, {**user_record, "payload": updated_payload})
        refresh_record = self._create_refresh_token(tenant_id, claims)
        access_record = self._create_access_token(tenant_id, claims, refresh_record)
        return {
            "access_token": access_record["payload"]["token"],
            "refresh_token": refresh_record["payload"]["token"],
            "expires": access_record["payload"]["expires"],
            **claims,
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
        if not refresh_record["payload"].get("active", True):
            raise HTTPException(status_code=401, detail="Token is inactive")
        if self._is_expired(refresh_record["payload"].get("expires")):
            raise HTTPException(status_code=401, detail="Token is expired")

        username = refresh_record["payload"].get("username", "")
        user_record = self._find_user_record(tenant_id, username)
        if user_record:
            if user_record.get("payload", {}).get("active") is False:
                raise HTTPException(status_code=403, detail="User is inactive")
            claims = self._auth_claims(tenant_id, user_record)
        else:
            claims = {
                key: refresh_record["payload"].get(key)
                for key in (
                    "tenant_id",
                    "store_id",
                    "owner_id",
                    "user_id",
                    "employee_id",
                    "username",
                    "role",
                    "permissions",
                    "force_password_change",
                )
            }
        access_record = self._create_access_token(tenant_id, claims, refresh_record)
        return {
            "access_token": access_record["payload"]["token"],
            "refresh_token": refresh_token,
            "expires": access_record["payload"]["expires"],
            **claims,
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

    def change_password(
        self,
        tenant_id: str,
        access_token: str,
        current_password: str,
        new_password: str,
    ) -> dict:
        if not new_password or len(new_password) < 8:
            raise HTTPException(status_code=422, detail="New password must be at least 8 characters")
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
        if not access_record["payload"].get("active", True):
            raise HTTPException(status_code=401, detail="Token is inactive")
        if self._is_expired(access_record["payload"].get("expires")):
            raise HTTPException(status_code=401, detail="Token is expired")

        username = access_record["payload"].get("username", "")
        user_record = self._validate_user_credentials(tenant_id, username, current_password)
        payload = {
            **user_record.get("payload", {}),
            "password_hash": hash_password(new_password),
            "force_password_change": False,
            "password_changed_at": self._utc_now().isoformat(),
        }
        self._update_user_payload(
            tenant_id,
            user_record["object_id"],
            payload,
            created_at=user_record.get("created_at"),
        )
        return {"success": True, "tenant_id": tenant_id, "username": username}

    def verify_password_token(self, tenant_id: str, _token: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}

    def reset_password(self, tenant_id: str, _token: str, _new_password: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}

    def send_reset_password_email(self, tenant_id: str, _email: str) -> dict:
        return {"success": True, "tenant_id": tenant_id}
