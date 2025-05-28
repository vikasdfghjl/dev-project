# Background tasks service
from app.db import crud, models, database
from sqlalchemy.orm import Session
import time
import threading
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BackgroundTaskManager:
    def __init__(self):
        self.is_running = False
        self.thread = None
        
    def start(self, app):
        """Start the background task manager"""
        if self.is_running:
            return
            
        self.is_running = True
        self.thread = threading.Thread(target=self._run_background_tasks, daemon=True)
        self.thread.start()
        logger.info("Background task manager started")
    
    def stop(self):
        """Stop the background task manager"""
        self.is_running = False
        if self.thread:
            self.thread.join()
        logger.info("Background task manager stopped")
    
    def _run_background_tasks(self):
        """Main loop for background tasks"""
        last_refresh = 0
        last_cleanup = 0
        
        while self.is_running:
            try:
                current_time = time.time()
                
                with database.SessionLocal() as db:
                    settings = crud.get_settings(db)
                    
                    # Check if it's time to refresh feeds
                    refresh_interval = settings.refresh_interval_minutes * 60  # Convert to seconds
                    if current_time - last_refresh >= refresh_interval:
                        self._refresh_all_feeds(db)
                        last_refresh = current_time
                    
                    # Check if it's time to cleanup articles (run cleanup every 24 hours)
                    cleanup_interval = 24 * 60 * 60  # 24 hours in seconds
                    if settings.auto_cleanup_enabled and (current_time - last_cleanup >= cleanup_interval):
                        self._auto_cleanup_articles(db, settings.auto_cleanup_days)
                        last_cleanup = current_time
                
                # Sleep for 60 seconds before next check
                time.sleep(60)
                
            except Exception as e:
                logger.error(f"Error in background task: {e}")
                time.sleep(60)  # Wait before retrying
    
    def _refresh_all_feeds(self, db: Session):
        """Refresh all feeds"""
        from app.services.feed_parser import fetch_and_save_articles_for_feed
        
        feeds = db.query(models.Feed).all()
        logger.info(f"Starting feed refresh for {len(feeds)} feeds")
        
        for feed in feeds:
            try:
                result = fetch_and_save_articles_for_feed(feed, db)
                logger.info(f"Feed {feed.id} ({feed.title}): {result}")
            except Exception as e:
                logger.error(f"Error refreshing feed {feed.id}: {e}")
    
    def _auto_cleanup_articles(self, db: Session, days: int):
        """Automatically cleanup old articles"""
        try:
            deleted_count = crud.delete_old_articles(db, days)
            logger.info(f"Auto cleanup: deleted {deleted_count} articles older than {days} days")
        except Exception as e:
            logger.error(f"Error during auto cleanup: {e}")

# Global instance
background_manager = BackgroundTaskManager()
