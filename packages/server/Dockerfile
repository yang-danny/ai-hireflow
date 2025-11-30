# Stage 1: Install all dependencies (including devDependencies)
FROM node:22-alpine AS development-dependencies-env

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/

# Configure npm for better network resilience
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Install all dependencies
RUN npm ci

# Stage 2: Build the application
FROM node:22-alpine AS build-env

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/

# Copy node_modules from development stage
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY --from=development-dependencies-env /app/packages/server/node_modules ./packages/server/node_modules

# Copy server source code
COPY packages/server ./packages/server

# Build the server (TypeScript compilation)
WORKDIR /app/packages/server
RUN npm run build

# Stage 3: Production dependencies
FROM node:22-alpine AS production-dependencies-env

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/

# Configure npm for better network resilience and install production dependencies
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm pkg delete scripts.prepare \
    && npm ci --omit=dev

# Stage 4: Final production image
FROM node:22-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/server/package.json ./packages/server/

# Copy production node_modules
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=production-dependencies-env /app/packages/server/node_modules ./packages/server/node_modules

# Copy built application from build stage
COPY --from=build-env /app/packages/server/dist ./packages/server/dist

# Create directories for logs and uploads
RUN mkdir -p /app/packages/server/logs /app/packages/server/uploads && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set working directory to server
WORKDIR /app/packages/server

# Set Node environment to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "run", "start"]
