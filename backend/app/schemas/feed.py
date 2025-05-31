# Feed schemas
from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
import uuid
from app.schemas.article import Article  # Import Article schema

class FeedBase(BaseModel):
    url: str
    title: str | None = None
    folder_id: str | None = None

class FeedCreate(BaseModel):
    url: str
    title: str | None = None
    folder_id: str | None = None
    favicon: str | None = None  # Add favicon to creation schema

class Feed(FeedBase):
    id: str
    title: str  # Ensure title is always present in responses
    feed_url: str | None = None
    site_url: str | None = None
    description: str | None = None
    folder_id: str | None = None
    favicon: str | None = None  # Add favicon to schema
    articles: List[Article] = []  # Add articles field with correct Pydantic type

    @field_validator('id', mode='before')
    @classmethod
    def convert_id_to_str(cls, v):
        return str(v)

    @field_validator('folder_id', mode='before')
    @classmethod
    def convert_folder_id_to_str(cls, v):
        if v is None:
            return None
        return str(v)

    model_config = ConfigDict(from_attributes=True)
