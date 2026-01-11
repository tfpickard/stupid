# Deployment Guide

## Overview

This guide covers deploying your Next.js application to Vercel, including configuration, environment variables, monitoring, and best practices.

**Target Platform**: Vercel (optimized for Next.js)

## Prerequisites

- Vercel account (https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Database provisioned (Vercel Postgres, Neon, or Supabase)
- Environment variables ready

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended for First Deploy)

1. **Connect Repository**
   ```
   1. Go to https://vercel.com/new
   2. Click "Import Project"
   3. Select your Git provider
   4. Select your repository
   5. Click "Import"
   ```

2. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: bun run build
   Output Directory: .next
   Install Command: bun install
   Development Command: bun run dev
   ```

3. **Environment Variables**
   - Click "Environment Variables"
   - Add all required variables (see below)
   - Select environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployment URL

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
bun add -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Set environment variable
vercel env add DATABASE_URL production
```

### Method 3: Git Push (Automatic)

After initial setup, Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and pushes to other branches

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys to production
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="generated-secret-key"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"

# Base URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="noreply@your-domain.com"

# Error Tracking
SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="..."

# Feature Flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES="false"

# External APIs
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
```

### Managing Environment Variables

```bash
# Pull environment variables locally
vercel env pull .env.local

# Add new variable
vercel env add VARIABLE_NAME

# Remove variable
vercel env rm VARIABLE_NAME

# List all variables
vercel env ls
```

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.13",
      "memory": 512,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, must-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/external/:path*",
      "destination": "https://external-api.com/:path*"
    }
  ],
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for optimal container deployment
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/blog/:slug',
        destination: '/posts/:slug',
        permanent: true,
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
```

## Database Deployment

### Using Vercel Postgres

```bash
# Create database via Vercel dashboard
# 1. Go to Storage tab
# 2. Create → Postgres
# 3. Copy connection string

# Or via CLI
vercel postgres create my-database

# Connect local project to database
vercel postgres connect my-database

# Add connection string to environment
vercel env add DATABASE_URL production
```

### Running Migrations

```bash
# Production migrations (be careful!)
# Option 1: Via Vercel CLI
vercel env pull .env.local
bun run db:migrate

# Option 2: Via GitHub Actions
# See CI/CD section below
```

### Database Backup

```bash
# Backup via pg_dump
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql

# Automated backups (Vercel Postgres Pro)
# Configured via Vercel dashboard
```

## Python Functions on Vercel

### Configuration

```json
{
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.13",
      "memory": 512,
      "maxDuration": 10
    }
  }
}
```

### Requirements File

```txt
# api/requirements.txt
psycopg2-binary==2.9.9
pydantic==2.5.3
httpx==0.26.0
```

### Example Python Function

```python
# api/analytics.py
from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        data = {'message': 'Hello from Python!'}
        self.wfile.write(json.dumps(data).encode())
```

## Custom Domains

### Adding a Domain

1. **Via Dashboard**
   ```
   1. Project Settings → Domains
   2. Enter your domain
   3. Follow DNS configuration instructions
   ```

2. **Via CLI**
   ```bash
   vercel domains add your-domain.com
   ```

### DNS Configuration

For `your-domain.com`:
```
Type: A
Name: @
Value: 76.76.21.21
```

For `www.your-domain.com`:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificates

Vercel automatically provisions and renews SSL certificates for all domains.

## Monitoring & Logging

### Vercel Analytics

Enable in `vercel.json`:
```json
{
  "analytics": {
    "enable": true
  }
}
```

Or in code:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Error Tracking with Sentry

```bash
# Install Sentry
bun add @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },

  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...meta
    }));
  },

  warn: (message: string, meta?: object) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta }));
  },
};

// Usage in API route
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.info('Fetching users', { endpoint: '/api/users' });
    const users = await fetchUsers();
    return Response.json({ data: users });
  } catch (error) {
    logger.error('Failed to fetch users', error as Error, {
      endpoint: '/api/users'
    });
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## CI/CD with GitHub Actions

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run tests
        run: bun run test

      - name: Build
        run: bun run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Migration Workflow

```yaml
# .github/workflows/migrate.yml
name: Database Migrations

on:
  workflow_dispatch:  # Manual trigger only

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run migrations
        run: bun run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Performance Optimization

### Edge Functions

```typescript
// app/api/edge/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  return Response.json({ message: 'Running on the edge!' });
}
```

### ISR (Incremental Static Regeneration)

```typescript
// app/posts/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}
```

### Caching

```typescript
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData();

  return Response.json({ data }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
```

## Rollback Strategy

### Via Vercel Dashboard

1. Go to Deployments
2. Find the previous working deployment
3. Click the three dots → "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]

# Rollback to previous
vercel rollback
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD

# Or reset to specific commit
git reset --hard [commit-hash]

# Push to trigger redeployment
git push origin main --force
```

## Security Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] Database connection uses SSL
- [ ] NEXTAUTH_SECRET is unique and strong
- [ ] API routes have authentication
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using ORM)
- [ ] XSS prevention (React escaping + DOMPurify)
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Dependencies audited (`bun audit`)
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data

## Troubleshooting

### Build Failures

```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Missing dependencies

# Debug locally
bun run build

# Check environment variables
vercel env pull .env.local
```

### Database Connection Issues

```bash
# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Check IP allowlist (if using hosted database)
# Add Vercel IP ranges to your database allowlist
```

### Function Timeout

```json
{
  "functions": {
    "app/api/slow/route.ts": {
      "maxDuration": 60
    }
  }
}
```

### Large Bundle Size

```bash
# Analyze bundle
bun run build
bun run analyze

# Optimize:
# 1. Enable dynamic imports
# 2. Use next/image for images
# 3. Remove unused dependencies
# 4. Enable SWC minification
```

## Production Checklist

Before going live:

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Analytics configured (Plausible/Google)
- [ ] Error tracking enabled (Sentry)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Social meta tags verified
- [ ] Performance tested (Lighthouse)
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team notified

---

**You're ready for production!** Monitor your deployment and be prepared to rollback if issues arise.
