from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import BinaryIO
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import get_settings


@dataclass(frozen=True)
class S3UploadResult:
    bucket: str
    key: str
    url: str


class S3UploadHelper:
    """
    Helper scaffold for S3 uploads.
    This is intentionally not wired into API routes yet.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._bucket = settings.s3_bucket_name
        self._prefix = settings.s3_assets_prefix.strip("/")
        self._region = settings.aws_region
        self._public_base_url = settings.s3_public_base_url
        self._client = boto3.client(
            "s3",
            region_name=self._region,
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )

    def _object_key(self, filename: str, content_type: str | None = None) -> str:
        safe_name = filename.rsplit("/", 1)[-1].replace(" ", "_")
        extension = ""
        if "." in safe_name:
            extension = safe_name[safe_name.rfind(".") :]
        elif content_type == "image/png":
            extension = ".png"
        elif content_type == "image/jpeg":
            extension = ".jpg"
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        return f"{self._prefix}/{timestamp}_{uuid4().hex}{extension}"

    def _public_url(self, key: str) -> str:
        if self._public_base_url:
            return f"{self._public_base_url.rstrip('/')}/{key}"
        return f"https://{self._bucket}.s3.{self._region}.amazonaws.com/{key}"

    def upload_file(
        self,
        *,
        file_obj: BinaryIO,
        filename: str,
        content_type: str | None = None,
    ) -> S3UploadResult:
        if not self._bucket:
            raise ValueError("S3 bucket is not configured. Set BEBE_IMS_S3_BUCKET_NAME.")

        key = self._object_key(filename=filename, content_type=content_type)
        extra_args: dict[str, str] = {}
        if content_type:
            extra_args["ContentType"] = content_type

        upload_kwargs = {
            "Fileobj": file_obj,
            "Bucket": self._bucket,
            "Key": key,
        }
        if extra_args:
            upload_kwargs["ExtraArgs"] = extra_args

        try:
            self._client.upload_fileobj(**upload_kwargs)
        except (BotoCoreError, ClientError) as exc:
            raise RuntimeError("S3 upload failed.") from exc

        return S3UploadResult(
            bucket=self._bucket,
            key=key,
            url=self._public_url(key),
        )
