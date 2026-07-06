from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.controllers.auth_controller import AuthController
from app.core.auth import CurrentUser, get_current_user
from app.core.config import get_settings
from app.db.repository import ObjectRepository
from app.domain.object_record import ObjectRecord

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthLoginRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class AuthLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires: str
    tenant_id: str
    store_id: str
    owner_id: str
    user_id: str
    employee_id: str | None = None
    username: str
    role: str
    permissions: list[str] = Field(default_factory=list)
    force_password_change: bool = False


class AuthEmployeeProfile(BaseModel):
    id: str | None = None
    employee_code: str | None = None
    display_name: str | None = None
    legal_name: str | None = None
    email: str | None = None
    phone: str | None = None
    active: bool = True
    site_ids: list[str] = Field(default_factory=list)


class AuthMeResponse(BaseModel):
    tenant_id: str
    store_id: str | None = None
    owner_id: str
    user_id: str
    employee_id: str | None = None
    username: str
    role: str
    permissions: list[str] = Field(default_factory=list)
    force_password_change: bool = False
    email: str | None = None
    employee: AuthEmployeeProfile | None = None


class AuthMeUpdateRequest(BaseModel):
    email: str | None = None
    employee_code: str | None = None
    display_name: str | None = None
    legal_name: str | None = None
    employee_email: str | None = None
    phone: str | None = None
    active: bool | None = None


class PasswordTokenRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    token: str = ""
    email: str = ""
    new_password: str = ""


class RefreshRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    refresh_token: str = Field(min_length=1)


class LogoutRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    access_token: str = Field(min_length=1)


class ChangePasswordRequest(BaseModel):
    tenant_id: str = Field(min_length=1)
    access_token: str = Field(min_length=1)
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8)


class GenericSuccessResponse(BaseModel):
    success: bool = True


def get_auth_controller() -> AuthController:
    settings = get_settings()
    return AuthController(settings=settings, repository=ObjectRepository())


AUTH_CONTROLLER_DEPENDENCY = Depends(get_auth_controller)
CURRENT_USER_DEPENDENCY = Depends(get_current_user)


def _utc_now() -> str:
    return datetime.now(UTC).isoformat()


def _upsert_object(
    repository: ObjectRepository,
    tenant_id: str,
    object_type: str,
    object_id: str,
    payload: dict,
    existing: dict | None = None,
) -> dict:
    now = _utc_now()
    created_at = (existing or {}).get("created_at") or now
    if isinstance(created_at, datetime):
        created_at = created_at.isoformat()
    return repository.upsert_object(
        ObjectRecord(
            object_type=object_type,
            tenant_id=tenant_id,
            object_id=object_id,
            payload={key: value for key, value in payload.items() if value is not None},
            created_at=str(created_at),
            updated_at=now,
        )
    )


def _auth_me_response(
    current_user: CurrentUser,
    repository: ObjectRepository,
) -> AuthMeResponse:
    user_record = repository.get_object(current_user.tenant_id, "users", current_user.user_id)
    user_payload = user_record.get("payload", {}) if user_record else {}
    employee = None
    if current_user.employee_id:
        employee_record = repository.get_object(
            current_user.tenant_id,
            "employee",
            current_user.employee_id,
        )
        if employee_record:
            payload = employee_record.get("payload", {})
            employee = AuthEmployeeProfile(
                id=employee_record.get("object_id"),
                employee_code=payload.get("employee_code"),
                display_name=payload.get("display_name"),
                legal_name=payload.get("legal_name"),
                email=payload.get("email"),
                phone=payload.get("phone"),
                active=bool(payload.get("active", True)),
                site_ids=list(payload.get("site_ids") or []),
            )

    return AuthMeResponse(
        tenant_id=current_user.tenant_id,
        store_id=current_user.store_id,
        owner_id=current_user.owner_id,
        user_id=current_user.user_id,
        employee_id=current_user.employee_id,
        username=current_user.username,
        role=current_user.role,
        permissions=current_user.permissions,
        force_password_change=current_user.force_password_change,
        email=user_payload.get("email"),
        employee=employee,
    )


@router.post("/login", response_model=AuthLoginResponse)
def login(
    request: AuthLoginRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> AuthLoginResponse:
    return AuthLoginResponse(**controller.login(request.tenant_id, request.username, request.password))


@router.get("/me", response_model=AuthMeResponse)
def me(
    current_user: CurrentUser = CURRENT_USER_DEPENDENCY,
) -> AuthMeResponse:
    repository = ObjectRepository()
    return _auth_me_response(current_user, repository)


@router.put("/me", response_model=AuthMeResponse)
def update_me(
    request: AuthMeUpdateRequest,
    current_user: CurrentUser = CURRENT_USER_DEPENDENCY,
) -> AuthMeResponse:
    repository = ObjectRepository()
    user_record = repository.get_object(current_user.tenant_id, "users", current_user.user_id)
    if user_record:
        user_payload = user_record.get("payload", {}).copy()
        updates = request.model_dump(exclude_unset=True)
        if "email" in updates:
            user_payload["email"] = updates["email"]
        _upsert_object(
            repository,
            current_user.tenant_id,
            "users",
            current_user.user_id,
            user_payload,
            existing=user_record,
        )

    if current_user.employee_id:
        employee_record = repository.get_object(
            current_user.tenant_id,
            "employee",
            current_user.employee_id,
        )
        if employee_record:
            employee_payload = employee_record.get("payload", {}).copy()
            updates = request.model_dump(exclude_unset=True)
            employee_field_map = {
                "employee_code": "employee_code",
                "display_name": "display_name",
                "legal_name": "legal_name",
                "employee_email": "email",
                "phone": "phone",
                "active": "active",
            }
            for request_key, payload_key in employee_field_map.items():
                if request_key in updates:
                    employee_payload[payload_key] = updates[request_key]
            _upsert_object(
                repository,
                current_user.tenant_id,
                "employee",
                current_user.employee_id,
                employee_payload,
                existing=employee_record,
            )

    return _auth_me_response(current_user, repository)


@router.post("/refresh", response_model=AuthLoginResponse)
def refresh(
    request: RefreshRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> AuthLoginResponse:
    return AuthLoginResponse(**controller.refresh(request.tenant_id, request.refresh_token))


@router.post("/logout", response_model=GenericSuccessResponse)
def logout(
    request: LogoutRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> GenericSuccessResponse:
    result = controller.logout(request.tenant_id, request.access_token)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/change-password", response_model=GenericSuccessResponse)
def change_password(
    request: ChangePasswordRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> GenericSuccessResponse:
    result = controller.change_password(
        request.tenant_id,
        request.access_token,
        request.current_password,
        request.new_password,
    )
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/verify-password-token", response_model=GenericSuccessResponse)
def verify_password_token(
    request: PasswordTokenRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> GenericSuccessResponse:
    result = controller.verify_password_token(request.tenant_id, request.token)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/reset-password", response_model=GenericSuccessResponse)
def reset_password(
    request: PasswordTokenRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> GenericSuccessResponse:
    result = controller.reset_password(request.tenant_id, request.token, request.new_password)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/send-reset-password-email", response_model=GenericSuccessResponse)
def send_reset_password_email(
    request: PasswordTokenRequest,
    controller: AuthController = AUTH_CONTROLLER_DEPENDENCY,
) -> GenericSuccessResponse:
    result = controller.send_reset_password_email(request.tenant_id, request.email)
    return GenericSuccessResponse(success=bool(result.get("success", True)))
