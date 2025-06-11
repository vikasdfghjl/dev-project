# Documentation endpoint for RSS Reader app walkthrough
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_app_documentation():
    """
    Get comprehensive documentation walkthrough for the FluxReader application.
    This provides a complete guide on how to use the FluxReader API and features.
    """
    return {
        "title": "FluxReader - Complete Documentation Guide",
        "version": "1.0.0",
        "description": "A comprehensive guide to using the FluxReader application",
        "sections": [
            {
                "title": "Getting Started",
                "content": {
                    "overview": "FluxReader is a modern, full-stack application that allows you to manage RSS feeds, organize them into folders, and read articles in a clean interface.",
                    "quick_start": [
                        "1. Add your first RSS feed using POST /api/v1/feeds/",
                        "2. Organize feeds into folders with POST /api/v1/folders/",
                        "3. View articles from your feeds using GET /api/v1/feeds/{feed_id}/articles/",
                        "4. Mark articles as read/unread and manage your reading list",
                    ],
                    "base_url": "http://localhost:8000/api/v1",
                },
            },
            {
                "title": "Feed Management",
                "content": {
                    "description": "Manage your RSS feeds - add, delete, refresh, and organize them",
                    "endpoints": [
                        {
                            "method": "GET",
                            "path": "/feeds/",
                            "description": "List all your RSS feeds",
                            "example_response": {
                                "feeds": [
                                    {
                                        "id": "1",
                                        "title": "Tech News",
                                        "url": "https://example.com/rss",
                                        "folder_id": "1",
                                        "created_at": "2025-06-11T10:00:00Z",
                                    }
                                ]
                            },
                        },
                        {
                            "method": "POST",
                            "path": "/feeds/",
                            "description": "Add a new RSS feed",
                            "example_request": {
                                "url": "https://example.com/feed.xml",
                                "name": "My Tech Blog",
                                "folder_id": "1",
                            },
                            "example_response": {
                                "id": "2",
                                "title": "My Tech Blog",
                                "url": "https://example.com/feed.xml",
                                "folder_id": "1",
                            },
                        },
                        {
                            "method": "POST",
                            "path": "/feeds/fetchFeedTitle",
                            "description": "Preview feed title before adding",
                            "example_request": {"url": "https://example.com/feed.xml"},
                            "example_response": {
                                "title": "Example Tech Blog",
                                "url": "https://example.com/feed.xml",
                            },
                        },
                        {
                            "method": "POST",
                            "path": "/feeds/{feed_id}/refresh",
                            "description": "Manually refresh a specific feed to get latest articles",
                            "example_response": {
                                "message": "Feed refreshed successfully",
                                "articles_count": 5,
                            },
                        },
                        {
                            "method": "DELETE",
                            "path": "/feeds/{feed_id}",
                            "description": "Delete a feed and all its articles",
                            "example_response": {
                                "message": "Feed deleted successfully"
                            },
                        },
                    ],
                },
            },
            {
                "title": "Folder Organization",
                "content": {
                    "description": "Organize your feeds into folders for better management",
                    "endpoints": [
                        {
                            "method": "GET",
                            "path": "/folders/",
                            "description": "List all folders with their feeds",
                            "example_response": {
                                "folders": [
                                    {
                                        "id": "1",
                                        "name": "Technology",
                                        "feeds": [
                                            {
                                                "id": "1",
                                                "title": "Tech News",
                                                "url": "https://example.com/rss",
                                            }
                                        ],
                                    }
                                ]
                            },
                        },
                        {
                            "method": "POST",
                            "path": "/folders/",
                            "description": "Create a new folder",
                            "example_request": {"name": "News"},
                            "example_response": {
                                "id": "2",
                                "name": "News",
                                "feeds": [],
                            },
                        },
                        {
                            "method": "PUT",
                            "path": "/folders/{folder_id}",
                            "description": "Rename a folder",
                            "example_request": {"name": "Tech News & Updates"},
                        },
                        {
                            "method": "PATCH",
                            "path": "/feeds/{feed_id}/move",
                            "description": "Move a feed to a different folder",
                            "example_request": {"folder_id": "2"},
                        },
                    ],
                },
            },
            {
                "title": "Reading Articles",
                "content": {
                    "description": "Access and manage articles from your RSS feeds",
                    "endpoints": [
                        {
                            "method": "GET",
                            "path": "/feeds/{feed_id}/articles/",
                            "description": "Get all articles from a specific feed",
                            "parameters": {
                                "query_params": [
                                    "limit: Maximum number of articles to return",
                                    "offset: Number of articles to skip",
                                    "unread_only: Show only unread articles (true/false)",
                                ]
                            },
                            "example_response": {
                                "articles": [
                                    {
                                        "id": "1",
                                        "title": "Latest Tech Trends",
                                        "content": "Article content here...",
                                        "url": "https://example.com/article-1",
                                        "published_at": "2025-06-11T09:00:00Z",
                                        "is_read": False,
                                        "feed_id": "1",
                                    }
                                ],
                                "total_count": 25,
                                "unread_count": 10,
                            },
                        }
                    ],
                    "features": [
                        "Articles are automatically fetched when feeds are refreshed",
                        "Mark articles as read/unread",
                        "Filter by read status",
                        "Pagination support for large article lists",
                        "Full article content extraction when possible",
                    ],
                },
            },
            {
                "title": "System Status & Health",
                "content": {
                    "description": "Monitor the health and status of your FluxReader system",
                    "endpoints": [
                        {
                            "method": "GET",
                            "path": "/status/",
                            "description": "Comprehensive system health check",
                            "example_response": {
                                "status": "healthy",
                                "database": {
                                    "status": "healthy",
                                    "message": "Database connection successful",
                                },
                                "api": {
                                    "status": "healthy",
                                    "message": "API service is running",
                                },
                            },
                        },
                        {
                            "method": "GET",
                            "path": "/status/simple",
                            "description": "Simple health check for monitoring",
                        },
                        {
                            "method": "GET",
                            "path": "/status/database",
                            "description": "Database connection status only",
                        },
                    ],
                },
            },
            {
                "title": "Common Workflows",
                "content": {
                    "workflows": [
                        {
                            "name": "Setting up your first feed",
                            "steps": [
                                '1. Create a folder: POST /api/v1/folders/ with {"name": "Tech News"}',
                                '2. Preview feed: POST /api/v1/feeds/fetchFeedTitle with {"url": "https://example.com/feed.xml"}',
                                '3. Add feed: POST /api/v1/feeds/ with {"url": "https://example.com/feed.xml", "name": "Tech Blog", "folder_id": "1"}',
                                "4. Refresh feed: POST /api/v1/feeds/1/refresh",
                                "5. Read articles: GET /api/v1/feeds/1/articles/",
                            ],
                        },
                        {
                            "name": "Organizing existing feeds",
                            "steps": [
                                "1. List current feeds: GET /api/v1/feeds/",
                                "2. Create new folders: POST /api/v1/folders/ for each category",
                                "3. Move feeds to folders: PATCH /api/v1/feeds/{feed_id}/move",
                                "4. View organized structure: GET /api/v1/folders/",
                            ],
                        },
                        {
                            "name": "Daily reading routine",
                            "steps": [
                                "1. Check system status: GET /api/v1/status/simple",
                                "2. Refresh all feeds (or use automatic refresh)",
                                "3. View unread articles by folder: GET /api/v1/folders/",
                                "4. Read articles: GET /api/v1/feeds/{feed_id}/articles/?unread_only=true",
                                "5. Mark articles as read as you go",
                            ],
                        },
                    ]
                },
            },
            {
                "title": "Best Practices",
                "content": {
                    "tips": [
                        "Use descriptive folder names to organize feeds by topic or priority",
                        "Regularly check feed health with refresh endpoints",
                        "Use the fetchFeedTitle endpoint to preview feeds before adding",
                        "Monitor system health with /status/ endpoints",
                        "Use pagination for feeds with many articles",
                        "Set up automatic feed refresh intervals based on your reading habits",
                    ],
                    "error_handling": [
                        "Always check HTTP status codes in responses",
                        "Handle network timeouts gracefully when fetching feeds",
                        "Use the database status endpoint to verify connectivity",
                        "Implement retry logic for failed feed refreshes",
                    ],
                },
            },
            {
                "title": "API Reference",
                "content": {
                    "interactive_docs": "For interactive API testing, visit /docs (Swagger UI) or /redoc",
                    "base_url": "http://localhost:8000/api/v1",
                    "content_type": "application/json",
                    "authentication": "Currently no authentication required (future feature)",
                    "rate_limiting": "No rate limiting implemented (suitable for personal use)",
                },
            },
        ],
        "generated_at": "2025-06-11T00:00:00Z",
        "support": {
            "github": "Check the project README for setup instructions",
            "swagger_ui": "/docs",
            "redoc": "/redoc",
        },
    }
