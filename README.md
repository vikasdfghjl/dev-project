# RSS Reader App

A modern, full-stack RSS reader application with a FastAPI backend, PostgreSQL database, and a React (TypeScript) frontend. Organize, fetch, and read articles from your favorite feeds with robust folder management and a user-friendly interface.

![RSS Reader Screenshot](docs/screenshot.png)

[![Backend Tests](https://github.com/your-org/rss-reader/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/your-org/rss-reader/actions) [![Docker Compose Ready](https://img.shields.io/badge/docker--compose-ready-blue)](https://docs.docker.com/compose/)

---

## 🚀 Features

- Add, delete, and organize RSS feeds
- Group feeds into folders
- Fetch and display articles from RSS feeds
- Mark articles as read/unread
- Group articles by date
- User-configurable feed refresh interval
- Manual refresh button
- Responsive, modern UI
- Error handling and feedback
- Health monitoring endpoints
- Graceful degradation (runs even if DB is down)

---

## 🛠️ Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Other:** httpx, feedparser, Docker, CORS, async support

---

## 📚 API Endpoints (v1)

### Core RSS Management

| Method | Endpoint                              | Description                                 |
|--------|----------------------------------------|---------------------------------------------|
| GET    | `/api/v1/feeds/`                      | List all feeds                              |
| POST   | `/api/v1/feeds/`                      | Add a new feed                              |
| DELETE | `/api/v1/feeds/{feed_id}`             | Delete a feed                               |
| GET    | `/api/v1/feeds/{feed_id}/articles/`   | List articles for a feed                    |
| POST   | `/api/v1/feeds/{feed_id}/refresh`     | Manually refresh a feed                     |
| POST   | `/api/v1/feeds/fetchFeedTitle`        | Fetch and return the title of a feed by URL |
| PATCH  | `/api/v1/feeds/{feed_id}/move`        | Move a feed to a different folder           |

### Folder Management

| Method | Endpoint                        | Description                                 |
|--------|----------------------------------|---------------------------------------------|
| GET    | `/api/v1/folders/`               | List all folders                            |
| POST   | `/api/v1/folders/`               | Add a new folder                            |
| PUT    | `/api/v1/folders/{folder_id}`    | Rename a folder                             |
| DELETE | `/api/v1/folders/{folder_id}`    | Delete a folder                             |

### Health & Status Monitoring

| Method | Endpoint                        | Description                                 |
|--------|----------------------------------|---------------------------------------------|
| GET    | `/api/v1/status/`               | Comprehensive health check with system info |
| GET    | `/api/v1/status/simple`         | Simple health status check                  |
| GET    | `/api/v1/status/database`       | Detailed database connection status         |

---

## 🩺 Health Monitoring & Graceful Degradation

- **Status Endpoints Always Available:** Health checks work even if the database is down
- **Startup Without Database:** App starts and serves status endpoints without DB
- **Intelligent Error Messages:** Detailed troubleshooting for config issues
- **Connection Retry Logic:** Automatic retry with exponential backoff

---

## ⚡ Quickstart (Local Development)

### Backend (FastAPI)

1. **Install dependencies:**

   ```sh
   cd backend
   uv pip install -r requirements.txt
   # or
   pip install -r requirements.txt
   ```

2. **Configure environment:**

   Create a `.env` file in `backend/`:

   ```sh
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

3. **(Optional) Set up PostgreSQL:**
   - Ensure PostgreSQL is running and a database exists (e.g., `rssdb`).

4. **Run migrations (if using Alembic):**

   ```sh
   alembic upgrade head
   ```

5. **Start the backend server:**

   ```sh
   # From backend directory
   uvicorn app.main:app --reload
   # If you get import errors, try:
   $env:PYTHONPATH="C:\path\to\your\backend"; uvicorn app.main:app --reload
   ```

   The API is at [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)

6. **Test health endpoints:**

   ```sh
   curl http://localhost:8000/api/v1/status/simple
   curl http://localhost:8000/api/v1/status/
   curl http://localhost:8000/api/v1/status/database
   ```

### Frontend (React)

1. **Install dependencies:**

   ```sh
   cd frontend
   npm install
   ```

2. **Start the dev server:**

   ```sh
   npm run dev
   ```

   The app is at [http://localhost:5173/](http://localhost:5173/)

---

## 🐳 Docker Deployment

### Quick Start (Recommended)

```sh
cd dev-project
# Build and start all services
docker-compose up --build
# Or detached
docker-compose up --build -d
# Stop
docker-compose down
# Remove volumes (clears DB)
docker-compose down -v
```

- **Frontend:** <http://localhost>
- **Backend API:** <http://localhost:8000/api/v1/>
- **Health Check:** <http://localhost:8000/api/v1/status/simple>
- **Database:** localhost:5432 (postgres/password)

### Individual Containers

#### Backend

```sh
cd backend
docker build -t rss-reader-backend .
docker run -d --name rss-backend -p 8000:8000 -e DATABASE_URL=postgresql://username:password@host:5432/database_name rss-reader-backend
```

#### Frontend

```sh
cd frontend
docker build -t rss-reader-frontend .
docker run -d --name rss-frontend -p 80:80 rss-reader-frontend
```

---

## 🧑‍💻 Troubleshooting

### Backend Won't Start

- Ensure you're in the correct directory: `cd backend`
- Set Python path if needed:

  ```sh
  $env:PYTHONPATH="C:\full\path\to\your\backend"
  ```

- Activate your virtual environment:

  ```sh
  .venv\Scripts\activate  # Windows
  source .venv/bin/activate  # macOS/Linux
  ```

### Database Issues

- **Missing DATABASE_URL**: App shows how to configure it
- **Connection refused**: Is PostgreSQL running?
- **Auth failed**: Check username/password
- **DB not found**: Create the DB or check name

### Health Check Responses

- 🟢 200: OK
- 🟡 503: Service unavailable (DB issues)
- 🔴 500: Server error (see logs)

---

## 📝 Recent Improvements

- **Backend:**
  - Pydantic v2 migration, SQLAlchemy deprecation fixes
  - Robust error handling and health endpoints
  - Graceful degradation (runs without DB)
  - Dockerfile and Compose improvements
- **Frontend:**
  - API data transformation (image, date fields)
  - Modern UI, feature-based structure
  - TypeScript type safety
  - Bugfixes for images, publish dates, and API redirects
- **Docs:**
  - Modernized README with quickstart, troubleshooting, Docker/dev tips

---

For more, see [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md).
