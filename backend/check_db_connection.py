#!/usr/bin/env python3
"""
Database connectivity check script
Run this before starting the main application to verify database connection
"""

import sys
import os
import logging
from pathlib import Path

# Add the app directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.database import health_check_database, engine
from app.core.config import settings

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Main function to check database connectivity"""
    logger.info("🔍 Starting database connectivity check...")
    
    # Display current configuration (without sensitive data)
    logger.info(f"📋 Database Configuration:")
    db_url = settings.DATABASE_URL
    if '@' in db_url:
        # Hide password from logs
        parts = db_url.split('@')
        user_part = parts[0].split('://')
        if len(user_part) > 1 and ':' in user_part[1]:
            user_part[1] = user_part[1].split(':')[0] + ':****'
        db_url_safe = user_part[0] + '://' + user_part[1] + '@' + parts[1]
    else:
        db_url_safe = db_url
    
    logger.info(f"   Database URL: {db_url_safe}")
    
    # Check if engine was created
    if engine is None:
        logger.error("❌ Database engine could not be created")
        logger.error("🛑 Application startup will fail")
        return False
    
    # Check database connectivity
    try:
        is_healthy, message = health_check_database()
        
        if is_healthy:
            logger.info("✅ Database connectivity check PASSED")
            logger.info(f"   Status: {message}")
            return True
        else:
            logger.error("❌ Database connectivity check FAILED")
            logger.error(f"   Error: {message}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Unexpected error during database check: {str(e)}")
        return False

def print_troubleshooting_guide():
    """Print troubleshooting guide for common database issues"""
    print("\n" + "="*60)
    print("🔧 DATABASE CONNECTION TROUBLESHOOTING GUIDE")
    print("="*60)
    print()
    print("1. 🔌 Connection Refused:")
    print("   - Ensure PostgreSQL/database server is running")
    print("   - Check if the database port is open (default: 5432)")
    print("   - Verify firewall settings")
    print()
    print("2. 🔐 Authentication Failed:")
    print("   - Check username and password in DATABASE_URL")
    print("   - Ensure database user exists and has proper permissions")
    print("   - For PostgreSQL, check pg_hba.conf settings")
    print()
    print("3. 🗄️ Database Does Not Exist:")
    print("   - Create the database manually:")
    print("     PostgreSQL: CREATE DATABASE your_db_name;")
    print("   - Check database name in DATABASE_URL")
    print()
    print("4. ⏱️ Connection Timeout:")
    print("   - Check network connectivity to database server")
    print("   - Verify database server is responding")
    print("   - Consider increasing connection timeout")
    print()
    print("5. 🏠 Local Development Setup:")
    print("   - Install PostgreSQL locally")
    print("   - Create a database for development")
    print("   - Update DATABASE_URL in your .env file")
    print()
    print("6. 🐳 Docker Development:")
    print("   - Ensure database container is running")
    print("   - Check Docker network connectivity")
    print("   - Verify database service name in docker-compose")
    print()
    print("📝 Example DATABASE_URL formats:")
    print("   PostgreSQL: postgresql://user:pass@localhost:5432/dbname")
    print("   SQLite: sqlite:///./app.db")
    print("="*60)

if __name__ == "__main__":
    success = main()
    
    if not success:
        print_troubleshooting_guide()
        sys.exit(1)
    else:
        logger.info("🚀 Database is ready - you can start the application")
        sys.exit(0)
