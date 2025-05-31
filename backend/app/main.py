from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.api import router as api_v1_router
from app.db.database import Base, engine, health_check_database
from app.services.background_tasks import background_manager
import logging

# Application version
APP_VERSION = "1.0.0"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database tables if engine is available
if engine is not None:
    try:
        logger.info("🔧 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {str(e)}")
else:
    logger.warning("⚠️ Database engine not available - skipping table creation")

app = FastAPI(
    title="RSS Reader API",
    description="Backend API for RSS feed management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify service and database status"""
    try:
        # Check database connection
        db_healthy, db_message = health_check_database()
        
        return {
            "status": "healthy" if db_healthy else "degraded",
            "database": {
                "status": "healthy" if db_healthy else "unhealthy",
                "message": db_message
            },
            "api": {
                "status": "healthy",
                "message": "API service is running"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "database": {
                    "status": "unknown",
                    "message": "Unable to check database status"
                },
                "api": {
                    "status": "healthy",
                    "message": "API service is running"
                }
            }
        )

# Add database status middleware
@app.middleware("http")
async def check_database_connection(request, call_next):
    """Middleware to check database connection for API requests"""
    # Skip database check for health endpoint and static files
    if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)
    
    # Check if database is available for API endpoints
    if request.url.path.startswith("/api/"):
        if engine is None:
            logger.error("❌ Database not available for API request")
            return JSONResponse(
                status_code=503,
                content={
                    "error": "Service Unavailable",
                    "detail": "Database connection not available. Please check database status.",
                    "type": "database_unavailable"
                }
            )
    
    return await call_next(request)

app.include_router(api_v1_router, prefix="/api/v1")

@app.on_event("startup")
async def start_background_tasks():
    """Start background tasks if database is available"""
    if engine is not None:
        try:
            logger.info("🚀 Starting background task manager...")
            background_manager.start(app)
            logger.info("✅ Background tasks started successfully")
        except Exception as e:
            logger.error(f"❌ Failed to start background tasks: {str(e)}")
    else:
        logger.warning("⚠️ Background tasks not started - database not available")

@app.on_event("shutdown")
async def stop_background_tasks():
    """Stop background tasks gracefully"""
    try:
        logger.info("🛑 Stopping background task manager...")
        background_manager.stop()
        logger.info("✅ Background tasks stopped successfully")
    except Exception as e:
        logger.error(f"❌ Error stopping background tasks: {str(e)}")
