from app.db import crud, models, database
from app.schemas.article import ArticleCreate
from sqlalchemy.orm import Session
import httpx
import feedparser
import time
from fastapi import BackgroundTasks

# Placeholder for feed parser service

def fetch_and_save_articles_for_feed(feed: models.Feed, db: Session):
    # Fetch feed data
    try:
        response = httpx.get(feed.url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        # Optionally log error
        return f"Failed to fetch feed: {e}"
    parsed = feedparser.parse(response.text)
    new_articles = 0
    for entry in parsed.entries:
        link = entry.get("link")
        # Deduplicate by feed_id + link
        exists = db.query(models.Article).filter_by(feed_id=feed.id, link=link).first()
        if exists:
            continue
        article = ArticleCreate(
            title=entry.get("title", "No title"),
            content=entry.get("summary", ""),
            link=link,
            pub_date=entry.get("published", ""),
            feed_id=feed.id
        )
        crud.create_article(db, article)
        new_articles += 1
    return f"Fetched and saved {new_articles} new articles."

# Periodic background refresh for all feeds
def refresh_all_feeds(db: Session):
    feeds = db.query(models.Feed).all()
    results = []
    for feed in feeds:
        result = fetch_and_save_articles_for_feed(feed, db)
        results.append({"feed_id": feed.id, "result": result})
    return results

# FastAPI startup event to schedule periodic refresh
def schedule_periodic_refresh(app, interval_seconds=3600):
    def periodic():
        while True:
            with database.SessionLocal() as db:
                refresh_all_feeds(db)
            time.sleep(interval_seconds)
    import threading
    thread = threading.Thread(target=periodic, daemon=True)
    thread.start()

# In main.py, call schedule_periodic_refresh(app) in a startup event
