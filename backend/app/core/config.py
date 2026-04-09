from functools import lru_cache
import json
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class DynamoDBLocalConfig(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    port: int = Field(default=8000, alias="Port")
    in_memory: bool = Field(default=False, alias="InMemory")
    version: str = Field(default="3.3.0", alias="Version")
    db_path: str | None = Field(default=None, alias="DbPath")
    shared_db: bool = Field(default=False, alias="SharedDb")
    should_delay_transient_statuses: bool = Field(
        default=False,
        alias="shouldDelayTransientStatuses",
    )
    cors_params: str | None = Field(default=None, alias="CorsParams")
    host: str = "localhost"
    scheme: str = "http"

    @property
    def endpoint_url(self) -> str:
        return f"{self.scheme}://{self.host}:{self.port}"


@lru_cache
def load_dynamodb_local_config(config_path: str) -> DynamoDBLocalConfig:
    path = Path(config_path)
    if not path.exists():
        return DynamoDBLocalConfig()
    with path.open("r", encoding="utf-8") as config_file:
        data = json.load(config_file)
    return DynamoDBLocalConfig.model_validate(data)


class Settings(BaseSettings):
    app_name: str = "bebe-ims-api"
    app_env: str = "development"
    api_prefix: str = "/api/v1"
    aws_region: str = "ap-southeast-1"
    dynamodb_table_name: str = "bebe_ims"
    dynamodb_endpoint_url: str | None = None
    dynamodb_local_config_file: str = "config/dynamodb.local.json"
    local_auth_users: str = "admin,site1,site2,site3"
    local_auth_password: str = "password"
    cors_origins: str = (
        "http://localhost:2306,http://127.0.0.1:2306,"
        "http://localhost:3000,http://127.0.0.1:3000,"
        "http://192.168.0.50:2306"
    )
    cors_origin_regex: str = (
        r"^https?://("
        r"localhost|127\.0\.0\.1|"
        r"192\.168\.\d{1,3}\.\d{1,3}|"
        r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
        r"172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
        r")(:\d+)?$"
    )
    s3_bucket_name: str = ""
    s3_assets_prefix: str = "assets/products"
    s3_endpoint_url: str | None = None
    s3_public_base_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    slicer_cli_path: str | None = None
    slicer_profiles_root: str | None = None
    slicer_machine_preset: str = "Bambu Lab A1 0.4 nozzle.json"
    slicer_process_preset: str = "0.20mm Standard @BBL A1.json"
    slicer_load_default_filament: bool = True
    slicer_allow_newer_file: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="BEBE_IMS_",
        extra="ignore",
    )

    @property
    def dynamodb_local(self) -> DynamoDBLocalConfig:
        return load_dynamodb_local_config(self.dynamodb_local_config_file)

    @property
    def dynamodb_effective_endpoint_url(self) -> str:
        if self.dynamodb_endpoint_url:
            return self.dynamodb_endpoint_url
        return self.dynamodb_local.endpoint_url

    @property
    def local_auth_user_list(self) -> list[str]:
        return [
            username.strip().lower()
            for username in self.local_auth_users.split(",")
            if username.strip()
        ]

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
