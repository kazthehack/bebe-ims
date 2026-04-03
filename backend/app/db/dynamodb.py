from __future__ import annotations

from functools import lru_cache

import boto3
from botocore.client import BaseClient

from app.core.config import get_settings


@lru_cache
def get_dynamodb_client() -> BaseClient:
    settings = get_settings()
    params = {
        "region_name": settings.aws_region,
        "endpoint_url": settings.dynamodb_effective_endpoint_url,
    }
    return boto3.client("dynamodb", **params)
