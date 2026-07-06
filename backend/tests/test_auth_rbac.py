from __future__ import annotations

import pytest
from fastapi import HTTPException

from app.controllers.auth_controller import AuthController
from app.core.auth import hash_password, verify_password
from app.domain.object_record import ObjectRecord
from app.domain.permissions import normalize_role, permissions_for_role


class FakeRepository:
    def __init__(self) -> None:
        self.records: dict[str, dict[str, dict[str, dict]]] = {}

    def get_object(self, tenant_id: str, object_type: str, object_id: str) -> dict | None:
        return self.records.get(tenant_id, {}).get(object_type, {}).get(object_id)

    def list_objects(self, tenant_id: str, object_type: str) -> list[dict]:
        return list(self.records.get(tenant_id, {}).get(object_type, {}).values())

    def upsert_object(self, record: ObjectRecord) -> dict:
        item = {
            "tenant_id": record.tenant_id,
            "object_type": record.object_type,
            "object_id": record.object_id,
            "payload": record.payload,
            "created_at": record.created_at,
            "updated_at": record.updated_at,
        }
        self.records.setdefault(record.tenant_id, {}).setdefault(record.object_type, {})[
            record.object_id
        ] = item
        return item


def seed_user(
    repository: FakeRepository,
    *,
    username: str = "admin",
    password: str = "P@sswor1234!",
    role: str = "admin",
    active: bool = True,
    force_password_change: bool = False,
) -> None:
    user_id = f"user-{username}"
    repository.upsert_object(
        ObjectRecord(
            tenant_id="tenant-admin",
            object_type="users",
            object_id=user_id,
            payload={
                "username": username,
                "short_name": username,
                "role": role,
                "permissions": permissions_for_role(role),
                "password_hash": hash_password(password),
                "active": active,
                "global_active": active,
                "employee_id": f"employee-{username}",
                "force_password_change": force_password_change,
                "store_id": "store-admin",
            },
        )
    )


def test_password_hash_round_trip_and_wrong_password_rejection() -> None:
    password_hash = hash_password("P@sswor1234!")

    assert password_hash != "P@sswor1234!"
    assert verify_password("P@sswor1234!", password_hash)
    assert not verify_password("wrong", password_hash)


def test_permissions_are_role_based_and_unknown_roles_fall_back_to_user() -> None:
    assert normalize_role("MANAGER").value == "manager"
    assert "users:create" in permissions_for_role("admin")
    assert "events:create" in permissions_for_role("manager")
    assert "users:create" not in permissions_for_role("manager")
    assert "pos:access" in permissions_for_role("unknown")


def test_login_uses_hashed_user_record_and_returns_rbac_claims() -> None:
    repository = FakeRepository()
    seed_user(repository)
    controller = AuthController(settings=object(), repository=repository)

    response = controller.login("tenant-admin", "admin", "P@sswor1234!")

    assert response["username"] == "admin"
    assert response["role"] == "admin"
    assert response["employee_id"] == "employee-admin"
    assert "users:create" in response["permissions"]
    assert response["access_token"].startswith("access-")
    assert response["refresh_token"].startswith("refresh-")


def test_change_password_updates_hash_and_clears_forced_change() -> None:
    repository = FakeRepository()
    seed_user(repository, force_password_change=True)
    controller = AuthController(settings=object(), repository=repository)
    login = controller.login("tenant-admin", "admin", "P@sswor1234!")

    controller.change_password(
        "tenant-admin",
        login["access_token"],
        "P@sswor1234!",
        "NewP@ss1234!",
    )

    user = repository.get_object("tenant-admin", "users", "user-admin")
    assert user is not None
    assert user["payload"]["force_password_change"] is False
    assert verify_password("NewP@ss1234!", user["payload"]["password_hash"])
    assert not verify_password("P@sswor1234!", user["payload"]["password_hash"])


def test_inactive_users_cannot_login() -> None:
    repository = FakeRepository()
    seed_user(repository, active=False)
    controller = AuthController(settings=object(), repository=repository)

    with pytest.raises(HTTPException) as exc:
        controller.login("tenant-admin", "admin", "P@sswor1234!")

    assert exc.value.status_code == 403
