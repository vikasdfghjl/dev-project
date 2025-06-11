# RSS Reader Monitoring

Simple monitoring setup using Prometheus and Grafana.

## Quick Start

```bash
# Start monitoring
docker compose up -d

# Access tools
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
```

## Configuration

Edit `config/prometheus.yml` to monitor your RSS Reader:

```yaml
- job_name: 'rss-backend'
  static_configs:
    - targets: ['your-rss-server:8000']  # Change this
```

Restart: `docker compose restart prometheus`

## Creating Dashboards

1. Open Grafana → "+" → "Dashboard"
2. Use Prometheus queries:
   - `up{job="rss-backend"}` - Service status
   - `prometheus_http_request_duration_seconds` - Response times

## Directory Structure

```
monitoring/
├── docker-compose.yml       # Main stack
├── setup.cmd               # Quick setup
├── config/                 # All configurations
│   ├── prometheus.yml      # Prometheus config
│   └── datasources/        # Grafana datasources
├── scripts/                # Utility scripts
└── docs/                   # Documentation
```

## Commands

```bash
docker compose ps          # Check status
docker compose logs -f     # View logs
docker compose down        # Stop all
```
