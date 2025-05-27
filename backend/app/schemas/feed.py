# Feed schemas
from pydantic import BaseModel

class FeedBase(BaseModel):
    url: str
    title: str | None = None
    folder_id: int | None = None

class FeedCreate(BaseModel):
    url: str
    title: str | None = None
    folder_id: int | None = None

class Feed(FeedBase):
    id: int
    title: str  # Ensure title is always present in responses
    class Config:
        from_attributes = True
