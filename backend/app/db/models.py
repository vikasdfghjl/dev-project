# SQLAlchemy models for feeds, folders, articles
from app.db.database import Base
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Folder(Base):
    __tablename__ = "folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    feeds = relationship("Feed", back_populates="folder")


class Feed(Base):
    __tablename__ = "feeds"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    feed_url = Column(String, nullable=True)  # Add feed_url field for tests
    site_url = Column(String, nullable=True)  # Add site_url field for tests
    title = Column(String, index=True)
    description = Column(Text, nullable=True)  # Add description field
    favicon = Column(String, nullable=True)  # Add favicon field to Feed
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    folder = relationship("Folder", back_populates="feeds")
    articles = relationship("Article", back_populates="feed")


class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=True)
    link = Column(String, nullable=False)
    pub_date = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    guid = Column(String, nullable=True)
    published_at = Column(String, nullable=True)  # For test compatibility
    description = Column(Text, nullable=True)  # Add description field for tests
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    feed_id = Column(Integer, ForeignKey("feeds.id"), nullable=False)
    feed = relationship("Feed", back_populates="articles")

    # Add unique constraint for (feed_id, guid) to ensure uniqueness within feed
    __table_args__ = (UniqueConstraint("feed_id", "guid", name="_feed_guid_uc"),)


class Settings(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    auto_cleanup_enabled = Column(Boolean, default=True)
    auto_cleanup_days = Column(Integer, default=28)  # 7, 14, or 28 days
    refresh_interval_minutes = Column(Integer, default=60)  # Feed refresh interval
