# Status endpoint for backend health checks
import os
import platform
import sys
from datetime import datetime

import psutil
from app.db.database import health_check_database
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class DatabaseStatus(BaseModel):
    """Database connectivity status"""

    connected: bool
    message: str
    response_time_ms: float | None = None


class SystemStatus(BaseModel):
    """System information"""

    python_version: str
    platform: str
    architecture: str
    os_name: str
    cpu_cores: int | None = None
    total_memory_gb: float
    available_memory_gb: float
    load_average_1m: float | None = None
    load_average_5m: float | None = None
    load_average_15m: float | None = None


class HealthStatus(BaseModel):
    """Overall application health status"""

    status: str  # "healthy", "degraded", "unhealthy"
    timestamp: datetime
    uptime_seconds: float
    version: str
    database: DatabaseStatus
    system: SystemStatus


# Track application start time for uptime calculation
_app_start_time = datetime.now()


@router.get("/", response_model=HealthStatus, summary="Get backend status")
async def get_status():
    """
    Get comprehensive backend status including:
    - Overall health status
    - Database connectivity
    - System information
    - Uptime
    """
    try:
        # Check database connectivity
        db_start_time = datetime.now()
        db_connected, db_message = health_check_database()
        db_end_time = datetime.now()
        db_response_time = (db_end_time - db_start_time).total_seconds() * 1000

        database_status = DatabaseStatus(
            connected=db_connected,
            message=db_message,
            response_time_ms=db_response_time if db_connected else None,
        )

        # Get memory information
        memory = psutil.virtual_memory()
        total_memory_gb = memory.total / (1024**3)
        available_memory_gb = memory.available / (1024**3)

        # Get load averages (Unix-like systems only)
        load_avg_1m = None
        load_avg_5m = None
        load_avg_15m = None
        try:
            if hasattr(os, "getloadavg"):
                load_avg_1m, load_avg_5m, load_avg_15m = os.getloadavg()
        except (OSError, AttributeError):
            # Load averages not available on Windows
            pass

        # Get system information
        system_status = SystemStatus(
            python_version=f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
            platform=platform.system(),
            architecture=platform.machine(),
            os_name=platform.platform(),
            cpu_cores=os.cpu_count(),
            total_memory_gb=total_memory_gb,
            available_memory_gb=available_memory_gb,
            load_average_1m=load_avg_1m,
            load_average_5m=load_avg_5m,
            load_average_15m=load_avg_15m,
        )
        # Calculate uptime
        uptime = (datetime.now() - _app_start_time).total_seconds()

        # Determine overall status
        if db_connected:
            overall_status = "ok"
        else:
            overall_status = "unhealthy"

        return HealthStatus(
            status=overall_status,
            timestamp=datetime.now(),
            uptime_seconds=uptime,
            version="1.0.0",  # You can read this from pyproject.toml if needed
            database=database_status,
            system=system_status,
        )

    except Exception as e:
        # If any unexpected error occurs, return unhealthy status
        return HealthStatus(
            status="unhealthy",
            timestamp=datetime.now(),
            uptime_seconds=(datetime.now() - _app_start_time).total_seconds(),
            version="1.0.0",
            database=DatabaseStatus(
                connected=False, message=f"Error checking database: {str(e)}"
            ),
            system=SystemStatus(
                python_version=f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
                platform=platform.system(),
                architecture=platform.machine(),
                os_name=platform.platform(),
                cpu_cores=os.cpu_count(),
                total_memory_gb=0.0,
                available_memory_gb=0.0,
            ),
        )


@router.get("/simple", summary="Simple health check")
async def get_simple_status():
    """
    Simple health check endpoint that returns basic status.
    Useful for load balancers and monitoring systems.
    """
    try:
        db_connected, db_message = health_check_database()

        if db_connected:
            return {
                "status": "ok",
                "timestamp": datetime.now().isoformat(),
                "database": "connected",
            }
        else:
            raise HTTPException(
                status_code=503,
                detail={
                    "status": "error",
                    "timestamp": datetime.now().isoformat(),
                    "database": "disconnected",
                    "message": db_message,
                },
            )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "error",
                "timestamp": datetime.now().isoformat(),
                "message": str(e),
            },
        )


@router.get("/database", response_model=DatabaseStatus, summary="Database status only")
async def get_database_status():
    """
    Get database connectivity status only.
    """
    try:
        db_start_time = datetime.now()
        db_connected, db_message = health_check_database()
        db_end_time = datetime.now()
        db_response_time = (db_end_time - db_start_time).total_seconds() * 1000

        return DatabaseStatus(
            connected=db_connected,
            message=db_message,
            response_time_ms=db_response_time if db_connected else None,
        )
    except Exception as e:
        return DatabaseStatus(
            connected=False, message=f"Error checking database: {str(e)}"
        )
