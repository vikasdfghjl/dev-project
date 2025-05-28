# Article schemas
from pydantic import BaseModel

class ArticleBase(BaseModel):
    title: str
    content: str
    link: str
    pub_date: str
    image_url: str | None = None  # Add image_url field
    feed_id: int

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    class Config:
        from_attributes = True
