from pydantic import BaseModel, ConfigDict


class ObjectDocument(BaseModel):
    model_config = ConfigDict(extra="allow")

    object_type: str
