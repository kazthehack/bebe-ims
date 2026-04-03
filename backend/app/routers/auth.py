from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.controllers.auth_controller import AuthController
from app.core.config import get_settings
from app.db.repository import ObjectRepository

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
    username: str


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


class GenericSuccessResponse(BaseModel):
    success: bool = True


def get_auth_controller() -> AuthController:
    settings = get_settings()
    return AuthController(settings=settings, repository=ObjectRepository())


@router.post("/login", response_model=AuthLoginResponse)
def login(
    request: AuthLoginRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> AuthLoginResponse:
    return AuthLoginResponse(**controller.login(request.tenant_id, request.username, request.password))


@router.post("/refresh", response_model=AuthLoginResponse)
def refresh(
    request: RefreshRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> AuthLoginResponse:
    return AuthLoginResponse(**controller.refresh(request.tenant_id, request.refresh_token))


@router.post("/logout", response_model=GenericSuccessResponse)
def logout(
    request: LogoutRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> GenericSuccessResponse:
    result = controller.logout(request.tenant_id, request.access_token)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/verify-password-token", response_model=GenericSuccessResponse)
def verify_password_token(
    request: PasswordTokenRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> GenericSuccessResponse:
    result = controller.verify_password_token(request.tenant_id, request.token)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/reset-password", response_model=GenericSuccessResponse)
def reset_password(
    request: PasswordTokenRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> GenericSuccessResponse:
    result = controller.reset_password(request.tenant_id, request.token, request.new_password)
    return GenericSuccessResponse(success=bool(result.get("success", True)))


@router.post("/send-reset-password-email", response_model=GenericSuccessResponse)
def send_reset_password_email(
    request: PasswordTokenRequest,
    controller: AuthController = Depends(get_auth_controller),
) -> GenericSuccessResponse:
    result = controller.send_reset_password_email(request.tenant_id, request.email)
    return GenericSuccessResponse(success=bool(result.get("success", True)))
