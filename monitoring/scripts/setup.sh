#!/bin/bash

# RSS Reader Monitoring Setup Script
# This script helps you set up monitoring for your RSS Reader application

set -e

echo "🔍 RSS Reader Monitoring Setup"
echo "==============================="
echo ""

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1; then
        echo "❌ Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
    echo "✅ Docker Compose is available"
}

# Function to start monitoring stack
start_monitoring() {
    echo ""
    echo "🚀 Starting monitoring stack..."

    # Check if we're in the monitoring directory
    if [ -f "docker-compose.yml" ]; then
        echo "📍 Starting standalone monitoring stack..."
        docker-compose up -d
    elif [ -f "../docker-compose.monitoring.yml" ]; then
        echo "📍 Starting integrated monitoring stack..."
        cd ..
        docker-compose -f docker-compose.monitoring.yml up -d
    else
        echo "❌ Could not find docker-compose file. Please run this script from the monitoring directory."
        exit 1
    fi

    echo ""
    echo "⏳ Waiting for services to start..."
    sleep 10
}

# Function to check service health
check_services() {
    echo ""
    echo "🔍 Checking service health..."

    # Check Prometheus
    if curl -s http://localhost:9090/-/healthy > /dev/null; then
        echo "✅ Prometheus is healthy"
    else
        echo "⚠️  Prometheus may not be ready yet"
    fi

    # Check Grafana
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ Grafana is healthy"
    else
        echo "⚠️  Grafana may not be ready yet"
    fi
}

# Function to display access information
show_access_info() {
    echo ""
    echo "🎉 Monitoring setup complete!"
    echo "=============================="
    echo ""
    echo "📊 Access your monitoring services:"
    echo "   • Grafana Dashboard: http://localhost:3001"
    echo "     Username: admin"
    echo "     Password: admin"
    echo ""
    echo "   • Prometheus: http://localhost:9090"
    echo ""
    echo "📈 Pre-configured monitoring includes:"
    echo "   • RSS Reader backend health"
    echo "   • Database connectivity"
    echo "   • API response times"
    echo "   • Request rates and error tracking"
    echo ""
    echo "🔧 To customize monitoring targets:"
    echo "   1. Edit monitoring/prometheus/prometheus.yml"
    echo "   2. Replace target URLs with your server addresses"
    echo "   3. Restart: docker-compose restart prometheus"
    echo ""
    echo "📚 For more information, see monitoring/README.md"
    echo ""
}

# Function to show menu
show_menu() {
    echo "Choose an option:"
    echo "1) Start monitoring stack"
    echo "2) Stop monitoring stack"
    echo "3) View logs"
    echo "4) Check service status"
    echo "5) Restart services"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
}

# Function to stop monitoring
stop_monitoring() {
    echo ""
    echo "🛑 Stopping monitoring stack..."

    if [ -f "docker-compose.yml" ]; then
        docker-compose down
    elif [ -f "../docker-compose.monitoring.yml" ]; then
        cd ..
        docker-compose -f docker-compose.monitoring.yml down
    fi

    echo "✅ Monitoring stack stopped"
}

# Function to show logs
show_logs() {
    echo ""
    echo "📋 Showing monitoring logs (Ctrl+C to exit)..."

    if [ -f "docker-compose.yml" ]; then
        docker-compose logs -f
    elif [ -f "../docker-compose.monitoring.yml" ]; then
        cd ..
        docker-compose -f docker-compose.monitoring.yml logs -f
    fi
}

# Function to check status
check_status() {
    echo ""
    echo "📊 Service Status:"
    echo "=================="

    if [ -f "docker-compose.yml" ]; then
        docker-compose ps
    elif [ -f "../docker-compose.monitoring.yml" ]; then
        cd ..
        docker-compose -f docker-compose.monitoring.yml ps
    fi
}

# Function to restart services
restart_services() {
    echo ""
    echo "🔄 Restarting monitoring services..."

    if [ -f "docker-compose.yml" ]; then
        docker-compose restart
    elif [ -f "../docker-compose.monitoring.yml" ]; then
        cd ..
        docker-compose -f docker-compose.monitoring.yml restart
    fi

    echo "✅ Services restarted"
}

# Main script
main() {
    # Initial checks
    check_docker
    check_docker_compose

    # Interactive menu
    while true; do
        echo ""
        show_menu

        case $choice in
            1)
                start_monitoring
                check_services
                show_access_info
                ;;
            2)
                stop_monitoring
                ;;
            3)
                show_logs
                ;;
            4)
                check_status
                ;;
            5)
                restart_services
                ;;
            6)
                echo ""
                echo "👋 Goodbye!"
                exit 0
                ;;
            *)
                echo "❌ Invalid option. Please choose 1-6."
                ;;
        esac
    done
}

# Run main function
main
