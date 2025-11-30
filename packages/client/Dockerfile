# Stage 1: Install all dependencies (including devDependencies)
FROM node:22-alpine AS development-dependencies-env

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/

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
COPY packages/client/package.json ./packages/client/

# Copy node_modules from development stage
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY --from=development-dependencies-env /app/packages/client/node_modules ./packages/client/node_modules

# Copy client source code
COPY packages/client ./packages/client

# Build the client application with React Router
WORKDIR /app/packages/client
RUN npx react-router build

# Stage 3: Production image with production dependencies
FROM node:22-alpine AS production-dependencies-env

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/

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

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/client/package.json ./packages/client/

# Copy production node_modules
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=production-dependencies-env /app/packages/client/node_modules ./packages/client/node_modules

# Copy built application from build stage (both client and server builds)
COPY --from=build-env /app/packages/client/build ./packages/client/build
COPY --from=build-env /app/packages/client/public ./packages/client/public

# Set working directory to client
WORKDIR /app/packages/client

# Set Node environment to production
ENV NODE_ENV=production
ENV PORT=3001

# Expose port 3001 (using different port from backend)
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the React Router server
CMD ["npx", "react-router-serve", "build/server/index.js"]
