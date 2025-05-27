# Article schemas
from pydantic import BaseModel

class ArticleBase(BaseModel):
    title: str
    content: str
    link: str
    pub_date: str
    feed_id: int

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    class Config:
        from_attributes = True
