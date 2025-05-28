# SQLAlchemy models for feeds, folders, articles
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
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
    image_url = Column(String, nullable=True)  # Add image_url field
    feed_id = Column(Integer, ForeignKey("feeds.id"))
    feed = relationship("Feed", back_populates="articles")

class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    auto_cleanup_enabled = Column(Boolean, default=True)
    auto_cleanup_days = Column(Integer, default=28)  # 7, 14, or 28 days
    refresh_interval_minutes = Column(Integer, default=60)  # Feed refresh interval
