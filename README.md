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

### Core RSS Management

| Method | Endpoint                        | Description                                 |
|--------|----------------------------------|---------------------------------------------|
| GET    | `/api/v1/feeds/`                | List all feeds                              |
| POST   | `/api/v1/feeds/`                | Add a new feed                              |
| DELETE | `/api/v1/feeds/{feed_id}`        | Delete a feed                               |
| GET    | `/api/v1/feeds/{feed_id}/articles/` | List articles for a feed                |
| POST   | `/api/v1/feeds/{feed_id}/refresh`   | Manually refresh a feed                  |
| POST   | `/api/v1/feeds/fetchFeedTitle`   | Fetch and return the title of a feed by URL |
| PATCH  | `/api/v1/feeds/{feed_id}/move`   | Move a feed to a different folder           |

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

## Enhanced Backend Features

### Health Monitoring & Status Endpoints

The application includes comprehensive health monitoring capabilities:

- **Simple Health Check**: Quick status verification at `/api/v1/status/simple`
- **Detailed Health Check**: Full system information including response times at `/api/v1/status/`
- **Database Status**: Specific database connection health at `/api/v1/status/database`

### Graceful Degradation

The backend is designed to handle database connectivity issues gracefully:

- **Startup Without Database**: The application can start even when the database is unavailable
- **Status Endpoints Always Available**: Health checks work regardless of database status
- **Intelligent Error Messages**: Detailed troubleshooting information for configuration issues
- **Connection Retry Logic**: Automatic retry attempts with exponential backoff

### Enhanced Error Handling

- **Configuration Validation**: Comprehensive validation of environment variables and settings
- **Database Error Detection**: Intelligent detection of common database issues with helpful solutions
- **Helpful Error Messages**: User-friendly error messages with specific troubleshooting steps
- **Logging**: Comprehensive logging with emoji indicators for easy status identification

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

2. **Set up environment configuration:**

   Create a `.env` file in the backend directory:

   ```sh
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

   **Note**: The application can start without a database connection and will provide helpful error messages and troubleshooting steps.

3. **Set up PostgreSQL (optional for testing status endpoints):**
   - Ensure PostgreSQL is running and create a database (e.g., `rssdb`).
   - The application will provide detailed error messages if the database is not available.

4. **Run migrations (if using Alembic and database is available):**

   ```sh
   alembic upgrade head
   ```

5. **Start the backend server:**

   ```sh
   # From the backend directory
   uvicorn app.main:app --reload
   ```

   **Alternative (if you get module import errors):**

   ```sh
   # From the project root directory
   cd backend
   $env:PYTHONPATH="C:\path\to\your\backend"; uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000/api/v1/`.

6. **Verify the setup:**

   Test the health endpoints to ensure everything is working:

   ```sh
   # Simple health check
   curl http://localhost:8000/api/v1/status/simple
   
   # Detailed health check
   curl http://localhost:8000/api/v1/status/
     # Database-specific health check
   curl http://localhost:8000/api/v1/status/database
   ```

### Troubleshooting

#### Backend Won't Start

If you encounter module import errors when starting the backend:

1. **Ensure you're in the correct directory:**

   ```sh
   cd backend
   ```

2. **Set the Python path explicitly:**

   ```sh
   # Windows PowerShell
   $env:PYTHONPATH="C:\full\path\to\your\backend"
   
   # Or run from parent directory
   cd ..
   uvicorn backend.app.main:app --reload
   ```

3. **Check virtual environment:**

   ```sh
   # Activate virtual environment if not already active
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # macOS/Linux
   ```

#### Database Connection Issues

The application provides detailed error messages for database issues:

- **Missing DATABASE_URL**: The app will show exactly how to configure it
- **Connection refused**: Check if PostgreSQL is running
- **Authentication failed**: Verify username/password in DATABASE_URL
- **Database not found**: Create the database or check the database name

#### Health Check Responses

- **🟢 Status 200**: Everything is working correctly
- **🟡 Status 503**: Service unavailable (usually database issues)
- **🔴 Status 500**: Server error (check logs for details)

### Frontend (React)

1. **Install dependencies:**

   ```sh
   cd frontend
   npm install
   ```

2. **Start the development server:**

   ```sh
   npm run dev
   ```   The app will be available at `http://localhost:5173/` (or as shown in the terminal).

## Docker Deployment

Both the backend and frontend include Dockerfiles for containerized deployment, and the project includes a comprehensive Docker Compose setup.

### Quick Start with Docker Compose (Recommended)

The easiest way to run the entire application stack is using Docker Compose:

```sh
# Clone and navigate to the project
cd dev-project

# Build and start all services (PostgreSQL, Backend, Frontend)
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down -v
```

