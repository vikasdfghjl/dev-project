# Creating Dashboards

Simple guide to create monitoring dashboards in Grafana.

## Getting Started

1. **Open Grafana**: <http://localhost:3001>
2. **Login**: admin/admin
3. **Create Dashboard**: Click "+" → "Dashboard"

## Basic RSS Reader Queries

### Service Status

```promql
up{job="rss-backend"}
```

Shows if your RSS Reader is running (1 = up, 0 = down)

### Response Time

```promql
prometheus_http_request_duration_seconds{job="rss-backend"}
```

Shows how fast your RSS Reader responds

### Request Rate

```promql
rate(prometheus_http_requests_total{job="rss-backend"}[5m])
```

Shows requests per second

## Dashboard Tips

- **Stat Panel**: Good for showing current status (up/down)
- **Time Series**: Good for showing trends over time
- **Gauge**: Good for showing percentages or rates

## Example Dashboard Layout

```
+------------------+------------------+
|   Service Status |   Response Time  |
|   (Stat Panel)   |  (Time Series)   |
+------------------+------------------+
|        Request Rate Over Time       |
|           (Time Series)             |
+-------------------------------------+
```

## Saving Dashboards

1. Click "Save" (disk icon)
2. Give it a name like "RSS Reader Monitoring"
3. Add description and tags
4. Click "Save"

Your dashboard will be saved in Grafana's database and persist between restarts.
