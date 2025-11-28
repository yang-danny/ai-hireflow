# Semantic Release Guide

## Overview

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning and changelog generation based on commit messages.

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

#### Release Types (trigger version bump)

- **feat**: A new feature → **MINOR** version (1.1.0 → 1.2.0)
- **fix**: A bug fix → **PATCH** version (1.1.0 → 1.1.1)
- **perf**: Performance improvement → **PATCH** version

#### Breaking Changes

Add `!` after type or `BREAKING CHANGE:` in footer → **MAJOR** version (1.1.0 → 2.0.0)

```
feat!: drop support for Node 14

BREAKING CHANGE: Node 14 is no longer supported
```

#### Non-release Types (no version bump)

- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (deps, config)
- **ci**: CI/CD changes

### Examples

**Feature (minor bump)**

```
feat(auth): add OAuth2 support

Implemented Google OAuth2 authentication flow with profile sync.

Closes #123
```

**Bug fix (patch bump)**

```
fix(resume): resolve PDF generation error

Fixed an issue where PDFs failed to generate for resumes with special characters.
```

**Breaking change (major bump)**

```
feat(api)!: update authentication endpoints

Changed the authentication API to use JWT instead of sessions.

BREAKING CHANGE: All API clients must update to use Bearer tokens
```

**Chore (no bump)**

```
chore(deps): update dependencies

Updated React to v19 and other minor dependencies.
```

## How It Works

### Automatic Process

1. **Push to main**: Triggers release workflow
2. **Analyze commits**: Determines version bump based on commit types
3. **Generate changelog**: Creates CHANGELOG.md from commits
4. **Update version**: Bumps version in package.json
5. **Create tag**: Git tag for the version
6. **GitHub release**: Creates release with notes
7. **Commit changes**: Commits changelog and package.json with `[skip ci]`

### Version Calculation

- `feat:` → 1.1.0 → **1.2.0** (minor)
- `fix:` → 1.1.0 → **1.1.1** (patch)
- `feat!:` or `BREAKING CHANGE:` → 1.1.0 → **2.0.0** (major)
- `docs:`, `chore:`, etc. → **no release**

## Configuration

### .releaserc.json

```json
{
   "branches": ["main"],
   "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/git",
      "@semantic-release/github"
   ]
}
```

### Plugins

- **commit-analyzer**: Determines version bump
- **release-notes-generator**: Generates release notes
- **changelog**: Updates CHANGELOG.md
- **npm**: Updates package.json (no publish)
- **git**: Commits changelog and version
- **github**: Creates GitHub release

## Workflow

### GitHub Actions

`.github/workflows/release.yml` runs on every push to main:

```yaml
on:
   push:
      branches:
         - main
```

### Required Permissions

The workflow needs:

- `contents: write` - To push commits and tags
- `issues: write` - To comment on issues
- `pull-requests: write` - To comment on PRs

## Best Practices

### 1. Use Descriptive Scopes

```
feat(auth): ...
fix(resume): ...
docs(api): ...
```

### 2. Reference Issues

```
fix(ui): resolve layout issue

Fixes #456
```

### 3. Multi-line Body

```
feat(search): add fuzzy search

Implemented fuzzy matching algorithm for better search results.
Added tests for edge cases.
```

### 4. Breaking Changes

Always explain breaking changes in detail:

```
feat(api)!: redesign user endpoints

BREAKING CHANGE: The /users endpoint now returns paginated results.
Migration guide: https://docs.example.com/migration
```

## Viewing Releases

- **Changelog**: `CHANGELOG.md` in repository root
- **GitHub Releases**: https://github.com/YOUR_ORG/AI-HireFlow/releases
- **Tags**: `git tag` or GitHub tags page

## Manual Release

If needed, you can manually trigger a release:

```bash
npx semantic-release --no-ci
```

**Warning**: Only use this for testing or emergencies.

## Troubleshooting

### Release Not Created

Check:

1. Commit messages follow conventional format
2. Commits include release types (feat/fix)
3. GitHub token has correct permissions
4. No `[skip ci]` in commit message

### Wrong Version Bump

Review:

1. Commit types used
2. Breaking change markers
3. Commit history since last release

### Failed Workflow

Check GitHub Actions logs for:

- Authentication errors
- Syntax errors in .releaserc.json
- Missing dependencies
