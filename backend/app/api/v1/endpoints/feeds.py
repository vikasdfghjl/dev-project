# Feed endpoints
from fastapi import APIRouter, Depends, status, HTTPException, Request, Body
from sqlalchemy.orm import Session
from app.db import crud, models, database
from app.schemas import feed as feed_schemas, article as article_schemas
from app.services.feed_parser import fetch_and_save_articles_for_feed
import httpx
import feedparser

router = APIRouter()

@router.post("/", response_model=feed_schemas.Feed)
def create_feed(feed: feed_schemas.FeedCreate, db: Session = Depends(database.get_db)):
    db_feed = crud.create_feed(db, feed)
    fetch_and_save_articles_for_feed(db_feed, db)
    return db_feed

@router.get("/", response_model=list[feed_schemas.Feed])
def read_feeds(db: Session = Depends(database.get_db)):
    return crud.get_feeds(db)

@router.delete("/{feed_id}")
def delete_feed(feed_id: int, db: Session = Depends(database.get_db)):
    result = crud.delete_feed(db, feed_id)
    if result.get("ok"):
        return {"detail": "Feed deleted"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.get("error", "Feed not found"))

@router.get("/{feed_id}/articles/", response_model=list[article_schemas.Article])
def get_articles_for_feed(feed_id: int, db: Session = Depends(database.get_db)):
    return crud.get_articles_for_feed(db, feed_id)

@router.post("/{feed_id}/refresh")
def refresh_feed(feed_id: int, db: Session = Depends(database.get_db)):
    feed = db.query(models.Feed).filter_by(id=feed_id).first()
    if not feed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feed not found")
    result = fetch_and_save_articles_for_feed(feed, db)
    return {"detail": result}

@router.post("/parse-title")
async def parse_feed_title(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10)
            resp.raise_for_status()
        parsed = feedparser.parse(resp.text)
        title = parsed.feed.get("title", "")
        return {"title": title}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch feed title: {e}")

@router.patch("/{feed_id}/move", response_model=feed_schemas.Feed)
def move_feed_to_folder(feed_id: int, data: dict = Body(...), db: Session = Depends(database.get_db)):
    target_folder_id = data.get("target_folder_id")
    feed = db.query(models.Feed).filter_by(id=feed_id).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    if target_folder_id is not None and target_folder_id != '':
        try:
            folder_id_int = int(target_folder_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid folder id")
        folder = db.query(models.Folder).filter_by(id=folder_id_int).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Target folder not found")
        feed.folder_id = folder_id_int
    else:
        feed.folder_id = None
    db.commit()
    db.refresh(feed)
    return feed

@router.post("/cleanup-articles")
def cleanup_old_articles(data: dict = Body(...), db: Session = Depends(database.get_db)):
    """Delete articles older than specified number of days"""
    days = data.get("days", 28)  # Default to 28 days
    
    # Validate days parameter
    if days not in [7, 14, 28]:
        raise HTTPException(status_code=400, detail="Days must be 7, 14, or 28")
    
    deleted_count = crud.delete_old_articles(db, days)
    return {"detail": f"Deleted {deleted_count} articles older than {days} days"}
