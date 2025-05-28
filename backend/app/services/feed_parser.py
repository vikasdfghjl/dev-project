from app.db import crud, models, database
from app.schemas.article import ArticleCreate
from sqlalchemy.orm import Session
import httpx
import feedparser
import time
import re
from fastapi import BackgroundTasks
from urllib.parse import urljoin, urlparse
from datetime import datetime
from email.utils import parsedate_to_datetime

# Placeholder for feed parser service

def standardize_date(date_str: str) -> str:
    """Convert various date formats to ISO format"""
    try:
        # Try parsing with email.utils (handles RFC822 format)
        dt = parsedate_to_datetime(date_str)
        return dt.isoformat()
    except:
        try:
            # Try parsing with feedparser's date handling
            dt = feedparser._parse_date(date_str)
            if dt:
                return dt.isoformat()
        except:
            pass
    # If all parsing fails, return current time
    return datetime.now().isoformat()

def extract_image_url(entry, base_url=None):
    """Extract image URL from RSS entry using multiple methods"""
    
    # Method 1: Check for enclosures (common in RSS)
    if hasattr(entry, 'enclosures') and entry.enclosures:
        for enclosure in entry.enclosures:
            if hasattr(enclosure, 'type') and enclosure.type and enclosure.type.startswith('image/'):
                return enclosure.href
    
    # Method 2: Check for media:content or media:thumbnail
    if hasattr(entry, 'media_content') and entry.media_content:
        for media in entry.media_content:
            if hasattr(media, 'type') and media.type and media.type.startswith('image/'):
                return media.get('url')
    
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        for thumb in entry.media_thumbnail:
            return thumb.get('url')
    
    # Method 3: Look for images in the content/summary HTML
    content_to_search = []
    if hasattr(entry, 'content') and entry.content:
        for content in entry.content:
            content_to_search.append(content.value)
    if hasattr(entry, 'summary') and entry.summary:
        content_to_search.append(entry.summary)
    if hasattr(entry, 'description') and entry.description:
        content_to_search.append(entry.description)
    
    for content in content_to_search:
        if content:
            # Look for img tags with more flexible matching
            img_matches = re.finditer(r'<img[^>]+src=["\'](.*?)["\'][^>]*>', content, re.IGNORECASE)
            for match in img_matches:
                img_url = match.group(1)
                # Skip data URLs and small icons
                if img_url.startswith('data:') or 'icon' in img_url.lower():
                    continue
                # Convert relative URLs to absolute if base_url is provided
                if base_url and not img_url.startswith(('http://', 'https://')):
                    img_url = urljoin(base_url, img_url)
                return img_url
    
    # Method 4: Check for image field in entry
    if hasattr(entry, 'image') and entry.image:
        if isinstance(entry.image, dict) and 'href' in entry.image:
            return entry.image['href']
        elif isinstance(entry.image, str):
            return entry.image
    
    # Method 5: Check for itunes:image
    if hasattr(entry, 'itunes_image') and entry.itunes_image:
        if isinstance(entry.itunes_image, dict) and 'href' in entry.itunes_image:
            return entry.itunes_image['href']
    
    # Method 6: Check for og:image meta tag in content
    for content in content_to_search:
        if content:
            og_match = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\'][^>]*>', content, re.IGNORECASE)
            if og_match:
                img_url = og_match.group(1)
                if base_url and not img_url.startswith(('http://', 'https://')):
                    img_url = urljoin(base_url, img_url)
                return img_url
    
    # Method 7: Check for twitter:image meta tag in content
    for content in content_to_search:
        if content:
            twitter_match = re.search(r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\'](.*?)["\'][^>]*>', content, re.IGNORECASE)
            if twitter_match:
                img_url = twitter_match.group(1)
                if base_url and not img_url.startswith(('http://', 'https://')):
                    img_url = urljoin(base_url, img_url)
                return img_url
    
    return None

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
    
    # Extract base URL for relative image URL resolution
    base_url = None
    if hasattr(parsed.feed, 'link') and parsed.feed.link:
        parsed_url = urlparse(parsed.feed.link)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
    
    for entry in parsed.entries:
        link = entry.get("link")
        # Deduplicate by feed_id + link
        exists = db.query(models.Article).filter_by(feed_id=feed.id, link=link).first()
        if exists:
            continue
        
        # Extract image URL
        image_url = extract_image_url(entry, base_url)
        
        # Get and standardize the publication date
        pub_date = entry.get("published", "")
        if not pub_date and hasattr(entry, 'updated'):
            pub_date = entry.updated
        standardized_date = standardize_date(pub_date)
        
        # Get content from the most appropriate field
        content = None
        if hasattr(entry, 'content') and entry.content:
            content = entry.content[0].value
        elif hasattr(entry, 'summary'):
            content = entry.summary
        elif hasattr(entry, 'description'):
            content = entry.description
        
        article = ArticleCreate(
            title=entry.get("title", "No title"),
            content=content or "",
            link=link,
            pub_date=standardized_date,
            image_url=image_url,
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
