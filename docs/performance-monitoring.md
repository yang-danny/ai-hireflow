# Performance Monitoring & Optimization Guide

## Overview

This document provides guidance on implementing performance monitoring, caching strategies, and optimization techniques for the AI-HireFlow application.

---

## 📊 Frontend Performance Monitoring

### Option 1: Web Vitals (Built-in)

**Installation**:

```bash
npm install web-vitals -w packages/client
```

**Implementation**:
Create `packages/client/app/utils/performance.ts`:

```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
   // Send to your analytics endpoint
   console.log(metric);

   // Example: Send to Google Analytics
   if (window.gtag) {
      window.gtag('event', metric.name, {
         value: Math.round(
            metric.name === 'CLS' ? metric.value * 1000 : metric.value
         ),
         event_label: metric.id,
         non_interaction: true,
      });
   }
}

export function initPerformanceMonitoring() {
   onCLS(sendToAnalytics);
   onFID(sendToAnalytics);
   onFCP(sendToAnalytics);
   onLCP(sendToAnalytics);
   onTTFB(sendToAnalytics);
}
```

Call in `root.tsx`:

```typescript
import { initPerformanceMonitoring } from './utils/performance';

useEffect(() => {
   initPerformanceMonitoring();
}, []);
```

### Option 2: Sentry Performance Monitoring

**Installation**:

```bash
npm install @sentry/react -w packages/client
```

**Configuration**:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
   dsn: 'YOUR_SENTRY_DSN',
   integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
   tracesSampleRate: 1.0,
   replaysSessionSampleRate: 0.1,
   replaysOnErrorSampleRate: 1.0,
});
```

---

## 🔧 Backend Performance Monitoring

### Option 1: Fastify Built-in Logging

Already implemented with `pino-pretty`. Enhance with timing:

```typescript
// Add request timing hook
fastify.addHook('onRequest', async (request, reply) => {
   request.startTime = Date.now();
});

fastify.addHook('onResponse', async (request, reply) => {
   const duration = Date.now() - request.startTime;
   request.log.info({
      reqId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
   });
});
```

### Option 2: New Relic APM

**Installation**:

```bash
npm install newrelic -w packages/server
```

**Configuration** (`newrelic.js` in server root):

```javascript
exports.config = {
   app_name: ['AI-HireFlow Backend'],
   license_key: 'YOUR_LICENSE_KEY',
   logging: {
      level: 'info',
   },
   allow_all_headers: true,
   attributes: {
      exclude: [
         'request.headers.cookie',
         'request.headers.authorization',
         'request.headers.proxyAuthorization',
         'request.headers.setCookie*',
         'request.headers.x*',
         'response.headers.cookie',
         'response.headers.authorization',
         'response.headers.proxyAuthorization',
         'response.headers.setCookie*',
         'response.headers.x*',
      ],
   },
};
```

Load at server start:

```typescript
// server.ts - MUST BE FIRST LINE
import 'newrelic';
import { buildApp } from './app.js';
```

---

## 🚀 Redis Caching Strategy

### Installation

```bash
npm install redis ioredis -w packages/server
npm install @types/redis -D -w packages/server
```

### Redis Client Setup

Create `packages/server/src/config/redis.ts`:

```typescript
import Redis from 'ioredis';

let redisClient: Redis | null = null;

export async function connectRedis() {
   try {
      redisClient = new Redis({
         host: process.env.REDIS_HOST || 'localhost',
         port: Number(process.env.REDIS_PORT) || 6379,
         password: process.env.REDIS_PASSWORD,
         retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
         },
      });

      redisClient.on('connect', () => {
         console.log('✅ Redis connected');
      });

      redisClient.on('error', (err) => {
         console.error('❌ Redis error:', err);
      });

      return redisClient;
   } catch (error) {
      console.error('Failed to connect to Redis:', error);
      return null;
   }
}

export function getRedisClient() {
   return redisClient;
}
```

### Caching Plugin

Create `packages/server/src/plugins/cache.plugin.ts`:

```typescript
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { connectRedis, getRedisClient } from '../config/redis.js';

async function cachePlugin(fastify: FastifyInstance) {
   const redis = await connectRedis();

   if (redis) {
      // Add redis instance to fastify
      fastify.decorate('redis', redis);

      // Helper method for caching
      fastify.decorate('cache', {
         async get(key: string) {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
         },
         async set(key: string, value: any, ttl: number = 3600) {
            await redis.setex(key, ttl, JSON.stringify(value));
         },
         async del(key: string) {
            await redis.del(key);
         },
      });

      // Cleanup on close
      fastify.addHook('onClose', async () => {
         await redis.quit();
      });

      fastify.log.info('✅ Cache plugin registered with Redis');
   } else {
      fastify.log.warn('⚠️  Cache plugin skipped (Redis not available)');
   }
}

export default fp(cachePlugin);

