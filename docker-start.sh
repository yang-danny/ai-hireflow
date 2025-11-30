#!/bin/bash

# AI-HireFlow Docker Quick Start Script
# This script helps you quickly set up and run the application with Docker

set -e

echo "🚀 AI-HireFlow Docker Quick Start"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Setting up environment variables..."
    cp .env.docker .env
    echo "✅ Created .env file from template"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and update the following:"
    echo "   - JWT_SECRET (generate with: openssl rand -base64 32)"
    echo "   - COOKIE_SECRET (generate with: openssl rand -base64 32)"
    echo "   - VITE_GEMINI_API_KEY (get from Google AI Studio)"
    echo ""
    read -p "Press Enter after updating .env file to continue..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Building Docker images..."
echo "This may take a few minutes on first run..."
echo ""

# Build images
docker-compose build

echo ""
echo "✅ Docker images built successfully!"
echo ""
echo "🚀 Starting services..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
echo ""

# Wait for services to be healthy
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose ps | grep -q "unhealthy"; then
        attempt=$((attempt + 1))
        echo "   Waiting... ($attempt/$max_attempts)"
        sleep 2
    else
        break
    fi
done

echo ""
echo "✅ All services are running!"
echo ""
echo "📍 Access points:"
echo "   Frontend:  http://localhost:3001"
echo "   API:       http://localhost:3000"
echo "   Health:    http://localhost:3000/api/health"
echo "   API Docs:  http://localhost:3000/documentation"
echo ""
echo "📊 View logs with:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services with:"
echo "   docker-compose down"
echo ""
echo "🎉 Setup complete! Happy coding!"
