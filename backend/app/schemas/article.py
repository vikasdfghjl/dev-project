# Article schemas
from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional
import uuid

class ArticleBase(BaseModel):
    title: str
    link: str
    guid: str
    published_at: Optional[datetime] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class ArticleCreate(ArticleBase):
    feed_id: Optional[str] = None
    content: Optional[str] = None

    @field_validator('feed_id', mode='before')
    @classmethod
    def convert_feed_id_to_str(cls, v):
        if v is None:
            return v
        return str(v)

class Article(ArticleBase):
    id: str
    feed_id: str
    content: Optional[str] = None
    is_read: bool = False
    created_at: datetime
    updated_at: datetime
    
    @field_validator('id', mode='before')
    @classmethod
    def convert_id_to_str(cls, v):
        return str(v)
    
    @field_validator('feed_id', mode='before')
    @classmethod
    def convert_feed_id_to_str(cls, v):
        return str(v)
    
    model_config = ConfigDict(from_attributes=True)
