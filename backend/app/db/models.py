# SQLAlchemy models for feeds, folders, articles
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Folder(Base):
    __tablename__ = "folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    feeds = relationship("Feed", back_populates="folder")

class Feed(Base):
    __tablename__ = "feeds"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    folder = relationship("Folder", back_populates="feeds")
    articles = relationship("Article", back_populates="feed")

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    link = Column(String)
    pub_date = Column(String)
    feed_id = Column(Integer, ForeignKey("feeds.id"))
    feed = relationship("Feed", back_populates="articles")
