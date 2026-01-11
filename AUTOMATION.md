# Automation Guide

## Overview

This project is fully automated with zero manual setup required. Everything from development workflows to production deployments is handled automatically through GitHub Actions, Vercel, and Git hooks.

## Table of Contents

- [Quick Start](#quick-start)
- [Automated Setup](#automated-setup)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Vercel Configuration](#vercel-configuration)
- [Git Hooks](#git-hooks)
- [Environment Management](#environment-management)
- [Continuous Deployment](#continuous-deployment)

## Quick Start

### One-Command Setup

```bash
# Clone and setup in one go
git clone <your-repo> my-project && cd my-project && ./scripts/setup.sh
```

That's it! The setup script will:
- ✅ Configure Git author
- ✅ Install dependencies
- ✅ Setup environment files
- ✅ Install Git hooks
- ✅ Run type checking
- ✅ Run linting
- ✅ Build the project
- ✅ Validate everything works

### Manual Setup (if needed)

```bash
# 1. Clone repository
git clone <your-repo> my-project
cd my-project

# 2. Run automated setup
./scripts/setup.sh

# 3. Update environment variables
# Edit .env.local with your actual values

# 4. Start development
bun run dev
```

## Automated Setup

### Setup Script (`scripts/setup.sh`)

The setup script automates all manual configuration:

**What it does:**
1. Verifies Bun and Git are installed
2. Configures Git author (Tom Pickard <tom@pickard.dev>)
3. Creates `.env.local` from `.env.example`
4. Installs all dependencies
5. Runs type checking
6. Runs linter
7. Builds the application
8. Installs Git hooks

**Usage:**
```bash
./scripts/setup.sh
```

### Hook Installation (`scripts/install-hooks.sh`)

Separately install just the Git hooks:

```bash
./scripts/install-hooks.sh
```

## GitHub Actions Workflows

All CI/CD is fully automated through GitHub Actions. No manual deployment or testing required.

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or any `claude/**` branch
- Pull requests to `main` or `develop`

**Jobs:**
- **Setup**: Install dependencies and cache
- **Lint**: Run Biome linter and formatter
- **Type Check**: Validate TypeScript types
- **Build**: Build the application
- **Security Audit**: Check for vulnerabilities
- **Validation**: Confirm all checks passed

**Features:**
- Parallel job execution for speed
- Dependency caching for faster runs
- Automatic cancellation of outdated runs
- Build artifacts uploaded for review

### 2. Production Deployment (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**What it does:**
1. Runs full CI pipeline (type check, lint, build)
2. Deploys to Vercel production
3. Comments deployment URL on the commit
4. Updates production environment

**Automatic Features:**
- Zero-downtime deployments
- Automatic rollback on failure
- Deployment URLs in commit comments

### 3. Preview Deployment (`.github/workflows/preview.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**What it does:**
1. Runs full CI checks
2. Deploys to Vercel preview environment
3. Comments preview URL on PR
4. Updates preview on every commit

**Benefits:**
- Test changes before merging
- Share previews with team
- Automatic cleanup when PR closes

## Vercel Configuration

### Automatic Deployments

Vercel is configured via `vercel.json` to automatically:

**Production Deploys:**
- Trigger on push to `main`
- Run full build pipeline
- Apply production environment variables
- Update `stupid.hair` domain

**Preview Deploys:**
- Trigger on PR creation/update
- Create unique preview URL
- Use preview environment variables
- Auto-delete when PR closes

### Configuration Highlights

```json
{
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "framework": "nextjs",
  "github": {
    "enabled": true,
    "autoAlias": true,
    "autoJobCancelation": true
  }
}
```

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy

**Performance:**
- Aggressive caching for static assets
- Edge functions for Python APIs
- Image optimization

## Git Hooks

Git hooks run automatically on commit and push to catch issues early.

### Pre-Commit Hook

**Runs on:** Every commit

**Checks:**
1. Code formatting (auto-fix)
2. Linting
3. Type checking

**Result:**
- ✅ Commit proceeds if all checks pass
- ❌ Commit blocked if checks fail
- 💡 Provides fix suggestions

**Bypass (use sparingly):**
```bash
git commit --no-verify
```

### Pre-Push Hook

**Runs on:** Every push

**Checks:**
1. Full production build

**Result:**
- ✅ Push proceeds if build succeeds
- ❌ Push blocked if build fails

### Commit-Msg Hook

**Runs on:** Every commit

**Validates:**
- Conventional commit format
- Type and scope
- Subject length

**Valid formats:**
```
feat(auth): add login functionality
fix(api): resolve CORS issue
docs: update README
chore(deps): update dependencies
```

**Invalid (blocked):**
```
added some stuff
Fix bug
WIP
```

## Environment Management

### Automated Environment Setup

**Development:**
```bash
# Automatically created by setup script
.env.local (from .env.example)
```

**GitHub Actions:**
```bash
# Set via GitHub Secrets UI
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**Vercel:**
```bash
# Set via Vercel Dashboard or CLI
NEXT_PUBLIC_SITE_URL
# ... other production variables
```

### Environment Sync

Pull production environment variables locally:

```bash
vercel env pull .env.local
```

## Continuous Deployment

### Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Developer pushes to main                           │
│     ↓                                                   │
│  2. GitHub Actions: CI workflow runs                   │
│     ↓                                                   │
│  3. All checks pass (lint, type, build)                │
│     ↓                                                   │
│  4. GitHub Actions: Deploy workflow runs               │
│     ↓                                                   │
│  5. Vercel: Production deployment                      │
│     ↓                                                   │
│  6. Live at stupid.hair                                │
│     ↓                                                   │
│  7. Deployment URL posted in commit                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### PR Flow

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Developer creates PR                               │
│     ↓                                                   │
│  2. GitHub Actions: CI workflow runs                   │
│     ↓                                                   │
│  3. GitHub Actions: Preview deployment runs            │
│     ↓                                                   │
│  4. Vercel: Preview deployment created                 │
│     ↓                                                   │
│  5. Preview URL posted in PR                           │
│     ↓                                                   │
│  6. Every commit updates preview                       │
│     ↓                                                   │
│  7. PR merged → preview deleted automatically          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## GitHub Secrets Setup

### Required Secrets

To enable automatic deployments, configure these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

1. **VERCEL_TOKEN**
   ```bash
   # Get from: https://vercel.com/account/tokens
   # Create new token with appropriate scopes
   ```

2. **VERCEL_ORG_ID**
   ```bash
   # Get from Vercel project settings
   # Or run: vercel project ls
   ```

3. **VERCEL_PROJECT_ID**
   ```bash
   # Get from Vercel project settings
   # Or run: vercel project ls
   ```

### Optional Secrets

4. **NEXT_PUBLIC_SITE_URL**
   ```bash
   # Your production domain
   https://stupid.hair
   ```

## Workflow Customization

### Adding Environment Variables

**For GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
env:
  NEW_VAR: ${{ secrets.NEW_VAR }}
```

**For Vercel:**
```bash
# Via CLI
vercel env add NEW_VAR production

# Or via Dashboard
# Project Settings → Environment Variables
```

### Custom Build Steps

**Add to workflow:**
```yaml
# .github/workflows/ci.yml
- name: Custom step
  run: bun run custom-script
```

**Add to package.json:**
```json
{
  "scripts": {
    "custom-script": "your-command-here"
  }
}
```

### Modifying Checks

**Pre-commit (local):**
```bash
# Edit .git/hooks/pre-commit
# Or update scripts/install-hooks.sh and reinstall
```

**CI (GitHub Actions):**
```yaml
# Edit .github/workflows/ci.yml
# Add/remove jobs as needed
```

## Monitoring & Notifications

### Build Status

**Where to see:**
- GitHub Actions tab in repository
- PR checks section
- Commit status badges

**Notifications:**
- Email on workflow failure
- PR comments on deployment
- Commit comments on production deploy

### Deployment Status

**Where to see:**
- Vercel dashboard
- GitHub deployments tab
- PR comments (preview URLs)

## Troubleshooting

### Setup Script Fails

```bash
# Ensure Bun is installed
curl -fsSL https://bun.sh/install | bash

# Run setup again
./scripts/setup.sh
```

### Git Hooks Not Running

```bash
# Reinstall hooks
./scripts/install-hooks.sh

# Verify hooks are executable
ls -la .git/hooks/
```

### GitHub Actions Failing

**Check:**
1. All secrets are configured correctly
2. Bun version is compatible
3. Dependencies are up to date

**Debug locally:**
```bash
# Run same checks as CI
bun run type-check
bun run lint
bun run build
```

### Vercel Deployment Fails

**Check:**
1. Environment variables are set
2. Build succeeds locally
3. Vercel project is linked

**Debug:**
```bash
# Test build locally
bun run build

# Check Vercel logs
vercel logs <deployment-url>
```

## Best Practices

### For Developers

1. **Always run setup script** when cloning
   ```bash
   ./scripts/setup.sh
   ```

2. **Let Git hooks do their job** (don't bypass unless absolutely necessary)
   ```bash
   # Bad: git commit --no-verify
   # Good: fix the issues
   ```

3. **Use conventional commits** for automatic changelog generation
   ```bash
   git commit -m "feat(feature): description"
   ```

4. **Review preview deployments** before merging PRs

### For Teams

1. **Configure required status checks** in GitHub
   - Settings → Branches → Branch protection rules
   - Require CI workflow to pass

2. **Enable auto-delete for preview deployments** in Vercel
   - Already configured in `vercel.json`

3. **Set up branch protection** for `main`
   - Require PR reviews
   - Require status checks
   - No direct pushes

## Summary

With this automation setup:

✅ **Zero manual deployment** - Just push to main
✅ **Zero manual testing** - CI runs on every commit
✅ **Zero manual linting** - Pre-commit hooks catch issues
✅ **Zero manual builds** - Vercel builds automatically
✅ **Zero manual previews** - PRs get instant previews
✅ **Zero configuration** - One setup script does it all

**You write code. Everything else is automatic.**

---

**Questions or issues?** Check the [main README](./README.md) or [open an issue](https://github.com/yourusername/repo/issues).
