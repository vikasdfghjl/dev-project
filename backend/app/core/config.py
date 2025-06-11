# App configuration using pydantic-settings
import logging
import sys
from typing import Optional

from pydantic import ValidationError
from pydantic_settings import BaseSettings

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    DATABASE_URL: str

    class Config:
        env_file = ".env"


def load_settings() -> Optional[Settings]:
    """Load settings with proper error handling and helpful messages"""
    try:
        logger.info("🔧 Loading application configuration...")
        settings = Settings()
        logger.info("✅ Configuration loaded successfully")
        return settings
    except ValidationError as e:
        logger.error("❌ Configuration validation failed!")
        logger.error("💡 Missing required configuration:")

        for error in e.errors():
            field = error.get("loc", ["unknown"])[0]
            error_type = error.get("type", "unknown")

            if field == "DATABASE_URL" and error_type == "missing":
                logger.error("🗄️  DATABASE_URL is required but not found")
                logger.error("💡 Possible solutions:")
                logger.error("   - Create/update .env file in backend directory")
                logger.error(
                    "   - Add: DATABASE_URL=postgresql://username:password@host:port/database"
                )
                logger.error("   - Or set DATABASE_URL environment variable")
                logger.error(
                    "   - Example: DATABASE_URL=postgresql://postgres:password@localhost/rssdb"
                )
            else:
                logger.error(f"❓ {field}: {error.get('msg', 'validation error')}")

        logger.error("🛑 Application cannot start without proper configuration")
        logger.error("📖 Please check the documentation for setup instructions")
        return None
    except Exception as e:
        logger.error(f"❌ Unexpected configuration error: {str(e)}")
        return None


# Try to load settings
settings = load_settings()

if settings is None:
    logger.critical("💥 Failed to load configuration - exiting")
    # Don't exit immediately, let the calling code handle this gracefully
    # This allows status endpoints to still work and show configuration errors
