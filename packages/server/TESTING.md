# Testing Guide & Troubleshooting

## Quick Start

The test failures you're seeing are due to MongoDB connection issues. Here's how to fix them:

### Prerequisites

1. **Ensure MongoDB is running**:

```bash
# Check if MongoDB is running
pgrep -l mongod

# If not running, start it:
# macOS with Homebrew:
brew services start mongodb-community

# Or run directly:
mongod --dbpath=/path/to/data/db
```

2. **Set test environment variable** (optional):

```bash
# In packages/server/.env or .env.test
MONGODB_TEST_URI=mongodb://localhost:27017/ai-hireflow-test
```

### Running Tests

```bash
cd packages/server

# Run tests
npm test

# Run with verbose output to see what's happening
npm test -- --reporter=verbose

# Run a specific test file
npm test -- auth.test.ts
```

## Common Issues & Solutions

### Issue 1: "Hook timed out in 10000ms"

**Cause**: MongoDB connection is slow or not available  
**Solution**:

1. Ensure MongoDB is running
2. Tests now have 30s timeout for initialization
3. Check MongoDB connection string in setup.ts

### Issue 2: "process.exit unexpectedly called"

**Cause**: Database connection error calls `process.exit(1)`  
**Solution**: ✅ **FIXED** - `process.exit` is now stubbed in setup.ts

### Issue 3: "Cannot read properties of undefined (reading 'close')"

**Cause**: App failed to initialize in beforeEach  
**Solution**: ✅ **FIXED** - Added null check in afterEach

## Test Database Strategy

The tests now use this approach:

1. **Global setup** (beforeAll): Clean any existing connections
2. **Each test**: buildApp() creates its own database connection
3. **After each test**: Clean up app and clear collections
4. **Global teardown** (afterAll): Close all connections

## Alternative: Skip Database Tests

If you want to run tests without MongoDB:

```bash
# Run only unit tests (create these separately)
npm test -- --grep="unit"

# Skip integration tests
npm test -- --grep="^(?!.*Integration)"
```

## Running Specific Test Suites

```bash
# Auth tests only
npm test -- auth.test

# JWT tests only
npm test -- jwt.test

# Resume tests only
npm test -- resume.test
```

## Debugging Tests

### Enable Verbose Logging

```typescript
// In test file
import { buildApp } from '../app.js';

const app = await buildApp({
   logger: {
      level: 'debug', // or 'trace' for maximum verbosity
   },
});
```

### Use Vitest UI

```bash
npm run test:ui
```

This opens a browser interface where you can:

- See test results visually
- Debug individual tests
- View console output
- Set breakpoints

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Changes to test files will re-run tests automatically.

## Next Steps

1. **Start MongoDB**:

   ```bash
   brew services start mongodb-community
   ```

2. **Run tests again**:

   ```bash
   cd packages/server
   npm test
   ```

3. **If still failing**, check:
   - MongoDB is accessible at `mongodb://localhost:27017`
   - No firewall blocking port 27017
   - MongoDB has enough disk space

4. **Alternative**: Use MongoDB Memory Server for tests:

   ```bash
   npm install -D mongodb-memory-server -w packages/server
   ```

   Then update setup.ts to use in-memory MongoDB (no MongoDB installation needed!)

## MongoDB Memory Server (Recommended for CI/CD)

For tests that don't require a real MongoDB instance:

```typescript
// setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: Mongo MemoryServer;

beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   const mongoUri = mongoServer.getUri();
   process.env.MONGODB_URI = mongoUri;
});

afterAll(async () => {
   await mongoServer.stop();
});
```

This will make tests:

- ✅ Faster
- ✅ More reliable
- ✅ Work in CI/CD without MongoDB setup
- ✅ Fully isolated

Let me know if you want me to set this up!
