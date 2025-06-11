# 🚀 Quick Deployment Guide

This monitoring stack can be deployed on any server with Docker. Follow these simple steps:

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB RAM available
- Ports 3001 and 9090 available

## 🎯 1-Minute Setup

### Windows

```cmd
cd monitoring
setup.cmd
```

### Linux/Mac

```bash
cd monitoring
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
# Clone/copy the monitoring directory to your server
cd monitoring

# Copy environment file
cp .env.example .env

# Edit .env file with your settings
nano .env

# Start monitoring stack
docker compose up -d

# Check status
docker compose ps
```

## 🔧 Configuration

1. **Edit `.env` file** with your RSS Reader server details
2. **Update `prometheus/prometheus.yml`** to point to your RSS Reader instances
3. **Restart**: `docker compose restart`

## 📊 Access

- **Grafana**: http://your-server:3001 (admin/admin)
- **Prometheus**: http://your-server:9090

## 🔧 Common Tasks

```bash
# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop monitoring
docker compose down

# Update images
docker compose pull && docker compose up -d

# Backup data
docker run --rm -v monitoring-grafana-data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz -C /data .
```

## 🎛️ Configuration Files

- `docker-compose.yml` - Main deployment configuration
- `.env` - Environment variables and settings
- `prometheus/prometheus.yml` - Metrics collection configuration
- `grafana/provisioning/` - Auto-configuration for datasources only

## 🔍 Creating Dashboards

1. Open Grafana at http://your-server:3001
2. Login with admin/admin
3. Click "+" → "Dashboard" → "Add visualization"
4. Select "Prometheus" as datasource
5. Use queries to monitor your RSS Reader:
   - `up{job="rss-backend"}` - Service availability
   - `http_request_duration_seconds` - Response times
   - `http_requests_total` - Request counts

Just update the target URLs in `prometheus/prometheus.yml` to point to your RSS Reader instances.
