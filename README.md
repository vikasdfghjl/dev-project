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

See [`backend/README.md`](backend/README.md) for a full list of API endpoints and usage examples.

---

## ⚡ Quickstart (Local Development)

### Backend (FastAPI)

See [`backend/README.md`](backend/README.md) for detailed backend setup, environment variables, and migration instructions.

### Frontend (React)

See [`frontend/README.md`](frontend/README.md) for detailed frontend setup, environment variables, and available scripts.

---

## 🧪 Running Tests

### Backend Testing

Run backend tests from the `backend/` directory:

```sh
pytest
```

### Frontend Testing

Run frontend tests from the `frontend/` directory:

```bash
npx vitest run
```

To run in watch mode:

```bash
npx vitest
```

See [`frontend/README.md`](frontend/README.md) for more details and troubleshooting.

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

#### Backend Container

```sh
cd backend
docker build -t rss-reader-backend .
docker run -d --name rss-backend -p 8000:8000 -e DATABASE_URL=postgresql://username:password@host:5432/database_name rss-reader-backend
```

#### Frontend Container

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

## 🧪 Testing Overview

- **Backend:** Uses `pytest` for API and DB tests. See [`backend/README.md`](backend/README.md).
- **Frontend:** Uses `Vitest` and `@testing-library/react` for unit and integration tests. See [`frontend/README.md`](frontend/README.md).
- Test files are in `backend/app/tests/` and `frontend/__tests__/`.

---

For more, see [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md).
