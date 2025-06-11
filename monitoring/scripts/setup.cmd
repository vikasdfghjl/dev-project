@echo off
echo.
echo ====================================
echo RSS Reader Monitoring Setup
echo ====================================
echo.

REM Navigate to monitoring directory
cd /d "%~dp0\.."

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or running
    echo Please install Docker Desktop and make sure it's running
    pause
    exit /b 1
)

echo ✅ Docker is available
echo.

echo 🚀 Starting monitoring services...
docker compose up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)

echo.
echo ✅ Monitoring is now running!
echo.
echo 📊 Access your tools:
echo   Grafana:    http://localhost:3001 (admin/admin)
echo   Prometheus: http://localhost:9090
echo.
echo 🔧 Useful commands:
echo   Check status: docker compose ps
echo   View logs:    docker compose logs -f
echo   Stop:         docker compose down
echo.
echo Press any key to exit...
pause >nul
