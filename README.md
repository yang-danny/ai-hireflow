# AI-HireFlow

> **AI-powered career tools to help you land your dream job**

AI-HireFlow is a comprehensive platform that leverages artificial intelligence to streamline your job application process. Generate professional resumes, craft compelling cover letters, analyze your application materials, and prepare for interviews - all powered by Google's Gemini AI.

[![CI](https://github.com/yang-danny/AI-HireFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Yyang-danny/AI-HireFlow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org)

## ✨ Features

### 🤖 AI-Powered Resume Generation

- **Smart Resume Builder**: Step-by-step guided process
- **LinkedIn Import**: Extract information from LinkedIn profiles
- **AI Enhancement**: Automatically improve and optimize content
- **Multiple Templates**: Professional, modern designs
- **Real-time Preview**: See changes as you type
- **PDF Export**: High-quality downloadable resumes

### 📝 Cover Letter Generator

- **Tailored Content**: Generate job-specific cover letters
- **AI-Powered Writing**: Professional, compelling narratives
- **Multiple Formats**: Business letter and modern styles
- **PDF Export**: Ready-to-send documents

### 📊 Resume Analyzer

- **ATS Optimization**: Check compatibility with Applicant Tracking Systems
- **Detailed Scoring**: Overall, structure, tone, skills, and content analysis
- **Actionable Feedback**: Specific suggestions for improvement
- **Visual Reports**: Easy-to-understand metrics and charts

### 💼 Interview Preparation

- **AI Interview Practice**: Generate common and job-specific questions
- **Preparation Plans**: Structured study guides
- **Answer Templates**: Professional response frameworks

### 🎯 Job Tracking

- **Job Management**: Store and organize target positions
- **Application Materials**: Link resumes and cover letters to specific jobs
- **Progress Tracking**: Monitor application status

## 🏗️ Architecture

### Monorepo Structure

```
AI-HireFlow/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Fastify backend
├── docs/                # Documentation
├── e2e/                 # E2E tests (Playwright)
└── .github/workflows/   # CI/CD pipelines
```

### API Documentation

- **Interactive Documentation**: Available at `/api/docs` when server is running
- **OpenAPI 3.1**: Full OpenAPI specification for all endpoints
- **Try It Out**: Test API endpoints directly from the browser
- **Authentication**: JWT Bearer token and cookie-based auth documented
- **Generated from Code**: Automatically synced with Zod validation schemas

### Tech Stack

#### Frontend

- **Framework**: React 19 with React Router 7
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4 + Custom CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Performance Monitoring**: Web Vitals + Sentry
- **Image Optimization**: Lazy loading + responsive srcset
- **UI Components**: Custom components + Lucide icons
- **Notifications**: react-hot-toast
- **PDF Generation**: html2pdf.js, jsPDF
- **Image Processing**: @imgly/background-removal
- **Accessibility**: Focus management + keyboard navigation

####Backend

- **Runtime**: Node.js 24+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis (with ioredis)
- **Authentication**: JWT + OAuth2 (Google)
- **Validation**: Zod schemas
- **API Documentation**: Swagger/OpenAPI 3.1
- **HTTP Caching**: @fastify/caching + ETag support
- **Image Processing**: Sharp (compression, WebP, multi-size)
- **Logging**: Winston with structured logging
- **Security**: Helmet, CSRF protection, rate limiting, XSS protection
- **Monitoring**: Sentry integration (optional)
- **Circuit Breaker**: Opossum for external services

#### AI Tools

- **UI Design**: Google Stitch & Figma Make
- **UI to React**: Kombai
- **AI Powered IDE**: Cursor & Antigravity
- **Generative AI**: Google Gemini 2.5 Pro
- **Vibe Coding**: Google Gemini 3 Pro & Claude Sonnet 4.5

#### DevOps & Infrastructure

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Vitest (unit), Playwright (E2E)
- **Code Quality**: ESLint, TypeScript, Prettier
- **Versioning**: Semantic Release
- **Monitoring**: Lighthouse CI, Winston logs, Sentry
- **Performance**: Web Vitals tracking, React Profiler
- **Caching**: HTTP cache headers, ETag validation

## \ud83c\udf86 What's New

### Recent Improvements (November 2025)

#### \ud83d\udcca Performance Monitoring

- **Web Vitals Tracking**: Automatic tracking of CLS, LCP, INP, FCP, and TTFB
- **Sentry Integration**: Error tracking and performance monitoring
- **React Profiler**: Component-level render performance tracking
- **Real-time Metrics**: Color-coded console logging in development

#### \ud83d\udcda API Documentation

- **Interactive Swagger UI**: Test endpoints at `/api/docs`
- **OpenAPI 3.1 Spec**: Full API specification with request/response schemas
- **Auto-generated**: Synchronized with Zod validation schemas
- **Authentication Support**: Test protected endpoints with JWT tokens

#### ⚡ HTTP Caching

- **Cache-Control Headers**: Smart caching strategies for different resource types
- **ETag Support**: Automatic 304 Not Modified responses
- **Performance Boost**: 50-80% faster responses for cached resources
- **Bandwidth Savings**: 30-50% reduction in network traffic

#### \ud83d\uddbc\ufe0f Image Optimization

- **Automatic Compression**: Sharp-based image processing
- **Multi-Size Generation**: Thumbnail (150px), Medium (500px), Large (1200px)
- **WebP Conversion**: 30-50% smaller file sizes
- **Lazy Loading**: Intersection Observer with smooth transitions
- **Responsive Images**: Automatic srcset generation

#### \ud83d\udd12 Enhanced Security

- **Updated Validation**: Completed all Zod schemas
- **Vulnerability Assessment**: Documented and mitigated security risks
- **Improved Rate Limiting**: Redis-backed request throttling
- **XSS Protection**: Content sanitization on all inputs

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 24.0.0
- **npm**: >= 10.0.0
- **MongoDB**: >= 7.0 (or use Docker)
- **Redis**: >= 7.0 (or use Docker)

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/yang-danny/AI-HireFlow.git
   cd AI-HireFlow
   ```

2. **Set up environment variables**

   ```bash
   # Create .env files
   cp packages/server/.env.example packages/server/.env
   cp packages/client/.env.example packages/client/.env

   # Edit .env files with your values
   ```

3. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/api/docs
   - **MongoDB**: localhost:27017
   - **Redis**: localhost:6379

### Manual Setup (Development)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start MongoDB and Redis**

   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   docker run -d -p 6379:6379 --name redis redis:7-alpine

   # Or use local installations
   ```

3. **Start development servers**

   ```bash
   npm run dev
   ```

   This starts both frontend (port 5173) and backend (port 3000) concurrently.

## 🔧 Development

### Available Scripts

#### Root Level

```bash
npm run dev              # Start all dev servers
npm run build            # Build all packages
npm run test             # Run all tests
npm run lint             # Lint all packages
npm run typecheck        # Type check all packages
```

#### Client Workspace

```bash
npm run dev -w client    # Start frontend dev server
npm run build -w client  # Build frontend for production
npm run test -w client   # Run frontend tests
```

#### Server Workspace

```bash
npm run dev -w server    # Start backend dev server
npm run build -w server  # Build backend for production
npm run test -w server   # Run backend tests
```

### Project Setup

#### Environment Variables

**Server (.env)**

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-hireflow

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secure-jwt-secret
COOKIE_SECRET=your-secure-cookie-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Logging
LOG_LEVEL=info
```

**Client (.env)**

```env
VITE_API_URL=http://localhost:3000

# Sentry (Optional - for error tracking)
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ENABLE_SENTRY=false
VITE_APP_VERSION=1.0.0

# Performance Profiler (Optional)
VITE_ENABLE_PROFILER=false
```

> **⚠️ Security Note**: Never expose API keys in frontend code. The `VITE_GOOGLE_GEMINI_API_KEY` shown above is deprecated and should be removed. All AI operations should go through the backend API.

### Code Style

- **ESLint**: Enforces code quality and consistency
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (coming soon)
- **jsx-a11y**: Accessibility linting for React components

### Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

```bash
feat: add new feature           # Minor version bump
fix: resolve bug                # Patch version bump
docs: update documentation      # No version bump
chore: update dependencies      # No version bump
feat!: breaking change          # Major version bump
```

See [SEMANTIC_RELEASE.md](docs/SEMANTIC_RELEASE.md) for detailed guide.

## 🧪 Testing

### Unit & Integration Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch -w server

# Run with coverage
npm run test:coverage -w server
```

### E2E Tests

```bash
# Run Playwright tests
npx playwright test

# Run in UI mode
npx playwright test --ui

# Run specific test
npx playwright test e2e/auth.spec.ts
```

### Visual Regression Tests

```bash
# Run visual tests
npx playwright test e2e/visual.spec.ts

# Update snapshots
npx playwright test visual.spec.ts --update-snapshots
```

### Test Coverage

- **Target**: 80% coverage for lines, functions, branches, statements
- **Tools**: Vitest with v8 coverage provider
- **Reports**: HTML, LCOV, text formats

## 📦 Deployment

### Production Build

1. **Build all packages**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Environment Variables (Production)

Ensure all sensitive variables are set:

- Database connection strings
- API keys
- JWT secrets
- OAuth credentials

### Health Checks

The server provides health check endpoints:

- **`/api/health`**: Overall health
- **`/api/health/ready`**: Readiness check
- **`/api/health/live`**: Liveness check

## 📚 Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)

## 🔒 Security

### Implemented Security Measures

- **Authentication**: JWT + HttpOnly cookies + OAuth2 (Google)
- **CSRF Protection**: Double-submit cookie pattern
- **Rate Limiting**: IP-based request throttling (Redis-backed)
- **Input Validation**: Zod schema validation on all endpoints
- **NoSQL Injection Protection**: mongo-sanitize
- **XSS Protection**: Content sanitization
- **Security Headers**: Helmet.js with CSP
- **Password Hashing**: bcrypt (10 rounds)
- **Session Management**: Secure cookie configuration
- **Circuit Breaker**: Opossum for external service protection

### Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate secrets regularly** - JWT, cookies, API keys
3. **Use strong, unique passwords** - Minimum 8 characters
4. **Enable 2FA** for production services
5. **Monitor logs** for suspicious activity (Winston + Sentry)
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Review Sentry errors** - Set up alerts for critical issues

### Vulnerability Management

```bash
# Check for vulnerabilities
npm audit

# Review security report
cat vulnerability_report.md
```

See [vulnerability_report.md](vulnerability_report.md) for current status.

## 🚦 CI/CD Pipeline

### Workflows

- **CI**: Runs on every push and PR
   - Linting
   - Type checking
   - Unit tests
   - E2E tests
   - Security audit
   - Build verification

- **Lighthouse CI**: Runs on PR to main
   - Performance audit (90% min)
   - Accessibility audit (95% min)
   - Best practices (90% min)
   - SEO audit (90% min)

- **Release**: Runs on push to main
   - Automated versioning
   - Changelog generation
   - GitHub release creation
   - Git tag creation

### Performance Optimizations

#### Frontend

- **Lazy Loading**: Intersection Observer for images
- **Image Optimization**: WebP conversion, multi-size generation
- **Code Splitting**: Vite automatic chunking
- **Web Vitals Tracking**: CLS, LCP, INP, FCP, TTFB
- **Performance Profiler**: React component render tracking
- **Bundle Optimization**: Minification, tree shaking

#### Backend

- **HTTP Caching**: Cache-Control headers + ETag validation
- **Redis Caching**: Session storage, rate limit tracking
- **Database Indexing**: Optimized MongoDB queries
- **Image Processing**: Sharp for compression (30-50% reduction)
- **Connection Pooling**: MongoDB and Redis connection reuse

#### CI/CD

- **Playwright Caching**: ~30-60s faster CI runs
- **npm Cache**: Faster dependency installation
- **Concurrent Jobs**: Parallel test execution
- **Docker Layer Caching**: Faster image builds

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to your fork (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Development Process

1. Check for existing issues or create a new one
2. Comment on the issue to claim it
3. Write tests for new features
4. Ensure all tests pass
5. Update documentation if needed
6. Submit PR with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Built with ❤️ by Danny Yang**
