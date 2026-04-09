from datetime import datetime

from pydantic import BaseModel


class SiteCreate(BaseModel):
    code: str | None = None
    name: str
    location: str | None = None
    active: bool = True


class SiteUpdate(BaseModel):
    name: str
    location: str | None = None
    active: bool = True


class SiteRead(BaseModel):
    id: str
    code: str
    name: str
    location: str | None = None
    active: bool
    created_at: datetime
    updated_at: datetime


class SiteListResponse(BaseModel):
    sites: list[SiteRead]
