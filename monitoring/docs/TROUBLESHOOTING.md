# Troubleshooting

Common issues and solutions for the monitoring stack.

## Services Won't Start

**Problem**: `docker compose up -d` fails

**Solutions**:
1. Check if Docker is running: `docker version`
2. Check if ports are available: `netstat -an | findstr "3001\|9090"`
3. View detailed logs: `docker compose logs`

## Can't Access Grafana

**Problem**: <http://localhost:3001> doesn't work

**Solutions**:
1. Check if Grafana is running: `docker compose ps`
2. Check Grafana logs: `docker compose logs grafana`
3. Try different browser or incognito mode
4. Wait 30 seconds after startup

## Prometheus Has No Data

**Problem**: Grafana shows "No data" for queries

**Solutions**:
1. Check Prometheus targets: <http://localhost:9090/targets>
2. Verify RSS Reader URL in `config/prometheus.yml`
3. Check if RSS Reader endpoints are accessible
4. Restart Prometheus: `docker compose restart prometheus`

## RSS Reader Not Monitored

**Problem**: `up{job="rss-backend"}` returns empty

**Solutions**:
1. Edit `config/prometheus.yml`
2. Change `rss-backend:8000` to your actual RSS Reader URL
3. Restart: `docker compose restart prometheus`
4. Verify endpoints exist:
   - `/api/v1/status/simple`
   - `/api/v1/status/database`

## Data Not Persisting

**Problem**: Dashboards disappear after restart

**Solutions**:
1. Check Docker volumes: `docker volume ls | findstr monitoring`
2. Don't use `docker compose down -v` (removes volumes)
3. Use `docker compose down` (keeps volumes)

## High Resource Usage

**Problem**: Monitoring uses too much CPU/memory

**Solutions**:
1. Increase scrape intervals in `config/prometheus.yml`
2. Reduce data retention (default: 15 days)
3. Add resource limits to `docker-compose.yml`

## Getting Help

1. Check container logs: `docker compose logs -f`
2. Check Docker status: `docker compose ps`
3. Verify configuration files
4. Restart services: `docker compose restart`
