# Prometheus metrics endpoint
from fastapi import APIRouter, Response
from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST
from app.db.database import health_check_database
import psutil
import time
from datetime import datetime

router = APIRouter()

# Application metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status_code']
)

database_connection_errors = Counter(
    'database_connection_errors_total',
    'Total number of database connection errors'
)

active_feeds_count = Gauge(
    'active_feeds_count',
    'Number of active RSS feeds'
)

articles_scraped_total = Counter(
    'articles_scraped_total',
    'Total number of articles scraped from feeds'
)

database_query_duration = Histogram(
    'database_query_duration_seconds',
    'Time spent on database queries'
)

# System metrics
system_memory_usage = Gauge(
    'system_memory_usage_bytes',
    'System memory usage in bytes'
)

system_cpu_usage = Gauge(
    'system_cpu_usage_percent',
    'System CPU usage percentage'
)

database_status = Gauge(
    'database_connection_status',
    'Database connection status (1=connected, 0=disconnected)'
)

application_uptime_seconds = Gauge(
    'application_uptime_seconds',
    'Application uptime in seconds'
)

# Track application start time
_app_start_time = datetime.now()

@router.get("/metrics")
async def get_metrics():
    """
    Prometheus metrics endpoint.
    Returns metrics in Prometheus format for scraping.
    """
    # Update system metrics
    memory = psutil.virtual_memory()
    system_memory_usage.set(memory.used)
    
    cpu_percent = psutil.cpu_percent(interval=0.1)
    system_cpu_usage.set(cpu_percent)
    
    # Update database status
    db_connected, _ = health_check_database()
    database_status.set(1 if db_connected else 0)
    if not db_connected:
        database_connection_errors.inc()
    
    # Update application uptime
    uptime = (datetime.now() - _app_start_time).total_seconds()
    application_uptime_seconds.set(uptime)
    
    # TODO: Update feed count from database
    # This would require database access - implement when needed
    # active_feeds_count.set(get_feed_count_from_db())
    
    # Generate Prometheus format
    metrics_output = generate_latest()
    
    return Response(
        content=metrics_output,
        media_type=CONTENT_TYPE_LATEST
    )

def increment_http_requests(method: str, endpoint: str, status_code: int):
    """Helper function to increment HTTP request counter"""
    http_requests_total.labels(
        method=method,
        endpoint=endpoint,
        status_code=str(status_code)
    ).inc()

def increment_articles_scraped(count: int = 1):
    """Helper function to increment articles scraped counter"""
    articles_scraped_total.inc(count)

def observe_database_query_time(duration: float):
    """Helper function to observe database query duration"""
    database_query_duration.observe(duration)
