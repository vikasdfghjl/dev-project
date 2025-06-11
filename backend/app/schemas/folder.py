# Folder schemas
from typing import List

from pydantic import BaseModel, ConfigDict, field_serializer, field_validator


class FolderBase(BaseModel):
    name: str


class FolderCreate(FolderBase):
    pass


class FolderUpdate(BaseModel):
    name: str


class Folder(FolderBase):
    id: str
    feeds: list = []  # Add feeds relationship for tests

    @field_validator("id", mode="before")
    @classmethod
    def str_id(cls, v):
        return str(v)

    model_config = ConfigDict(from_attributes=True)