**Services included:**
- **PostgreSQL**: Database on port 5432
- **Backend**: FastAPI API on port 8000  
- **Frontend**: React app served by Nginx on port 80

**Access the application:**
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000/api/v1/`
- Health Check: `http://localhost:8000/api/v1/status/simple`
- Database: `localhost:5432` (postgres/password)

### Docker Compose Features

- **Health Checks**: All services include health monitoring
- **Dependency Management**: Services start in the correct order
- **Persistent Storage**: PostgreSQL data persists in named volumes
- **Network Isolation**: Services communicate via dedicated network
- **Automatic Restarts**: Services restart automatically on failure
- **Development Mode**: Backend includes hot-reload for development

### Individual Container Deployment

### Individual Container Deployment

If you prefer to run containers individually:

#### Backend Docker Container

The backend uses a Python 3.12 slim image with FastAPI and includes health monitoring capabilities.

**Build and run the backend container:**

```sh
# From the backend directory
cd backend

# Build the Docker image
docker build -t rss-reader-backend .

# Run the container
docker run -d `
  --name rss-backend `
  -p 8000:8000 `
  -e DATABASE_URL=postgresql://username:password@host:5432/database_name `
  rss-reader-backend

# View logs
docker logs rss-backend

# Test health endpoints
curl http://localhost:8000/api/v1/status/simple
```

**Environment Variables:**

- `DATABASE_URL`: PostgreSQL connection string (optional for health checks)

#### Frontend Docker Container

The frontend uses a multi-stage build with Node.js for building and Nginx for serving static files.

**Build and run the frontend container:**

```sh
# From the frontend directory
cd frontend

# Build the Docker image
docker build -t rss-reader-frontend .

# Run the container
docker run -d `
  --name rss-frontend `
  -p 80:80 `
  rss-reader-frontend

# View logs
docker logs rss-frontend
```

The frontend will be available at `http://localhost` (port 80).

#### Running Both Services

**Option 1: Separate containers with Docker network**

```sh
# Create a Docker network
docker network create rss-network

# Run backend container
docker run -d `
  --name rss-backend `
  --network rss-network `
  -p 8000:8000 `
  -e DATABASE_URL=postgresql://username:password@host:5432/database_name `
  rss-reader-backend

# Run frontend container
docker run -d `
  --name rss-frontend `
  --network rss-network `
  -p 80:80 `
  rss-reader-frontend
```

**Option 2: Using host networking (simpler for development)**

```sh
# Run backend
docker run -d --name rss-backend -p 8000:8000 rss-reader-backend

# Run frontend  
docker run -d --name rss-frontend -p 80:80 rss-reader-frontend
```

### Docker Management Commands

```sh
# Docker Compose commands
docker-compose ps                    # View running services
docker-compose logs backend          # View backend logs
docker-compose restart backend       # Restart specific service
docker-compose exec backend bash     # Shell into backend container
docker-compose exec postgres psql -U postgres -d rssdb  # Access database

# Individual container commands
docker stop rss-backend rss-frontend
docker rm rss-backend rss-frontend
docker rmi rss-reader-backend rss-reader-frontend
docker ps                           # View running containers
docker ps -a                        # View all containers
```

### Docker Development Tips

- **Live Reloading**: Backend includes `--reload` flag for development
- **Volume Mounts**: Docker Compose includes volume mounts for development
- **Health Checks**: All services include health monitoring endpoints
- **Database Persistence**: PostgreSQL data persists across container restarts
- **Network Communication**: Services can communicate using container names
- **Environment Variables**: Easily configurable via `.env` file or docker-compose override

### Production Deployment Notes

- Remove `--reload` flag from backend for production
- Use environment-specific configuration files
- Consider using secrets management for database passwords
- Use reverse proxy (nginx/traefik) for SSL termination
- Monitor container health and set up alerting
- Use Docker Swarm or Kubernetes for orchestration at scale

## Recent Improvements

This application has been enhanced with several key improvements:

### Backend Enhancements
- **Feature-based Architecture**: Restructured frontend with clean feature-based organization
- **Enhanced Error Handling**: Intelligent database error detection with helpful troubleshooting messages
- **Health Monitoring**: Comprehensive status endpoints for monitoring application health
- **Graceful Degradation**: Application can start and serve status endpoints even without database connectivity
- **Configuration Validation**: Robust configuration validation with detailed error messages
- **Improved Docker Support**: Enhanced Dockerfile with health checks and proper dependency management

### Frontend Improvements
- **Fixed Import Paths**: Corrected all import paths for the new feature-based architecture
- **API Service Consolidation**: Streamlined API services with proper data transformation
- **Enhanced Type Safety**: Improved TypeScript definitions and error handling
- **Updated HTTP Methods**: Changed from PUT to PATCH for better REST compliance

---

For more details, see the `backend/README.md` and `frontend/README.md` files.
