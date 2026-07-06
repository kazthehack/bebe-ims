from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.auth import hash_password
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord
from app.domain.permissions import (
    normalize_role,
    permissions_for_role,
    require_permission,
)

router = APIRouter(prefix="/user-management", tags=["user-management"])


class EmployeeSummary(BaseModel):
    id: str
    employee_code: str | None = None
    display_name: str | None = None
    email: str | None = None
    active: bool = True
    site_ids: list[str] = Field(default_factory=list)


class ManagedUserRead(BaseModel):
    id: str
    username: str
    email: str | None = None
    role: str
    permissions: list[str] = Field(default_factory=list)
    active: bool = True
    force_password_change: bool = False
    employee_id: str | None = None
    employee: EmployeeSummary | None = None
    last_login_at: str | None = None
    password_changed_at: str | None = None


class ManagedUserListResponse(BaseModel):
    users: list[ManagedUserRead]


class ManagedEmployeeCreate(BaseModel):
    display_name: str = Field(min_length=1)
    legal_name: str | None = None
    email: str | None = None
    phone: str | None = None
    employee_code: str | None = None
    site_ids: list[str] = Field(default_factory=list)
    active: bool = True


class ManagedUserCreate(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=8)
    role: str = "user"
    email: str | None = None
    active: bool = True
    force_password_change: bool = True
    employee_id: str | None = None
    employee: ManagedEmployeeCreate | None = None


class ManagedUserUpdate(BaseModel):
    role: str | None = None
    email: str | None = None
    active: bool | None = None
    force_password_change: bool | None = None
    employee_id: str | None = None


class ManagedPasswordReset(BaseModel):
    password: str = Field(min_length=8)
    force_password_change: bool = True


class ManagedForcePasswordChange(BaseModel):
    force_password_change: bool = True


class ManagedEmployeeUpdate(BaseModel):
    display_name: str | None = None
    legal_name: str | None = None
    email: str | None = None
    phone: str | None = None
    employee_code: str | None = None
    site_ids: list[str] | None = None
    active: bool | None = None


def get_repository() -> ObjectRepository:
    return ObjectRepository()


REPOSITORY_DEPENDENCY = Depends(get_repository)
USERS_READ_PERMISSION = Depends(require_permission("users:read"))
USERS_CREATE_PERMISSION = Depends(require_permission("users:create"))
USERS_UPDATE_PERMISSION = Depends(require_permission("users:update"))


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _user_id(username: str) -> str:
    return f"user-{str(username or '').strip().lower()}"


def _employee_id(username: str) -> str:
    return f"employee-{str(username or '').strip().lower()}"


def _upsert(
    repository: ObjectRepository,
    *,
    tenant_id: str,
    object_type: str,
    object_id: str,
    payload: dict,
) -> dict:
    now = _utc_now()
    existing = repository.get_object(tenant_id, object_type, object_id)
    created_at = existing.get("created_at") if existing else now
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()
    record = ObjectRecord(
        object_type=object_type,
        tenant_id=tenant_id,
        object_id=object_id,
        payload={key: value for key, value in payload.items() if value is not None},
        created_at=str(created_at),
        updated_at=now,
    )
    return repository.upsert_object(record)


def _employee_summary(record: dict | None) -> EmployeeSummary | None:
    if not record:
        return None
    payload = record.get("payload", {})
    return EmployeeSummary(
        id=record["object_id"],
        employee_code=payload.get("employee_code"),
        display_name=payload.get("display_name"),
        email=payload.get("email"),
        active=bool(payload.get("active", True)),
        site_ids=list(payload.get("site_ids") or []),
    )


def _to_user(repository: ObjectRepository, tenant_id: str, record: dict) -> ManagedUserRead:
    payload = record.get("payload", {})
    employee_id = payload.get("employee_id")
    employee = _employee_summary(repository.get_object(tenant_id, "employee", employee_id)) if employee_id else None
    role = str(payload.get("role") or "user")
    return ManagedUserRead(
        id=record["object_id"],
        username=str(payload.get("username") or payload.get("short_name") or record["object_id"]),
        email=payload.get("email"),
        role=role,
        permissions=list(payload.get("permissions") or permissions_for_role(role)),
        active=bool(payload.get("active", True)),
        force_password_change=bool(payload.get("force_password_change", False)),
        employee_id=employee_id,
        employee=employee,
        last_login_at=payload.get("last_login_at"),
        password_changed_at=payload.get("password_changed_at"),
    )


def _ensure_can_change_admin(repository: ObjectRepository, tenant_id: str, user_id: str, next_payload: dict) -> None:
    users = repository.list_objects(tenant_id, "users")
    active_admin_ids = {
        record["object_id"]
        for record in users
        if record.get("payload", {}).get("active", True)
        and str(record.get("payload", {}).get("role") or "").lower() == "admin"
    }
    if user_id not in active_admin_ids:
        return
    next_active = bool(next_payload.get("active", True))
    next_role = str(next_payload.get("role") or "").lower()
    if (not next_active or next_role != "admin") and len(active_admin_ids) <= 1:
        raise HTTPException(status_code=409, detail="Cannot remove the last active admin")


