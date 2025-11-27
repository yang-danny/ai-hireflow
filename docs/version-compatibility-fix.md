# Version Compatibility Fix

## Issue

The `@fastify/rate-limit` package version 9.x requires Fastify 5.x, but the project uses Fastify 4.29.1, causing this error:

```
FastifyError: fastify-plugin: @fastify/rate-limit - expected '5.x' fastify version, '4.29.1' is installed
```

## Solution Applied

Installed Fastify 4.x-compatible versions:

```bash
# Uninstalled incompatible versions
npm uninstall @fastify/rate-limit @fastify/csrf-protection -w packages/server

# Installed compatible versions
npm install @fastify/rate-limit@^8.1.1 @fastify/csrf-protection@^6.4.1 -w packages/server
```

## Version Compatibility Matrix

| Package                    | Version for Fastify 4.x | Version for Fastify 5.x |
| -------------------------- | ----------------------- | ----------------------- |
| `@fastify/rate-limit`      | ^8.1.1                  | ^9.0.0                  |
| `@fastify/csrf-protection` | ^6.4.1                  | ^7.0.0                  |
| `@fastify/helmet`          | ^11.1.1                 | ^12.0.0                 |
| `@fastify/jwt`             | ^8.0.2                  | ^9.0.0                  |
| `@fastify/cookie`          | ^9.4.0                  | ^10.0.0                 |

## Verification

✅ Server now starts successfully with all security features:

- CORS configured with 4 allowed origins
- Helmet plugin registered (development mode)
- **Rate limiting configured: Global 100/min**
- CSRF protection configured
- MongoDB connected
- Google OAuth2 configured

## Future Upgrade Path

When ready to upgrade to Fastify 5.x:

```bash
# Upgrade Fastify and all plugins together
npm install fastify@^5.0.0 \
  @fastify/rate-limit@^9.0.0 \
  @fastify/csrf-protection@^7.0.0 \
  @fastify/helmet@^12.0.0 \
  @fastify/jwt@^9.0.0 \
  @fastify/cookie@^10.0.0 \
  -w packages/server
```

**Note**: Fastify 5.x has breaking changes. Review the [migration guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/) before upgrading.

## Status

✅ **RESOLVED** - All security enhancements working correctly with Fastify 4.x
