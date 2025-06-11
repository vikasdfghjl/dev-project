# Database session management
import logging
import sys
import time

from app.core.config import settings
from sqlalchemy import create_engine, text
from sqlalchemy.exc import DatabaseError, OperationalError, SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check if settings loaded successfully
if settings is None:
    logger.error("❌ Cannot initialize database - configuration not available")
    SQLALCHEMY_DATABASE_URL = None
else:
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Database connection retry configuration
MAX_RETRIES = 5
RETRY_DELAY = 2  # seconds


def create_database_engine():
    """Create database engine with proper error handling and retries"""
    if SQLALCHEMY_DATABASE_URL is None:
        logger.error("❌ Cannot create database engine - DATABASE_URL not configured")
        logger.error("💡 Please check your .env file or environment variables")
        raise DatabaseError("DATABASE_URL configuration missing")

    logger.info(
        f"Attempting to connect to database: {SQLALCHEMY_DATABASE_URL.split('@')[-1] if '@' in SQLALCHEMY_DATABASE_URL else 'Local database'}"
    )

    try:
        # Create engine with connection pooling and timeouts
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,  # Validate connections before use
            pool_recycle=300,  # Recycle connections every 5 minutes
            connect_args=(
                {
                    "connect_timeout": 10,  # 10 second connection timeout
                }
                if "postgresql" in SQLALCHEMY_DATABASE_URL
                else {}
            ),
        )

        # Test the connection
        test_database_connection(engine)
        logger.info("✅ Database connection established successfully")
        return engine

    except OperationalError as e:
        logger.error(f"❌ Database connection failed - Operational Error: {str(e)}")
        handle_database_connection_error(e)
        raise
    except DatabaseError as e:
        logger.error(f"❌ Database connection failed - Database Error: {str(e)}")
        handle_database_connection_error(e)
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error connecting to database: {str(e)}")
        raise


def test_database_connection(engine, max_retries=MAX_RETRIES):
    """Test database connection with retries"""
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(
                f"🔍 Testing database connection (attempt {attempt}/{max_retries})..."
            )
            with engine.connect() as connection:
                # Test with a simple query
                result = connection.execute(text("SELECT 1"))
                result.fetchone()
                logger.info("✅ Database connection test successful")
                return True

        except OperationalError as e:
            if attempt < max_retries:
                logger.warning(
                    f"⚠️ Database connection test failed (attempt {attempt}/{max_retries}): {str(e)}"
                )
                logger.info(f"⏳ Retrying in {RETRY_DELAY} seconds...")
                time.sleep(RETRY_DELAY)
            else:
                logger.error(
                    f"❌ Database connection test failed after {max_retries} attempts"
                )
                raise
        except Exception as e:
            logger.error(f"❌ Unexpected error during connection test: {str(e)}")
            raise


def handle_database_connection_error(error):
    """Handle and log specific database connection errors with helpful messages"""
    error_str = str(error).lower()

    if "connection refused" in error_str or "could not connect" in error_str:
        logger.error("🔌 Database server is not running or not accessible")
        logger.error("💡 Possible solutions:")
        logger.error("   - Check if PostgreSQL/database server is running")
        logger.error("   - Verify database host and port in configuration")
        logger.error("   - Check firewall settings")

    elif (
        "authentication failed" in error_str
        or "password authentication failed" in error_str
    ):
        logger.error("🔐 Database authentication failed")
        logger.error("💡 Possible solutions:")
        logger.error("   - Check database username and password")
        logger.error("   - Verify DATABASE_URL configuration")
        logger.error("   - Ensure database user has proper permissions")

    elif "database" in error_str and "does not exist" in error_str:
        logger.error("🗄️ Database does not exist")
        logger.error("💡 Possible solutions:")
        logger.error("   - Create the database manually")
        logger.error("   - Check database name in DATABASE_URL")
        logger.error("   - Run database initialization scripts")

    elif "timeout" in error_str or "timed out" in error_str:
        logger.error("⏱️ Database connection timeout")
        logger.error("💡 Possible solutions:")
        logger.error("   - Check network connectivity")
        logger.error("   - Increase connection timeout")
        logger.error("   - Verify database server is responding")

    elif "permission denied" in error_str:
        logger.error("🚫 Database permission denied")
        logger.error("💡 Possible solutions:")
        logger.error("   - Check database user permissions")
        logger.error("   - Verify pg_hba.conf settings (for PostgreSQL)")
        logger.error("   - Contact database administrator")

    else:
        logger.error(f"❓ Unknown database error: {error}")
        logger.error("💡 General troubleshooting:")
        logger.error("   - Check database server status")
        logger.error("   - Verify DATABASE_URL configuration")
        logger.error("   - Check application logs for more details")


# Create the engine with error handling
try:
    engine = create_database_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    logger.critical(f"💥 Failed to initialize database engine: {str(e)}")
    logger.critical(
        "🛑 Database connection failed, creating fallback Base for graceful degradation"
    )
    # Don't exit here, let the application handle the error
    engine = None
    SessionLocal = None
    # Create a fallback Base class so models can still be imported
    Base = declarative_base()


def get_db():
    """Get database session with proper error handling"""
    if SessionLocal is None:
        logger.error(
            "❌ Database session factory not initialized - check database connection"
        )
        raise DatabaseError("Database connection not available")

    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"❌ Database session error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def health_check_database():
    """Check if database is accessible for health checks"""
    if engine is None:
        return False, "Database engine not initialized"

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            return True, "Database connection healthy"
    except Exception as e:
        logger.warning(f"Database health check failed: {str(e)}")
        return False, f"Database connection failed: {str(e)}"
