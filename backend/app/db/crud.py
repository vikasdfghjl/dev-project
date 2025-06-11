# CRUD operations for feeds, folders, articles
import logging
from datetime import datetime, timedelta

from app.db.models import Article, Feed, Folder, Settings
from app.schemas.article import ArticleCreate
from app.schemas.feed import FeedCreate
from app.schemas.folder import FolderCreate
from app.schemas.settings import SettingsCreate, SettingsUpdate
from app.services.feed_parser import fetch_favicon_url, parse_feed
from sqlalchemy import and_
from sqlalchemy.exc import DatabaseError, OperationalError, SQLAlchemyError
from sqlalchemy.orm import Session, joinedload  # Import joinedload

# Set up logging
logger = logging.getLogger(__name__)


def handle_database_operation(operation_name: str):
    """Decorator to handle database operation errors"""

    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                logger.error(
                    f"❌ Database operational error in {operation_name}: {str(e)}"
                )
                raise DatabaseError(f"Database connection lost during {operation_name}")
            except SQLAlchemyError as e:
                logger.error(f"❌ Database error in {operation_name}: {str(e)}")
                raise
            except Exception as e:
                logger.error(f"❌ Unexpected error in {operation_name}: {str(e)}")
                raise

        return wrapper

    return decorator


@handle_database_operation("create_article")
def create_article(db: Session, article: ArticleCreate):
    db_article = Article(**article.model_dump())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@handle_database_operation("get_feeds")
def get_feeds(db: Session):
    return (
        db.query(Feed).options(joinedload(Feed.articles)).all()
    )  # Eager load articles


@handle_database_operation("get_folders")
def get_folders(db: Session):
    folders = db.query(Folder).all()
    from app.schemas.feed import Feed as FeedSchema

    result = []
    for folder in folders:
        # Get feeds for this folder
        feeds = db.query(Feed).filter(Feed.folder_id == folder.id).all()
        # Convert feeds to Pydantic models
        feeds_data = [FeedSchema.model_validate(feed) for feed in feeds]
        # Convert folder to Pydantic model, inject feeds
        folder_data = folder
        folder_dict = folder.__dict__.copy()
        folder_dict["feeds"] = feeds_data
        # Use Folder schema to serialize
        from app.schemas.folder import Folder as FolderSchema

        folder_pydantic = FolderSchema.model_validate(folder_dict)
        result.append(folder_pydantic)
    return result


@handle_database_operation("create_folder")
def create_folder(db: Session, folder: FolderCreate):
    db_folder = Folder(name=folder.name)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


def create_feed(db: Session, feed: FeedCreate):
    try:
        parsed_data = parse_feed(feed.url)
        # Try to get favicon from site_url if available
        favicon_url = None
        if parsed_data.site_url:
            favicon_url = fetch_favicon_url(parsed_data.site_url)
        db_feed = Feed(
            url=feed.url,
            folder_id=feed.folder_id,
            title=parsed_data.title,
            feed_url=feed.url,  # Store original URL
            site_url=parsed_data.site_url,
            description=parsed_data.description,
            favicon=favicon_url,
        )
        db.add(db_feed)
        db.commit()
        db.refresh(db_feed)
        for article_data in parsed_data.articles:
            from datetime import datetime

            published_at = None
            if article_data.published_at:
                try:
                    published_at = datetime.fromisoformat(
                        article_data.published_at.replace("Z", "+00:00")
                    )
                except:
                    published_at = datetime.now()
            article = Article(
                title=article_data.title,
                link=article_data.link,
                guid=article_data.guid,
                published_at=published_at,
                description=article_data.content,
                image_url=article_data.image_url,
                feed_id=db_feed.id,
            )
            db.add(article)
        db.commit()
        return db_feed
    except ValueError as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise


def get_articles_for_feed(db: Session, feed_id):
    return db.query(Article).filter(Article.feed_id == feed_id).all()


def delete_feed(db: Session, feed_id):
    # First delete all articles for this feed
    db.query(Article).filter(Article.feed_id == feed_id).delete()
    # Then delete the feed
    result = db.query(Feed).filter(Feed.id == feed_id).delete()
    db.commit()
    if result:
        return {"ok": True}
    return {"ok": False, "error": "Feed not found"}


def delete_folder(db: Session, folder_id):
    # First, set all feeds in this folder to have no folder (ungrouped)
    db.query(Feed).filter(Feed.folder_id == folder_id).update({"folder_id": None})
    # Then delete the folder
    result = db.query(Folder).filter(Folder.id == folder_id).delete()
    db.commit()
    if result:
        return {"ok": True}
    return {"ok": False, "error": "Folder not found"}


def update_folder(db: Session, folder_id, new_name: str):
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
                    article_date = datetime.fromisoformat(
                        article.pub_date.replace("Z", "+00:00")
                    )
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