@router.get("/users", response_model=ManagedUserListResponse)
def list_managed_users(
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_READ_PERMISSION,
) -> ManagedUserListResponse:
    records = sorted(
        repository.list_objects(tenant_id, "users"),
        key=lambda record: str(record.get("payload", {}).get("username") or record["object_id"]).casefold(),
    )
    return ManagedUserListResponse(users=[_to_user(repository, tenant_id, record) for record in records])


@router.post("/users", response_model=ManagedUserRead)
def create_managed_user(
    payload: ManagedUserCreate,
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_CREATE_PERMISSION,
) -> ManagedUserRead:
    username = str(payload.username).strip().lower()
    user_id = _user_id(username)
    if repository.get_object(tenant_id, "users", user_id):
        raise HTTPException(status_code=409, detail="User already exists")

    employee_id = payload.employee_id
    if payload.employee:
        employee_id = employee_id or _employee_id(username)
        employee_payload = payload.employee.model_dump(exclude_none=True)
        employee_payload.setdefault("employee_code", f"EMP-{username.upper()}")
        employee_payload.setdefault("legal_name", employee_payload.get("display_name"))
        _upsert(repository, tenant_id=tenant_id, object_type="employee", object_id=employee_id, payload=employee_payload)
    if not employee_id:
        employee_id = _employee_id(username)
        _upsert(
            repository,
            tenant_id=tenant_id,
            object_type="employee",
            object_id=employee_id,
            payload={
                "employee_code": f"EMP-{username.upper()}",
                "display_name": username.title(),
                "legal_name": username.title(),
                "email": payload.email,
                "active": True,
            },
        )

    role = normalize_role(payload.role).value
    user_record = _upsert(
        repository,
        tenant_id=tenant_id,
        object_type="users",
        object_id=user_id,
        payload={
            "id": user_id,
            "username": username,
            "short_name": username,
            "email": payload.email,
            "role": role,
            "permissions": permissions_for_role(role),
            "password_hash": hash_password(payload.password),
            "force_password_change": payload.force_password_change,
            "active": payload.active,
            "global_active": payload.active,
            "employee_id": employee_id,
            "store_id": "store-admin",
        },
    )
    return _to_user(repository, tenant_id, user_record)


@router.put("/users/{user_id}", response_model=ManagedUserRead)
def update_managed_user(
    user_id: str,
    payload: ManagedUserUpdate,
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_UPDATE_PERMISSION,
) -> ManagedUserRead:
    existing = repository.get_object(tenant_id, "users", user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    next_payload = existing.get("payload", {}).copy()
    updates = payload.model_dump(exclude_none=True)
    if "role" in updates:
        updates["role"] = normalize_role(updates["role"]).value
        updates["permissions"] = permissions_for_role(updates["role"])
    if "active" in updates:
        updates["global_active"] = updates["active"]
    next_payload.update(updates)
    _ensure_can_change_admin(repository, tenant_id, user_id, next_payload)
    record = _upsert(repository, tenant_id=tenant_id, object_type="users", object_id=user_id, payload=next_payload)
    return _to_user(repository, tenant_id, record)


@router.post("/users/{user_id}/reset-password", response_model=ManagedUserRead)
def reset_managed_user_password(
    user_id: str,
    payload: ManagedPasswordReset,
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_UPDATE_PERMISSION,
) -> ManagedUserRead:
    existing = repository.get_object(tenant_id, "users", user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    next_payload = {
        **existing.get("payload", {}),
        "password_hash": hash_password(payload.password),
        "force_password_change": payload.force_password_change,
        "password_changed_at": _utc_now(),
    }
    record = _upsert(repository, tenant_id=tenant_id, object_type="users", object_id=user_id, payload=next_payload)
    return _to_user(repository, tenant_id, record)


@router.post("/users/{user_id}/force-password-change", response_model=ManagedUserRead)
def force_managed_user_password_change(
    user_id: str,
    payload: ManagedForcePasswordChange,
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_UPDATE_PERMISSION,
) -> ManagedUserRead:
    existing = repository.get_object(tenant_id, "users", user_id)
    if not existing:
        raise HTTPException(status_code=404, detail="User not found")
    next_payload = {**existing.get("payload", {}), "force_password_change": payload.force_password_change}
    record = _upsert(repository, tenant_id=tenant_id, object_type="users", object_id=user_id, payload=next_payload)
    return _to_user(repository, tenant_id, record)


@router.put("/employees/{employee_id}", response_model=EmployeeSummary)
def update_managed_employee(
    employee_id: str,
    payload: ManagedEmployeeUpdate,
    tenant_id: str = Query("tenant-admin"),
    repository: ObjectRepository = REPOSITORY_DEPENDENCY,
    _current_user=USERS_UPDATE_PERMISSION,
) -> EmployeeSummary:
    existing = repository.get_object(tenant_id, "employee", employee_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Employee not found")
    next_payload = existing.get("payload", {}).copy()
    next_payload.update(payload.model_dump(exclude_none=True))
    record = _upsert(repository, tenant_id=tenant_id, object_type="employee", object_id=employee_id, payload=next_payload)
    employee = _employee_summary(record)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
