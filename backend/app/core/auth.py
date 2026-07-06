from __future__ import annotations

import base64
import hashlib
import hmac
import os
from datetime import UTC, datetime

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

from app.db.repository import ObjectRepository

PASSWORD_HASH_ALGORITHM = "pbkdf2_sha256"
PASSWORD_HASH_ITERATIONS = 390_000
bearer_scheme = HTTPBearer(auto_error=False)


class CurrentUser(BaseModel):
    tenant_id: str
    store_id: str | None = None
    user_id: str
    owner_id: str
    employee_id: str | None = None
    username: str
    role: str
    permissions: list[str] = Field(default_factory=list)
    force_password_change: bool = False
    access_token: str


def get_auth_repository() -> ObjectRepository:
    return ObjectRepository()


AUTH_CREDENTIALS_DEPENDENCY = Depends(bearer_scheme)
AUTH_REPOSITORY_DEPENDENCY = Depends(get_auth_repository)


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_HASH_ITERATIONS,
    )
    salt_value = base64.b64encode(salt).decode("ascii")
    hash_value = base64.b64encode(digest).decode("ascii")
    return f"{PASSWORD_HASH_ALGORITHM}${PASSWORD_HASH_ITERATIONS}${salt_value}${hash_value}"


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    try:
        algorithm, iterations_raw, salt_value, expected_value = password_hash.split("$", 3)
        if algorithm != PASSWORD_HASH_ALGORITHM:
            return False
        iterations = int(iterations_raw)
        salt = base64.b64decode(salt_value.encode("ascii"))
        expected = base64.b64decode(expected_value.encode("ascii"))
    except (ValueError, TypeError):
        return False

    actual = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iterations,
    )
    return hmac.compare_digest(actual, expected)


def _is_expired(iso_timestamp: str | None) -> bool:
    if not iso_timestamp:
        return True
    try:
        return datetime.fromisoformat(iso_timestamp) <= datetime.now(UTC)
    except ValueError:
        return True


def _request_tenant_id(request: Request) -> str:
    value = request.query_params.get("tenant_id") or request.headers.get("x-tenant-id")
    return str(value or "tenant-admin").strip() or "tenant-admin"


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = AUTH_CREDENTIALS_DEPENDENCY,
    repository: ObjectRepository = AUTH_REPOSITORY_DEPENDENCY,
) -> CurrentUser:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Authorization bearer token is required")

    tenant_id = _request_tenant_id(request)
    token = credentials.credentials
    auth_records = repository.list_objects(tenant_id, "auth")
    access_record = next(
        (
            record
            for record in auth_records
            if record.get("payload", {}).get("kind") == "access_token"
            and record.get("payload", {}).get("token") == token
        ),
        None,
    )
    if not access_record:
        raise HTTPException(status_code=401, detail="Token not found")

    payload = access_record.get("payload", {})
    if not payload.get("active", True):
        raise HTTPException(status_code=401, detail="Token is inactive")
    if _is_expired(payload.get("expires")):
        raise HTTPException(status_code=401, detail="Token is expired")

    username = str(payload.get("username") or "").strip().lower()
    user_id = str(payload.get("user_id") or payload.get("owner_id") or f"user-{username}")
    user_record = repository.get_object(tenant_id, "users", user_id)
    if user_record and user_record.get("payload", {}).get("active") is False:
        raise HTTPException(status_code=403, detail="User is inactive")

    return CurrentUser(
        tenant_id=str(payload.get("tenant_id") or tenant_id),
        store_id=payload.get("store_id"),
        user_id=user_id,
        owner_id=str(payload.get("owner_id") or user_id),
        employee_id=payload.get("employee_id"),
        username=username,
        role=str(payload.get("role") or "user"),
        permissions=list(payload.get("permissions") or []),
        force_password_change=bool(payload.get("force_password_change", False)),
        access_token=token,
    )
