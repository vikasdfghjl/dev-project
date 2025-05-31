# Folder schemas
from pydantic import BaseModel, field_serializer, field_validator, ConfigDict
from typing import List

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class FolderUpdate(BaseModel):
    name: str

class Folder(FolderBase):
    id: str
    feeds: List = []  # Add feeds relationship for tests

    @field_validator('id', mode='before')
    @classmethod
    def str_id(cls, v):
        return str(v)

    model_config = ConfigDict(from_attributes=True)
