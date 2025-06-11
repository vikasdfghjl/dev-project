# RSS Reader Monitoring Setup Script for Windows
# This script helps you set up monitoring for your RSS Reader application on Windows

param(
    [string]$Action = "menu"
)

# Function to display header
function Show-Header {
    Write-Host "🔍 RSS Reader Monitoring Setup" -ForegroundColor Cyan
    Write-Host "===============================" -ForegroundColor Cyan
    Write-Host ""
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info *>$null
        Write-Host "✅ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        return $false
    }
}

# Function to check if Docker Compose is available
function Test-DockerCompose {
    try {
        docker-compose --version *>$null
        Write-Host "✅ Docker Compose is available" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker Compose is not available. Please install Docker Desktop." -ForegroundColor Red
        return $false
    }
}

# Function to start monitoring stack
function Start-Monitoring {
    Write-Host ""
    Write-Host "🚀 Starting monitoring stack..." -ForegroundColor Yellow
    
    # Check if we're in the monitoring directory
    if (Test-Path "docker-compose.yml") {
        Write-Host "📍 Starting standalone monitoring stack..." -ForegroundColor Blue
        docker-compose up -d
    }
    elseif (Test-Path "../docker-compose.monitoring.yml") {
        Write-Host "📍 Starting integrated monitoring stack..." -ForegroundColor Blue
        Set-Location ..
        docker-compose -f docker-compose.monitoring.yml up -d
    }
    else {
        Write-Host "❌ Could not find docker-compose file. Please run this script from the monitoring directory." -ForegroundColor Red
        return
    }
    
    Write-Host ""
    Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

# Function to check service health
function Test-Services {
    Write-Host ""
    Write-Host "🔍 Checking service health..." -ForegroundColor Yellow
    
    # Check Prometheus
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:9090/-/healthy" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Prometheus is healthy" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Prometheus may not be ready yet" -ForegroundColor Yellow
    }
    
    # Check Grafana
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Grafana is healthy" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Grafana may not be ready yet" -ForegroundColor Yellow
    }
}

# Function to display access information
function Show-AccessInfo {
    Write-Host ""
    Write-Host "🎉 Monitoring setup complete!" -ForegroundColor Green
    Write-Host "==============================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Access your monitoring services:" -ForegroundColor Cyan
    Write-Host "   • Grafana Dashboard: http://localhost:3001" -ForegroundColor White
    Write-Host "     Username: admin" -ForegroundColor Gray
    Write-Host "     Password: admin" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   • Prometheus: http://localhost:9090" -ForegroundColor White
    Write-Host ""
    Write-Host "📈 Pre-configured monitoring includes:" -ForegroundColor Cyan
    Write-Host "   • RSS Reader backend health" -ForegroundColor White
    Write-Host "   • Database connectivity" -ForegroundColor White
    Write-Host "   • API response times" -ForegroundColor White
    Write-Host "   • Request rates and error tracking" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 To customize monitoring targets:" -ForegroundColor Cyan
    Write-Host "   1. Edit monitoring\prometheus\prometheus.yml" -ForegroundColor White
    Write-Host "   2. Replace target URLs with your server addresses" -ForegroundColor White
    Write-Host "   3. Restart: docker-compose restart prometheus" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For more information, see monitoring\README.md" -ForegroundColor Cyan
    Write-Host ""
}

# Function to show menu
function Show-Menu {
    Write-Host "Choose an option:" -ForegroundColor Cyan
    Write-Host "1) Start monitoring stack" -ForegroundColor White
    Write-Host "2) Stop monitoring stack" -ForegroundColor White
    Write-Host "3) View logs" -ForegroundColor White
    Write-Host "4) Check service status" -ForegroundColor White
    Write-Host "5) Restart services" -ForegroundColor White
    Write-Host "6) Open Grafana in browser" -ForegroundColor White
    Write-Host "7) Open Prometheus in browser" -ForegroundColor White
    Write-Host "8) Exit" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter your choice (1-8)"
    return $choice
}

# Function to stop monitoring
function Stop-Monitoring {
    Write-Host ""
    Write-Host "🛑 Stopping monitoring stack..." -ForegroundColor Yellow
    
    if (Test-Path "docker-compose.yml") {
        docker-compose down
    }
    elseif (Test-Path "../docker-compose.monitoring.yml") {
        Set-Location ..
        docker-compose -f docker-compose.monitoring.yml down
    }
    
    Write-Host "✅ Monitoring stack stopped" -ForegroundColor Green
}

# Function to show logs
function Show-Logs {
    Write-Host ""
    Write-Host "📋 Showing monitoring logs (Ctrl+C to exit)..." -ForegroundColor Yellow
    
    if (Test-Path "docker-compose.yml") {
        docker-compose logs -f
    }
    elseif (Test-Path "../docker-compose.monitoring.yml") {
        Set-Location ..
        docker-compose -f docker-compose.monitoring.yml logs -f
    }
}

# Function to check status
function Get-Status {
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    
    if (Test-Path "docker-compose.yml") {
        docker-compose ps
    }
    elseif (Test-Path "../docker-compose.monitoring.yml") {
        Set-Location ..
        docker-compose -f docker-compose.monitoring.yml ps
    }
}

# Function to restart services
function Restart-Services {
    Write-Host ""
    Write-Host "🔄 Restarting monitoring services..." -ForegroundColor Yellow
    
    if (Test-Path "docker-compose.yml") {
        docker-compose restart
    }
    elseif (Test-Path "../docker-compose.monitoring.yml") {
        Set-Location ..
        docker-compose -f docker-compose.monitoring.yml restart
    }
    
    Write-Host "✅ Services restarted" -ForegroundColor Green
}

# Function to open browser
function Open-Browser {
    param([string]$Url)
    try {
        Start-Process $Url
        Write-Host "🌐 Opening $Url in your default browser..." -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Could not open browser. Please manually navigate to: $Url" -ForegroundColor Red
    }
}

# Main script logic
function Main {
    Show-Header
    
    # Initial checks
    if (-not (Test-Docker)) { exit 1 }
    if (-not (Test-DockerCompose)) { exit 1 }
    
    # Handle command line arguments
    switch ($Action.ToLower()) {
        "start" {
            Start-Monitoring
            Test-Services
            Show-AccessInfo
            return
        }
        "stop" {
            Stop-Monitoring
            return
        }
        "status" {
            Get-Status
            return
        }
        "logs" {
            Show-Logs
            return
        }
        "restart" {
            Restart-Services
            return
        }
    }
    
    # Interactive menu
    do {
        Write-Host ""
        $choice = Show-Menu
        
        switch ($choice) {
            "1" {
                Start-Monitoring
                Test-Services
                Show-AccessInfo
            }
            "2" {
                Stop-Monitoring
            }
            "3" {
                Show-Logs
            }
            "4" {
                Get-Status
            }
            "5" {
                Restart-Services
            }
            "6" {
                Open-Browser "http://localhost:3001"
            }
            "7" {
                Open-Browser "http://localhost:9090"
            }
            "8" {
                Write-Host ""
                Write-Host "👋 Goodbye!" -ForegroundColor Green
                return
            }
            default {
                Write-Host "❌ Invalid option. Please choose 1-8." -ForegroundColor Red
            }
        }
    } while ($true)
}

# Run main function
Main
