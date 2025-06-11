# backend/app/tests/api/v1/endpoints/test_status.py
import re
from datetime import datetime

# Assuming APP_VERSION is accessible via app.main or a config module
# If app.main.APP_VERSION is not the correct way, this will need adjustment
from app.main import APP_VERSION
from fastapi.testclient import TestClient


def assert_iso_timestamp(timestamp_str: str):
    """Helper to assert that a string is a valid ISO 8601 timestamp."""
    try:
        datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        return True
    except (ValueError, TypeError):
        return False


def test_get_simple_status(client: TestClient):
    """Test GET /api/v1/status/simple endpoint."""
    response = client.get("/api/v1/status/simple")
    assert response.status_code == 200
    data = response.json()
    assert (
        data["status"] == "ok"
    )  # Changed from "OK" to "ok" to match example in STATUS_ENDPOINTS.md
    assert "timestamp" in data
    assert assert_iso_timestamp(data["timestamp"])
    assert data["database"] == "connected"


def test_get_full_status(client: TestClient):
    """Test GET /api/v1/status/ endpoint."""
    response = client.get("/api/v1/status/")
    assert response.status_code == 200
    data = response.json()

    # Check top-level keys
    expected_top_level_keys = [
        "status",
        "timestamp",
        "uptime_seconds",
        "version",
        "database",
        "system",
    ]
    for key in expected_top_level_keys:
        assert key in data

    # Validate specific fields
    assert data["status"] == "ok"
    assert assert_iso_timestamp(data["timestamp"])
    assert (
        isinstance(data["uptime_seconds"], (int, float)) and data["uptime_seconds"] >= 0
    )
    assert data["version"] == APP_VERSION

    # Validate "database" sub-keys
    assert data["database"]["connected"] is True
    assert isinstance(data["database"]["message"], str)
    assert (
        isinstance(data["database"]["response_time_ms"], (int, float))
        and data["database"]["response_time_ms"] >= 0
    )

    # Validate "system" sub-keys (presence and type)
    expected_system_keys = [
        "python_version",
        "platform",
        "architecture",
        "cpu_cores",
        "total_memory_gb",
        "available_memory_gb",
        "load_average_1m",
        "load_average_5m",
        "load_average_15m",
    ]
    for key in expected_system_keys:
        assert key in data["system"]

    assert isinstance(data["system"]["python_version"], str)
    assert isinstance(data["system"]["platform"], str)
    # cpu_cores can be None if detection fails, so allow None or int
    assert data["system"]["cpu_cores"] is None or isinstance(
        data["system"]["cpu_cores"], int
    )
    assert isinstance(data["system"]["total_memory_gb"], (int, float))
    assert isinstance(data["system"]["available_memory_gb"], (int, float))
    # load averages can be None if not available (e.g. Windows)
    assert data["system"]["load_average_1m"] is None or isinstance(
        data["system"]["load_average_1m"], float
    )
    assert data["system"]["load_average_5m"] is None or isinstance(
        data["system"]["load_average_5m"], float
    )
    assert data["system"]["load_average_15m"] is None or isinstance(
        data["system"]["load_average_15m"], float
    )


def test_get_database_status(client: TestClient):
    """Test GET /api/v1/status/database endpoint."""
    response = client.get("/api/v1/status/database")
    assert response.status_code == 200
    data = response.json()

    expected_keys = ["connected", "message", "response_time_ms"]
    for key in expected_keys:
        assert key in data

    assert data["connected"] is True
    assert isinstance(data["message"], str)
    assert (
        isinstance(data["response_time_ms"], (int, float))
        and data["response_time_ms"] >= 0
    )


# Test for database unavailable (Optional - skipping for now as mocking DB connection is complex)
# def test_get_simple_status_db_unavailable(client: TestClient):
#     # This test would require mocking the database connection to simulate unavailability
#     # For now, we assume the happy path where the database is available
#     pass
