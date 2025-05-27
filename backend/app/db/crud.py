# CRUD operations for feeds, folders, articles
from sqlalchemy.orm import Session
from app.db.models import Feed, Folder, Article
from app.schemas.feed import FeedCreate
from app.schemas.folder import FolderCreate
from app.schemas.article import ArticleCreate

# ...existing code from old crud.py, updated imports as needed...

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
