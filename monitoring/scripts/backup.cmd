@echo off
REM Backup script for monitoring data

echo.
echo ====================================
echo Monitoring Data Backup
====================================
echo.

set BACKUP_DIR=backups\%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

echo Creating backup directory: %BACKUP_DIR%
mkdir "%BACKUP_DIR%" 2>nul

echo.
echo 📁 Backing up Grafana data...
docker run --rm -v monitoring_grafana_data:/data -v "%cd%\%BACKUP_DIR%":/backup alpine tar czf /backup/grafana-data.tar.gz -C /data .

if %errorlevel% equ 0 (
    echo ✅ Grafana data backed up
) else (
    echo ❌ Failed to backup Grafana data
)

echo.
echo 📁 Backing up Prometheus data...
docker run --rm -v monitoring_prometheus_data:/data -v "%cd%\%BACKUP_DIR%":/backup alpine tar czf /backup/prometheus-data.tar.gz -C /data .

if %errorlevel% equ 0 (
    echo ✅ Prometheus data backed up
) else (
    echo ❌ Failed to backup Prometheus data
)

echo.
echo 📁 Backing up configuration...
xcopy /s /i "config" "%BACKUP_DIR%\config\"

echo.
echo ✅ Backup completed!
echo Backup location: %BACKUP_DIR%
echo.
echo Files backed up:
dir "%BACKUP_DIR%" /b
echo.
pause
