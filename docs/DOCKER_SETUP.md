# Docker Setup Summary

## 📁 Files Created

The following Docker-related files have been created for the AI-HireFlow project:

### Core Docker Files

1. **`/packages/client/Dockerfile`** - Multi-stage Dockerfile for the React Router v7 frontend
2. **`/packages/server/Dockerfile`** - Multi-stage Dockerfile for the Fastify backend
3. **`/docker-compose.yml`** - Orchestrates all services (client, server, MongoDB, Redis)
4. **`/.dockerignore`** - Excludes unnecessary files from Docker builds
5. **`/.env.docker`** - Environment variable template

6. **`/docker-start.sh`** - Quick start script (executable)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│              (ai-hireflow-network)                   │
│                                                       │
│  ┌──────────────┐     ┌──────────────┐              │
│  │   Client     │     │   Server     │              │
│  │  (Node 22)   │────▶│  (Node 22)   │              │
│  │  Port: 3001  │     │  Port: 3000  │              │
│  └──────────────┘     └──────┬───────┘              │
│                              │                       │
│                    ┌─────────┴─────────┐            │
│                    │                   │            │
│              ┌─────▼─────┐      ┌─────▼─────┐      │
│              │  MongoDB  │      │   Redis   │      │
│              │  (v8.0)   │      │  (v7.4)   │      │
│              │Port: 27017│      │Port: 6379 │      │
│              └───────────┘      └───────────┘      │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Client Container

- **Base Image**: node:22-alpine
- **Framework**: React Router v7 + Vite
- **Build**: Multi-stage build (development deps → build → production)
- **Port**: 3001
- **Features**:
   - Optimized multi-stage build
   - Production dependencies only in final image
   - Network resilience configuration

### Server Container

- **Base Image**: node:22-alpine
- **Framework**: Fastify + TypeScript
- **Build**: Multi-stage build (dev deps → build → production)
- **Port**: 3000
- **Features**:
   - TypeScript compilation
   - Non-root user for security
   - Health check endpoint
   - Persistent volumes for logs and uploads
   - Signal handling with dumb-init

### Database Services

- **MongoDB**: v8.0-noble
   - Authenticated with admin credentials
   - Data persistence with named volumes
   - Health check via mongosh
- **Redis**: v7.4-alpine
   - Password protected
   - AOF persistence enabled
   - Health check via redis-cli

## 🚀 Quick Start

### Method 1: Using Quick Start Script (Recommended)

```bash
./docker-start.sh
```

This script will:

1. Check Docker prerequisites
2. Set up environment variables
3. Build Docker images
4. Start all services
5. Wait for health checks
6. Display access points

### Method 2: Manual Setup

```bash
# 1. Copy environment template
cp .env.docker .env

# 2. Edit .env and update:
#    - JWT_SECRET
#    - COOKIE_SECRET
#    - VITE_GEMINI_API_KEY

# 3. Build and start
docker-compose up --build -d

# 4. View logs
docker-compose logs -f
```

## 📊 Service Health Checks

All services have health checks configured:

| Service | Check Method      | Interval | Timeout | Start Period |
| ------- | ----------------- | -------- | ------- | ------------ |
| MongoDB | mongosh ping      | 10s      | 10s     | 40s          |
| Redis   | redis-cli         | 10s      | 5s      | 30s          |
| Server  | HTTP /health      | 30s      | 10s     | 60s          |
| Client  | Depends on server | -        | -       | -            |

## 🗄️ Data Persistence

Named volumes ensure data persists across container restarts:

- **mongodb_data** - Database files
- **mongodb_config** - MongoDB configuration
- **redis_data** - Redis cache data
- **server_logs** - Application logs
- **server_uploads** - User uploaded files

## 🔐 Security Features

### Server Container

- ✅ Runs as non-root user (nodejs:1001)
- ✅ Multi-stage build (no dev dependencies in production)
- ✅ Health checks enabled
- ✅ Proper signal handling (dumb-init)
- ✅ Minimal alpine base image

### Database Services

- ✅ MongoDB: Authentication required
- ✅ Redis: Password protected
- ✅ Isolated Docker network
- ✅ Data persistence with volumes

## 🌐 Network Configuration

Services communicate via a custom bridge network (`ai-hireflow-network`):

- **Internal DNS**: Services can reach each other by name
   - Client → Server: `http://server:3000`
   - Server → MongoDB: `mongodb://mongodb:27017`
   - Server → Redis: `redis://redis:6379`

- **External Access**:
   - Client: `http://localhost:3001`
   - Server: `http://localhost:3000`
   - MongoDB: `mongodb://localhost:27017`
   - Redis: `redis://localhost:6379`

## 📝 Environment Variables

### Required Variables

```env
JWT_SECRET=<generate-with-openssl>
COOKIE_SECRET=<generate-with-openssl>
VITE_GEMINI_API_KEY=<from-google-ai-studio>
```

### Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate Cookie secret
openssl rand -base64 32
```

### Optional Variables

- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `SENTRY_DSN` - For error tracking
- `VITE_SENTRY_DSN` - For client error tracking

## 🔍 Common Commands

```bash
# Start services (detached)
docker-compose up -d

# View logs (follow)
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build server

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec server sh

# View resource usage
docker stats

# Clean up everything
docker-compose down -v
docker system prune -a
```

## 🧪 Testing

After starting services, verify everything is working:

```bash
# Check service status
docker-compose ps

# Test backend health
curl http://localhost:3000/api/health

# Test MongoDB connection
docker-compose exec mongodb mongosh -u admin -p admin123 --eval "db.adminCommand('ping')"

# Test Redis connection
docker-compose exec redis redis-cli -a redis123 PING

# Open frontend
open http://localhost:3001
```

## 📦 Image Sizes (Approximate)

- **Client Image**: ~300-400 MB
- **Server Image**: ~250-350 MB
- **MongoDB Image**: ~700 MB
- **Redis Image**: ~30-40 MB

Multi-stage builds ensure production images are optimized and contain only necessary files.

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Service Won't Start

```bash
# Check logs
docker-compose logs server

# Check health
docker-compose ps
```

### Network Issues

```bash
# Configure npm retries (already configured in Dockerfiles)
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
```

### Clean Start

```bash
# Remove all containers, volumes, and rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📚 Additional Resources

- **Project README**: [README.md](../README.md)
- **Server Documentation**: [packages/server/TESTING.md](packages/server/TESTING.md)

## ✅ Verification Checklist

Before deploying to production:

- [ ] Updated all secrets in `.env`
- [ ] Configured MongoDB credentials
- [ ] Configured Redis password
- [ ] Set up Google OAuth (if needed)
- [ ] Set up Sentry for error tracking (optional)
- [ ] Tested all services locally
- [ ] Configured reverse proxy (nginx/Traefik)
- [ ] Set up SSL/TLS certificates
- [ ] Configured automated backups
- [ ] Set up monitoring and alerting
- [ ] Reviewed security settings
- [ ] Tested health checks
- [ ] Documented deployment process

## 🎉 Success!

Your Docker setup is complete! You can now:

1. **Start the application**:

   ```bash
   ./docker-start.sh
   ```

2. **Access the frontend**:

   ```
   http://localhost:3001
   ```

3. **Access the API**:

   ```
   http://localhost:3000
   ```

4. **View API documentation**:
   ```
   http://localhost:3000/documentation
   ```

Happy coding! 🚀
