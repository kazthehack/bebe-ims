from datetime import datetime

from pydantic import BaseModel


class ProductLineCreate(BaseModel):
    code: str | None = None
    name: str
    description: str | None = None
    active: bool = True


class ProductLineUpdate(BaseModel):
    name: str
    description: str | None = None
    active: bool = True


class ProductLineRead(BaseModel):
    id: str
    code: str
    name: str
    description: str | None = None
    active: bool
    products_count: int = 0
    created_at: datetime
    updated_at: datetime


class ProductLineListResponse(BaseModel):
    product_lines: list[ProductLineRead]
