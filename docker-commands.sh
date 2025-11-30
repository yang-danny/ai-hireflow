#!/bin/bash

# AI-HireFlow Docker Commands - Quick Reference
# Common Docker commands for managing the AI-HireFlow application

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       AI-HireFlow Docker Commands - Quick Reference       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to run command with description
run_cmd() {
    local cmd=$1
    local desc=$2
    echo -e "${GREEN}▶${NC} ${desc}"
    echo -e "${YELLOW}  $ ${cmd}${NC}"
    echo ""
}

# Check if argument provided
if [ $# -eq 0 ]; then
    echo "Usage: ./docker-commands.sh [command]"
    echo ""
    echo "Available commands:"
    echo ""
    echo "  start          - Start all services"
    echo "  stop           - Stop all services"
    echo "  restart        - Restart all services"
    echo "  logs           - View logs for all services"
    echo "  logs-server    - View server logs"
    echo "  logs-client    - View client logs"
    echo "  status         - Check service status"
    echo "  build          - Rebuild all images"
    echo "  clean          - Remove all containers and volumes"
    echo "  shell-server   - Access server container shell"
    echo "  shell-client   - Access client container shell"
    echo "  shell-mongo    - Access MongoDB shell"
    echo "  shell-redis    - Access Redis CLI"
    echo "  stats          - View resource usage"
    echo "  health         - Check backend health endpoint"
    echo "  help           - Show this help message"
    echo ""
    exit 0
fi

case $1 in
    start)
        echo -e "${GREEN}Starting all services...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo "Access points:"
        echo "  Frontend: http://localhost:3001"
        echo "  Backend:  http://localhost:3000"
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}Restarting all services...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Services restarted!${NC}"
        ;;
    
    logs)
        echo -e "${BLUE}Showing logs for all services (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    
    logs-server)
        echo -e "${BLUE}Showing server logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f server
        ;;
    
    logs-client)
        echo -e "${BLUE}Showing client logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f client
        ;;
    
    status)
        echo -e "${BLUE}Service Status:${NC}"
        docker-compose ps
        ;;
    
    build)
        echo -e "${GREEN}Rebuilding all images...${NC}"
        docker-compose build
        echo -e "${GREEN}✅ Build complete!${NC}"
        ;;
    
    clean)
        echo -e "${YELLOW}⚠️  This will remove all containers, networks, and volumes!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup complete!${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    
    shell-server)
        echo -e "${BLUE}Accessing server container shell...${NC}"
        docker-compose exec server sh
        ;;
    
    shell-client)
        echo -e "${BLUE}Accessing client container shell...${NC}"
        docker-compose exec client sh
        ;;
    
    shell-mongo)
        echo -e "${BLUE}Accessing MongoDB shell...${NC}"
        docker-compose exec mongodb mongosh -u admin -p admin123
        ;;
    
    shell-redis)
        echo -e "${BLUE}Accessing Redis CLI...${NC}"
        docker-compose exec redis redis-cli -a redis123
        ;;
    
    stats)
        echo -e "${BLUE}Container Resource Usage:${NC}"
        docker stats --no-stream
        ;;
    
    health)
        echo -e "${BLUE}Checking backend health endpoint...${NC}"
        curl -s http://localhost:3000/api/health | python3 -m json.tool || curl -s http://localhost:3000/api/health
        echo ""
        ;;
    
    help)
        $0
        ;;
    
    *)
        echo -e "${YELLOW}Unknown command: $1${NC}"
        echo "Run './docker-commands.sh help' for usage information"
        exit 1
        ;;
esac
