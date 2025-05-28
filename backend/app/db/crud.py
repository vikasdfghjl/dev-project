# CRUD operations for feeds, folders, articles
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from app.db.models import Feed, Folder, Article, Settings
from app.schemas.feed import FeedCreate
from app.schemas.folder import FolderCreate
from app.schemas.article import ArticleCreate
from app.schemas.settings import SettingsCreate, SettingsUpdate

def create_article(db: Session, article: ArticleCreate):
    db_article = Article(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_feeds(db: Session):
    return db.query(Feed).all()

def get_folders(db: Session):
    return db.query(Folder).all()

def create_folder(db: Session, folder: FolderCreate):
    db_folder = Folder(name=folder.name)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

def create_feed(db: Session, feed: FeedCreate):
    db_feed = Feed(
        url=feed.url,
        folder_id=feed.folder_id,
        title=feed.title or "Untitled"
    )
    db.add(db_feed)
    db.commit()
    db.refresh(db_feed)
    return db_feed

def get_articles_for_feed(db: Session, feed_id: int):
    return db.query(Article).filter(Article.feed_id == feed_id).all()

def delete_feed(db: Session, feed_id: int):
    # First delete all articles for this feed
    db.query(Article).filter(Article.feed_id == feed_id).delete()
    # Then delete the feed
    result = db.query(Feed).filter(Feed.id == feed_id).delete()
    db.commit()
    if result:
        return {"ok": True}
    return {"ok": False, "error": "Feed not found"}

def delete_folder(db: Session, folder_id: int):
    # First, set all feeds in this folder to have no folder (ungrouped)
    db.query(Feed).filter(Feed.folder_id == folder_id).update({"folder_id": None})
    # Then delete the folder
    result = db.query(Folder).filter(Folder.id == folder_id).delete()
    db.commit()
    if result:
        return {"ok": True}
    return {"ok": False, "error": "Folder not found"}

def update_folder(db: Session, folder_id: int, new_name: str):
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if folder:
        folder.name = new_name
        db.commit()
        db.refresh(folder)
        return folder
    return None

def delete_old_articles(db: Session, days_older_than: int = 28):
    """Delete articles older than specified number of days"""
    cutoff_date = datetime.now() - timedelta(days=days_older_than)
    
    # Query articles with pub_date older than cutoff
    # Note: pub_date is stored as string, so we need to be careful with comparison
    deleted_count = 0
    
    articles = db.query(Article).all()
    for article in articles:
        if article.pub_date:
            try:
                # Try to parse the pub_date string to datetime
                # Handle various date formats that might be in RSS feeds
                article_date = None
                
                # Try ISO format first
                try:
                    article_date = datetime.fromisoformat(article.pub_date.replace('Z', '+00:00'))
                except:
                    pass
                
                # Try RFC822 format (common in RSS)
                if not article_date:
                    try:
                        from email.utils import parsedate_to_datetime
                        article_date = parsedate_to_datetime(article.pub_date)
                    except:
                        pass
                
                # If we successfully parsed the date and it's older than cutoff
                if article_date and article_date < cutoff_date:
                    db.delete(article)
                    deleted_count += 1
                    
            except Exception:
                # If we can't parse the date, skip this article
                continue
    
    db.commit()
    return deleted_count

# Settings CRUD operations
def get_settings(db: Session):
    """Get the current settings, create default if none exist"""
    settings = db.query(Settings).first()
    if not settings:
        # Create default settings
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_update: SettingsUpdate):
    """Update application settings"""
    settings = get_settings(db)
    
    update_data = settings_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings
