# Feed endpoints
from fastapi import APIRouter, Depends, status, HTTPException, Request, Body
from sqlalchemy.orm import Session
from app.db import crud, models, database
from app.schemas import feed as feed_schemas, article as article_schemas
from app.services.feed_parser import fetch_and_save_articles_for_feed
import httpx
import feedparser
import uuid
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/", response_model=feed_schemas.Feed, status_code=status.HTTP_201_CREATED)
def create_feed(feed: feed_schemas.FeedCreate, db: Session = Depends(database.get_db)):
    # Validate URL
    if not feed.url or not feed.url.strip():
        raise HTTPException(status_code=422, detail="Feed URL cannot be empty")
    try:
        db_feed = crud.create_feed(db, feed)
        return db_feed
    except IntegrityError as e:
        db.rollback()
        if "UNIQUE constraint failed" in str(e) or "unique constraint" in str(e).lower():
            raise HTTPException(status_code=400, detail="Feed with this URL already exists")
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error parsing feed: {e}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[feed_schemas.Feed])
def read_feeds(db: Session = Depends(database.get_db)):
    return crud.get_feeds(db)

@router.delete("/{feed_id}")
def delete_feed(feed_id: str, db: Session = Depends(database.get_db)):
    # Accept both int and UUID for test compatibility
    try:
        try:
            feed_key = int(feed_id)
        except ValueError:
            feed_key = uuid.UUID(feed_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    result = crud.delete_feed(db, feed_key)
    if result.get("ok"):
        return {"message": "Feed deleted successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.get("error", "Feed not found"))

@router.get("/{feed_id}/articles/", response_model=list[article_schemas.Article])
def get_articles_for_feed(feed_id: str, db: Session = Depends(database.get_db)):
    try:
        try:
            feed_key = int(feed_id)
        except ValueError:
            feed_key = uuid.UUID(feed_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    feed = db.query(models.Feed).filter_by(id=feed_key).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    return crud.get_articles_for_feed(db, feed_key)

@router.post("/{feed_id}/refresh")
def refresh_feed(feed_id: str, db: Session = Depends(database.get_db)):
    try:
        try:
            feed_key = int(feed_id)
        except ValueError:
            feed_key = uuid.UUID(feed_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    feed = db.query(models.Feed).filter_by(id=feed_key).first()
    if not feed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feed not found")
    result = fetch_and_save_articles_for_feed(feed, db)
    db.refresh(feed)
    return feed

@router.post("/parse-title")
async def parse_feed_title(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        from app.services.feed_parser import fetch_feed_title_and_url
        result = fetch_feed_title_and_url(url)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch feed title: {e}")

# Add the fetchFeedTitle endpoint that tests expect
@router.post("/fetchFeedTitle")
async def fetch_feed_title(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        from app.services.feed_parser import fetch_feed_title_and_url
        result = fetch_feed_title_and_url(url)
        # Ensure result is a dict with 'title' and 'url' keys
        if not isinstance(result, dict):
            # If the function returns a tuple, convert to dict
            if isinstance(result, tuple) and len(result) == 2:
                result = {"title": result[0], "url": result[1]}
            else:
                raise ValueError("Unexpected return type from fetch_feed_title_and_url")
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{feed_id}/move", response_model=feed_schemas.Feed)
def move_feed_to_folder(feed_id: str, data: dict = Body(...), db: Session = Depends(database.get_db)):
    try:
        try:
            feed_key = int(feed_id)
        except ValueError:
            feed_key = uuid.UUID(feed_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    target_folder_id = data.get("folder_id") or data.get("target_folder_id")
    feed = db.query(models.Feed).filter_by(id=feed_key).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    if target_folder_id is not None and target_folder_id != '':
        try:
            try:
                folder_key = int(target_folder_id)
            except (ValueError, TypeError):
                folder_key = uuid.UUID(target_folder_id)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid folder id")
        folder = db.query(models.Folder).filter_by(id=folder_key).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Target folder not found")
        feed.folder_id = folder_key
    else:
        feed.folder_id = None
    db.commit()
    db.refresh(feed)
    return feed

@router.post("/cleanup-articles")
def cleanup_old_articles(data: dict = Body(...), db: Session = Depends(database.get_db)):
    days = data.get("days", 28)  # Default to 28 days
    if days not in [7, 14, 28]:
        raise HTTPException(status_code=400, detail="Days must be 7, 14, or 28")
    deleted_count = crud.delete_old_articles(db, days)
    return {"detail": f"Deleted {deleted_count} articles older than {days} days"}