// Type declarations
declare module 'fastify' {
   interface FastifyInstance {
      redis: any;
      cache: {
         get(key: string): Promise<any>;
         set(key: string, value: any, ttl?: number): Promise<void>;
         del(key: string): Promise<void>;
      };
   }
}
```

### Usage Examples

**Caching User Data**:

```typescript
// services/user.service.ts
static async getUserById(userId: string) {
   const cacheKey = `user:${userId}`;

   // Try cache first
   const cached = await fastify.cache.get(cacheKey);
   if (cached) return cached;

   // Fetch from database
   const user = await User.findById(userId);

   // Cache for 1 hour
   if (user) {
      await fastify.cache.set(cacheKey, user, 3600);
   }

   return user;
}
```

**Caching Resume List**:

```typescript
// controllers/resume.controller.ts
const cacheKey = `resumes:${userId}:page:${page}`;
const cached = await request.server.cache.get(cacheKey);

if (cached) {
   return reply.send(cached);
}

const result = await ResumeService.getUserResumes(userId, page, limit);

// Cache for 5 minutes
await request.server.cache.set(cacheKey, result, 300);
```

**Invalidate Cache on Update**:

```typescript
// After updating resume
await request.server.cache.del(`resumes:${userId}:page:1`);
await request.server.cache.del(`resume:${resumeId}`);
```

### Register in app.ts

```typescript
import cachePlugin from './plugins/cache.plugin.js';

// After database plugin
await fastify.register(cachePlugin);
```

---

## 📦 Bundle Size Optimization

### 1. Analyze Current Bundle

Add script to `packages/client/package.json`:

```json
{
   "scripts": {
      "build:analyze": "ANALYZE=true npm run build"
   }
}
```

### 2. Dynamic Imports for Heavy Libraries

**PDF Generation** (already heavy at ~500KB):

```typescript
// Instead of:
import html2pdf from 'html2pdf.js';

// Use dynamic import:
const generatePDF = async (element: HTMLElement) => {
   const html2pdf = (await import('html2pdf.js')).default;
   return html2pdf().from(element).save();
};
```

**Background Removal** (ML model, very large):

```typescript
// services/imageProcessing.ts
export async function removeBackground(imageUrl: string) {
   const { removeBackground } = await import('@imgly/background-removal');
   return removeBackground(imageUrl);
}
```

### 3. Tree Shaking Verification

Ensure all imports use named exports:

```typescript
// Good - tree-shakeable
import { specific, functions } from 'library';

// Bad - imports everything
import * as Library from 'library';
```

### 4. Vite Configuration

Update `vite.config.ts`:

```typescript
export default defineConfig({
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               'react-vendor': ['react', 'react-dom', 'react-router-dom'],
               'pdf-utils': ['html2pdf.js', 'jspdf', 'html2canvas'],
               'ui-vendor': ['lucide-react'],
            },
         },
      },
      chunkSizeWarningLimit: 1000,
   },
});
```

---

## 🌐 CDN Strategy for Static Assets

### Cloudflare CDN Setup

1. **Sign up for Cloudflare**
2. **Add your domain**
3. **Enable caching rules**:
   - Cache static assets: `*.css`, `*.js`, `*.jpg`, `*.png`, `*.woff2`
   - Browser cache TTL: 1 year
   - Edge cache TTL: 1 month

### Server-Side Headers

```typescript
// Add in helmet or static file serving
fastify.addHook('onSend', async (request, reply, payload) => {
   const url = request.url;

   // Cache static assets for 1 year
   if (url.match(/\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$/)) {
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
   }

   return payload;
});
```

### Image Optimization

Consider using:

- **Cloudinary** for on-the-fly image optimization
- **ImageKit** for automatic format conversion (WebP)
- **AWS S3 + CloudFront** for DIY CDN

---

## 📈 Performance Metrics to Track

### Frontend Metrics

- **LCP (Largest Contentful Paint)**: < 2.5s (good)
- **FID (First Input Delay)**: < 100ms (good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (good)
- **TTFB (Time to First Byte)**: < 600ms (good)
- **Bundle Size**: < 500KB initial load

### Backend Metrics

- **API Response Time**: < 200ms (P95)
- **Database Query Time**: < 50ms (P95)
- **Error Rate**: < 1%
- **Throughput**: > 100 req/s
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%

### Database Metrics

- **Index Hit Rate**: > 95%
- **Cache Hit Rate**: > 80% (with Redis)
- **Query Time**: < 50ms (P95)
- **Connection Pool Usage**: < 80%

---

## ✅ Quick Wins Checklist

- [x] Add database indexes (completed)
- [x] Implement code splitting (completed)
- [ ] Enable gzip/brotli compression
- [ ] Add response caching headers
- [ ] Implement Redis caching (optional, documented)
- [ ] Setup CDN for static assets
- [ ] Add performance monitoring
- [ ] Optimize images (WebP, lazy loading)
- [ ] Enable HTTP/2
- [ ] Implement service workers for offline support

---

## 🎯 Next Steps

1. **Enable Production Mode** monitoring
2. **Set up Redis** in staging environment
3. **Configure CDN** for production assets
4. **Implement APM** (New Relic or Datadog)
5. **Regular Performance Audits** using Lighthouse
6. **Monitor Real User Metrics** (RUM)

---

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Redis Caching Patterns](https://redislabs.com/ebook/part-2-use-cases/chapter-4-keeping-data-safe-and-ensuring-performance/)
- [MongoDB Indexing Strategies](https://www.mongodb.com/docs/manual/indexes/)
