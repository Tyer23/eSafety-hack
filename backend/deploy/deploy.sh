#!/bin/bash
# Kid Message Safety System - Deployment Script
# Usage: ./deploy/deploy.sh [build|up|down|logs|status]

set -e

PROJECT_NAME="kids-safety"
COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[*]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[X]${NC} $1"
}

case "$1" in
    build)
        print_status "Building Docker image..."
        docker-compose -f $COMPOSE_FILE build --no-cache
        print_status "Build complete!"
        ;;
    
    up)
        print_status "Starting services..."
        docker-compose -f $COMPOSE_FILE up -d
        print_status "Services started!"
        print_status "API available at: http://localhost:8000"
        print_status "API docs at: http://localhost:8000/docs"
        ;;
    
    down)
        print_status "Stopping services..."
        docker-compose -f $COMPOSE_FILE down
        print_status "Services stopped!"
        ;;
    
    logs)
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    
    status)
        print_status "Service status:"
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        print_status "Health check:"
        curl -s http://localhost:8000/health | python -m json.tool 2>/dev/null || print_warning "API not responding"
        ;;
    
    test)
        print_status "Running quick test..."
        curl -s -X POST http://localhost:8000/analyze \
            -H "Content-Type: application/json" \
            -d '{"message": "fuck you"}' | python -m json.tool
        ;;
    
    *)
        echo "Usage: $0 {build|up|down|logs|status|test}"
        echo ""
        echo "Commands:"
        echo "  build   - Build Docker image"
        echo "  up      - Start services"
        echo "  down    - Stop services"
        echo "  logs    - View logs"
        echo "  status  - Check service status"
        echo "  test    - Run quick API test"
        exit 1
        ;;
esac

