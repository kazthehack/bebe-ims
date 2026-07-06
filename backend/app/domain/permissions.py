from __future__ import annotations

from enum import StrEnum

from fastapi import Depends, HTTPException

from app.core.auth import CurrentUser, get_current_user

CURRENT_USER_DEPENDENCY = Depends(get_current_user)


class UserRole(StrEnum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


ROLE_PERMISSIONS: dict[UserRole, tuple[str, ...]] = {
    UserRole.ADMIN: (
        "users:create",
        "users:read",
        "users:update",
        "users:delete",
        "sites:create",
        "sites:read",
        "sites:update",
        "sites:delete",
        "events:create",
        "events:read",
        "events:update",
        "events:delete",
        "inventory:create",
        "inventory:read",
        "inventory:update",
        "inventory:delete",
        "products:create",
        "products:read",
        "products:update",
        "products:delete",
        "partnerships:create",
        "partnerships:read",
        "partnerships:update",
        "partnerships:delete",
        "receipts:create",
        "receipts:read",
        "pos:access",
    ),
    UserRole.MANAGER: (
        "sites:read",
        "events:create",
        "events:read",
        "events:update",
        "events:delete",
        "inventory:create",
        "inventory:read",
        "inventory:update",
        "inventory:delete",
        "products:create",
        "products:read",
        "products:update",
        "products:delete",
        "partnerships:create",
        "partnerships:read",
        "partnerships:update",
        "partnerships:delete",
        "receipts:read",
    ),
    UserRole.USER: (
        "sites:read",
        "events:read",
        "inventory:read",
        "products:read",
        "receipts:create",
        "receipts:read",
        "pos:access",
    ),
}


def normalize_role(value: str | UserRole | None) -> UserRole:
    raw = str(value or "").strip().lower()
    for role in UserRole:
        if role.value == raw:
            return role
    return UserRole.USER


def permissions_for_role(value: str | UserRole | None) -> list[str]:
    role = normalize_role(value)
    return list(ROLE_PERMISSIONS[role])


def require_permission(permission: str):
    def dependency(current_user: CurrentUser = CURRENT_USER_DEPENDENCY) -> CurrentUser:
        if current_user.force_password_change:
            raise HTTPException(status_code=403, detail="Password change required")
        if permission not in current_user.permissions:
            raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
        return current_user

    return dependency
