# RSS Reader Backend

## Name

RSS Reader Backend

## Tech Stack

- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Database:** PostgreSQL
- **Migrations:** Alembic
- **HTTP Client:** httpx
- **Feed Parsing:** feedparser, BeautifulSoup4
- **Testing:** pytest

## How to Start the Project

### 1. Create a Virtual Environment

#### Option A: Using [uv](https://github.com/astral-sh/uv) (Recommended for speed)

- Create a virtual environment:

  **Windows:**

  ```sh
  uv venv .venv
  .venv\Scripts\Activate.ps1
  ```

  **Linux/macOS:**

  ```sh
  uv venv .venv
  source .venv/bin/activate
  ```

#### Option B: Using pip / venv

- Create a virtual environment:

  **Windows:**

  ```sh
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```

  **Linux/macOS:**

  ```sh
  python3 -m venv .venv
  source .venv/bin/activate
  ```

### 2. Install dependencies

#### Option A: Using uv

- Install uv (if not already):

  ```sh
  pip install uv
  # or, with pipx (recommended):
  pipx install uv
  ```

- Install packages:

  ```sh
  uv pip install -r requirements.txt
  ```

#### Option B: Using pip

  ```sh
  pip install -r requirements.txt
  ```

### 3. Configure environment

Create a `.env` file in the backend directory. Example:

```env
DATABASE_URL=postgresql://user_name:password@localhost/db_name
```

### 4. Run migrations

```sh
alembic upgrade head
```

### 5. Start the server

```sh
uvicorn app.main:app --reload
```

## How to Run Tests

```sh
pytest
```

## Alembic Guide

- **Create migration:**

  ```sh
  alembic revision --autogenerate -m "your message"
  ```

- **Apply migrations:**

  ```sh
  alembic upgrade head
  ```

- **Edit connection:**

  - Uses `DATABASE_URL` from `.env` (see `alembic.ini` and `env.py`)

## API Documentation

FastAPI automatically generates interactive API documentation:

| Endpoint            | Description                                    |
|---------------------|------------------------------------------------|
| `/docs`             | Swagger UI - Interactive API documentation    |
| `/redoc`            | ReDoc - Alternative documentation interface    |
| `/openapi.json`     | OpenAPI specification in JSON format          |

**Access the documentation:**

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

The Swagger UI provides an interactive interface where you can:

- View all available endpoints and their schemas
- Test API endpoints directly from the browser
- See request/response examples
- View authentication requirements

## API Endpoints

| Method | Endpoint                              | Description                                 |
|--------|----------------------------------------|---------------------------------------------|
| GET    | `/api/v1/feeds/`                      | List all feeds                              |
| POST   | `/api/v1/feeds/`                      | Add a new feed                              |
| DELETE | `/api/v1/feeds/{feed_id}`             | Delete a feed                               |
| GET    | `/api/v1/feeds/{feed_id}/articles/`   | List articles for a feed                    |
| POST   | `/api/v1/feeds/{feed_id}/refresh`     | Manually refresh a feed                     |
| POST   | `/api/v1/feeds/fetchFeedTitle`        | Fetch and return the title of a feed by URL |
| PATCH  | `/api/v1/feeds/{feed_id}/move`        | Move a feed to a different folder           |
| GET    | `/api/v1/folders/`                    | List all folders                            |
| POST   | `/api/v1/folders/`                    | Add a new folder                            |
| PUT    | `/api/v1/folders/{folder_id}`         | Rename a folder                             |
| DELETE | `/api/v1/folders/{folder_id}`         | Delete a folder                             |
| GET    | `/api/v1/status/`                     | Comprehensive health check                  |
| GET    | `/api/v1/status/simple`               | Simple health status check                  |
| GET    | `/api/v1/status/database`             | Database connection status                  |

## env.example

```env
DATABASE_URL=postgresql://user:password@localhost/db_name
```
