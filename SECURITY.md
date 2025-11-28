# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Known Vulnerabilities (Dev Dependencies)

### Current Status

The following vulnerabilities exist in development dependencies and do not affect production:

#### 1. glob / semantic-release (High)

- **CVE**: GHSA-5j98-mcp5-4vw2
- **Severity**: High
- **Impact**: Command injection via CLI
- **Status**: Accepted risk
- **Reason**:
   - Only used in CI/CD for automated releases
   - Not exposed in production
   - Breaking changes prevent easy upgrade
   - Monitoring for stable fix

#### 2. tmp / @lhci/cli (Low)

- **CVE**: GHSA-52f5-9888-hmc6
- **Severity**: Low
- **Impact**: Arbitrary temporary file write via symbolic link
- **Status**: Accepted risk
- **Reason**:
   - Only used for Lighthouse CI audits
   - Not in production build
   - Downgrade would break functionality
   - Monitoring for stable fix

## Reporting a Vulnerability

If you discover a security vulnerability, please email:
**security@ai-hireflow.com** (or create a private security advisory on GitHub)

### What to Include

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if known)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
   - Critical: 24-48 hours
   - High: 7 days
   - Medium: 30 days
   - Low: Best effort

## Security Best Practices

### For Developers

1. Never commit `.env` files or secrets
2. Use `npm audit` before releasing
3. Keep dependencies updated
4. Review security advisories regularly
5. Use environment variables for sensitive data

### For Production

1. Rotate secrets every 90 days
2. Use strong JWT and cookie secrets (32+ characters)
3. Enable HTTPS only
4. Configure CORS properly
5. Monitor logs for suspicious activity
6. Keep Node.js and MongoDB updated
7. Use security headers (Helmet.js enabled)
8. Enable rate limiting (configured)

## Security Features

### Implemented

- ✅ JWT authentication with HttpOnly cookies
- ✅ CSRF protection (double-submit cookie)
- ✅ Rate limiting (IP-based)
- ✅ Input validation (Zod schemas)
- ✅ NoSQL injection protection (mongoose-sanitize)
- ✅ Security headers (Helmet.js)
- ✅ Password hashing (bcrypt)
- ✅ OAuth2 (Google)
- ✅ Structured logging (Winston)

### Monitoring

- npm audit in CI/CD
- Automated dependency updates (Dependabot recommended)
- Security headers verification
- Regular penetration testing (recommended)

## Update Policy

### Dependencies

- **Patch updates**: Applied weekly
- **Minor updates**: Reviewed and applied monthly
- **Major updates**: Reviewed quarterly or as needed
- **Security patches**: Applied immediately

### Vulnerability Disclosure

We follow responsible disclosure:

1. Private notification to maintainers
2. 90-day disclosure timeline
3. Public disclosure after patch available
4. CVE assignment for critical issues

## Compliance

This project follows:

- OWASP Top 10 security practices
- GDPR data protection guidelines (where applicable)
- Secure development lifecycle (SDL)

## Audit Schedule

- **npm audit**: Every commit (CI/CD)
- **Dependency review**: Monthly
- **Security assessment**: Quarterly
- **Penetration testing**: Annually (recommended)

---

Last Updated: 2025-11-28
