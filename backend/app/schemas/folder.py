# Folder schemas
from pydantic import BaseModel, field_serializer, field_validator

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: str

    @field_validator('id', mode='before')
    @classmethod
    def str_id(cls, v):
        return str(v)

    class Config:
        from_attributes = True
