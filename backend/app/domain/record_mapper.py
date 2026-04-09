from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Generic, TypeVar, get_args, get_origin

from pydantic import BaseModel, ValidationError

T = TypeVar('T', bound=BaseModel)


@dataclass
class StoredRecord(Generic[T]):
    object_id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    payload: T


def _to_datetime(value: object) -> datetime:
    if isinstance(value, datetime):
        return value
    if isinstance(value, str):
        return datetime.fromisoformat(value)
    return datetime.now(timezone.utc)


def _extract_scalar(value: Any) -> Any:
    if not isinstance(value, dict):
        return value
    preferred_keys = ('value', 'count', 'total', 'qty', 'amount', 'number')
    for key in preferred_keys:
        if key in value and not isinstance(value[key], (dict, list)):
            return value[key]
    for item in value.values():
        if not isinstance(item, (dict, list)):
            return item
    return None


def _normalize_annotation(annotation: Any) -> Any:
    origin = get_origin(annotation)
    if origin is None:
        return annotation
    if origin in (list, dict):
        return origin
    args = [arg for arg in get_args(annotation) if arg is not type(None)]
    if len(args) == 1:
        return _normalize_annotation(args[0])
    return annotation


def _coerce_for_field(value: Any, annotation: Any) -> Any:
    normalized = _normalize_annotation(annotation)
    scalar_value = _extract_scalar(value)

    if normalized is float:
        try:
            return float(scalar_value)
        except (TypeError, ValueError):
            return 0.0
    if normalized is int:
        try:
            return int(float(scalar_value))
        except (TypeError, ValueError):
            return 0
    if normalized is str:
        if scalar_value is None:
            return None
        return str(scalar_value)
    if normalized is bool:
        if isinstance(scalar_value, str):
            lowered = scalar_value.strip().lower()
            if lowered in ('true', '1', 'yes', 'y'):
                return True
            if lowered in ('false', '0', 'no', 'n'):
                return False
        return bool(scalar_value)
    return value


def _sanitize_payload(payload: Any, payload_model: type[T]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        return {}
    extra_mode = str(payload_model.model_config.get('extra') or '')
    if extra_mode == 'forbid':
        allowed_fields = payload_model.model_fields
        sanitized: dict[str, Any] = {}
        for field_name, field_def in allowed_fields.items():
            if field_name not in payload:
                continue
            sanitized[field_name] = _coerce_for_field(payload[field_name], field_def.annotation)
        return sanitized
    # For models allowing extras, keep payload as-is.
    return payload


def map_record(record: dict, payload_model: type[T]) -> StoredRecord[T]:
    raw_payload = record.get('payload', {})
    try:
        payload = payload_model.model_validate(raw_payload)
    except ValidationError:
        payload = payload_model.model_validate(_sanitize_payload(raw_payload, payload_model))
    return StoredRecord(
        object_id=str(record.get('object_id', '')),
        tenant_id=str(record.get('tenant_id', '')),
        created_at=_to_datetime(record.get('created_at')),
        updated_at=_to_datetime(record.get('updated_at')),
        payload=payload,
    )
