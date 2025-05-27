# RSS Reader App

A modern, full-stack RSS reader application with a FastAPI backend, PostgreSQL database, and a React (TypeScript) frontend. Easily organize, fetch, and read articles from your favorite feeds, with robust folder management and a user-friendly interface.

## Features

- Add, delete, and organize RSS feeds
- Group feeds into folders
- Fetch and display articles from RSS feeds
- Mark articles as read/unread
- Group articles by date
- User-configurable feed refresh interval
- Manual refresh button
- Responsive, modern UI
- Error handling and feedback

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Other:** httpx, feedparser, modern CORS and async support

## API Endpoints

| Method | Endpoint                        | Description                                 |
|--------|----------------------------------|---------------------------------------------|
| GET    | `/api/v1/feeds/`                | List all feeds                              |
| POST   | `/api/v1/feeds/`                | Add a new feed                              |
| DELETE | `/api/v1/feeds/{feed_id}`        | Delete a feed                               |
| GET    | `/api/v1/feeds/{feed_id}/articles/` | List articles for a feed                |
| POST   | `/api/v1/feeds/{feed_id}/refresh`   | Manually refresh a feed                  |
| POST   | `/api/v1/feeds/parse-title`      | Parse and return the title of a feed by URL |
| GET    | `/api/v1/folders/`               | List all folders                            |
| POST   | `/api/v1/folders/`               | Add a new folder                            |
| PUT    | `/api/v1/folders/{folder_id}`    | Rename a folder                             |
| DELETE | `/api/v1/folders/{folder_id}`    | Delete a folder                             |
| PUT    | `/api/v1/feeds/{feed_id}/move`   | Move a feed to a different folder           |

---

## Development Instructions

### Backend (FastAPI)

1. **Install dependencies:**

   ```sh
   cd backend
   uv pip install -r requirements.txt
   ```

   Or, if you don't have [uv](https://github.com/astral-sh/uv) installed, use:

   ```sh
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL:**
   - Ensure PostgreSQL is running and create a database (e.g., `rssreader`).
   - Update the database URL in `backend/app/core/config.py` if needed.

3. **Run migrations (if using Alembic):**

   ```sh
   alembic upgrade head
   ```

4. **Start the backend server:**

   ```sh
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000/api/v1/`.

### Frontend (React)

1. **Install dependencies:**

   ```sh
   cd frontend
   npm install
   ```

2. **Start the development server:**

   ```sh
   npm run dev
   ```

   The app will be available at `http://localhost:5173/` (or as shown in the terminal).

---

For more details, see the `backend/README.md` and `frontend/README.md` files.
