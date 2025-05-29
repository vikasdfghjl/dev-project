# Main API router for v1 endpoints
from fastapi import APIRouter
from .endpoints import feeds, folders, articles, settings, status

router = APIRouter()

router.include_router(status.router, prefix="/status", tags=["status"])
router.include_router(feeds.router, prefix="/feeds", tags=["feeds"])
router.include_router(folders.router, prefix="/folders", tags=["folders"])
router.include_router(articles.router, prefix="/articles", tags=["articles"])
router.include_router(settings.router, prefix="/settings", tags=["settings"])
