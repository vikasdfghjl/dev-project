# Backend Status Endpoints

The backend provides comprehensive status and health check endpoints to monitor the application's health and database connectivity.

## Available Endpoints

### 1. Full Status Check

**Endpoint:** `GET /api/v1/status/`

**Description:** Returns comprehensive backend status including database connectivity, system information, and uptime.

**Response Example:**

```json
{
  "status": "healthy",
  "timestamp": "2025-05-29T14:09:03.879423",
  "uptime_seconds": 31.006709,
  "version": "1.0.0",
  "database": {
    "connected": true,
    "message": "Database connection healthy",
    "response_time_ms": 1.039
  },
  "system": {
    "python_version": "3.12.0",
    "platform": "Windows",
    "architecture": "AMD64",
    "os_name": "Windows-10-10.0.22631-SP0",
    "cpu_count": 8
  }
}
```

**Status Values:**

- `healthy`: All systems operational
- `degraded`: Some issues but service available
- `unhealthy`: Critical issues, service may be unavailable

### 2. Simple Health Check

**Endpoint:** `GET /api/v1/status/simple`

**Description:** Lightweight health check endpoint suitable for load balancers and monitoring systems.

**Success Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2025-05-29T14:09:14.641861",
  "database": "connected"
}
```

**Error Response (503):**

```json
{
  "status": "error",
  "timestamp": "2025-05-29T14:09:14.641861",
  "database": "disconnected",
  "message": "Database connection failed: ..."
}
```

### 3. Database Status Only

**Endpoint:** `GET /api/v1/status/database`

**Description:** Returns only database connectivity status and response time.

**Response Example:**

```json
{
  "connected": true,
  "message": "Database connection healthy",
  "response_time_ms": 1.001
}
```

## Usage Examples

### Using curl

```bash
# Full status check
curl http://localhost:8000/api/v1/status/

# Simple health check
curl http://localhost:8000/api/v1/status/simple

# Database status only
curl http://localhost:8000/api/v1/status/database
```

### Using Python requests

```python
import requests

# Full status check
response = requests.get('http://localhost:8000/api/v1/status/')
status_data = response.json()

if status_data['status'] == 'healthy':
    print("Backend is healthy")
else:
    print(f"Backend status: {status_data['status']}")

# Simple health check for monitoring
response = requests.get('http://localhost:8000/api/v1/status/simple')
if response.status_code == 200:
    print("Service is up")
else:
    print("Service is down")
```

### Docker Health Check

You can use the simple endpoint for Docker health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/status/simple || exit 1
```

### Kubernetes Readiness and Liveness Probes

```yaml
spec:
  containers:
  - name: backend
    livenessProbe:
      httpGet:
        path: /api/v1/status/simple
        port: 8000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /api/v1/status/database
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
```

## Monitoring Integration

### Prometheus Monitoring

The endpoints can be scraped by Prometheus for metrics:

- Response time monitoring
- Database connectivity status
- Application uptime tracking

### Grafana Dashboards

Create dashboards using:

- Status endpoint response times
- Database health over time
- System resource information

### Alerting

Set up alerts based on:

- HTTP 503 responses from `/status/simple`
- Database disconnection from `/status/database`
- High response times from any status endpoint

## Error Scenarios

The status endpoints handle various error scenarios gracefully:

1. **Database Connection Failed**: Returns appropriate error messages with troubleshooting hints
2. **Database Timeout**: Includes response time information
3. **System Errors**: Provides fallback system information
4. **Authentication Issues**: Detailed error messages for database auth problems

All endpoints are designed to never crash and always return meaningful status information.
