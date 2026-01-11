# Quick Start Guide

## Overview

This guide walks you through setting up a new production-grade Next.js project from this template. Expected completion time: 15-30 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Bun** installed (latest version)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- **Git** (2.40 or higher)
  ```bash
  git --version
  ```

- **A Vercel account** (free tier is sufficient)
  - Sign up at https://vercel.com

- **A PostgreSQL database** (choose one):
  - Vercel Postgres (recommended)
  - Neon (https://neon.tech)
  - Supabase (https://supabase.com)
  - Local PostgreSQL instance

## Step 1: Clone the Template

```bash
# Clone this repository
git clone https://github.com/yourusername/nextjs-template.git my-new-project
cd my-new-project

# Remove the original git history
rm -rf .git

# Initialize a new repository
git init
git add .
git commit -m "feat: initial commit from template"

# Configure git author (IMPORTANT)
git config user.name "Tom Pickard"
git config user.email "tom@pickard.dev"

# Connect to your remote repository (optional)
git remote add origin https://github.com/yourusername/my-new-project.git
git push -u origin main
```

## Step 2: Install Dependencies

```bash
# Install all dependencies using Bun
bun install

# This will install:
# - Next.js and React
# - TypeScript
# - Tailwind CSS
# - Biome (linter/formatter)
# - Testing libraries (Vitest, Playwright)
# - Database ORM (Drizzle)
# - And all other dependencies
```

## Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication (generate a secret: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Plausible Analytics (optional for local development)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"

# Email (optional - configure if using email features)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@your-domain.com"

# External APIs (add as needed)
API_KEY="your-api-key"
```

### Getting a Database Connection String

#### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select your project (or create one)
3. Navigate to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the `DATABASE_URL` connection string
6. Paste it into your `.env.local`

#### Option 2: Neon

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Paste it into your `.env.local`

#### Option 3: Local PostgreSQL

```bash
# Start PostgreSQL with Docker
docker run --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -d postgres:16

# Connection string:
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
```

## Step 4: Initialize the Database

```bash
# Generate Drizzle migrations (if schema exists)
bun run db:generate

# Apply migrations to your database
bun run db:migrate

# Optional: Seed database with sample data
bun run db:seed
```

If you're starting fresh, you can define your schema in `lib/db/schema.ts`:

```typescript
// lib/db/schema.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

Then generate and run migrations:

```bash
bun run db:generate
bun run db:migrate
```

## Step 5: Start Development Server

```bash
# Start the development server
bun run dev
```

Your application should now be running at http://localhost:3000

## Step 6: Verify the Setup

Open your browser and verify:

- [ ] Home page loads without errors
- [ ] Dark/light theme toggle works
- [ ] Console has no errors
- [ ] Hot reload works (edit a file and see changes)

Run the checks:

```bash
# Type checking
bun run type-check

# Linting
bun run lint

# Unit tests
bun run test:unit

# Build (to ensure production build works)
bun run build
```

All checks should pass without errors.

## Step 7: Customize Your Project

### Update Project Metadata

Edit `package.json`:

```json
{
  "name": "my-awesome-project",
  "version": "0.1.0",
  "description": "My production-grade Next.js application",
  "author": "Your Name <your@email.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-awesome-project.git"
  }
}
```

### Update Site Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'My Awesome Project',
    template: '%s | My Awesome Project',
  },
  description: 'A production-grade Next.js application',
  keywords: ['nextjs', 'react', 'typescript', 'tailwind'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'My Awesome Project',
    description: 'A production-grade Next.js application',
    siteName: 'My Awesome Project',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Awesome Project',
    description: 'A production-grade Next.js application',
    creator: '@yourtwitterhandle',
  },
};
```

### Configure Plausible Analytics

Add Plausible script to `app/layout.tsx`:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Step 8: Deploy to Vercel

### Using Vercel CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter your project name)
# - Directory? ./ (press Enter)
# - Override settings? No
```

### Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `bun run build`
   - **Output Directory**: `.next`
   - **Install Command**: `bun install`

4. Add environment variables:
   - Copy all variables from `.env.local`
   - Paste into Vercel's environment variables section
   - Make sure to set the correct `NEXTAUTH_URL` for production

5. Click "Deploy"

### Post-Deployment

After deployment:

1. **Configure Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Verify Deployment**
   - Visit your deployed URL
   - Check that all features work
   - Verify environment variables are correct

3. **Set up Plausible Analytics**
   - Go to https://plausible.io
   - Add your domain
   - Verify tracking is working

## Step 9: Set Up CI/CD (Optional but Recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Type check
        run: bun run type-check

      - name: Lint
        run: bun run lint

      - name: Unit tests
        run: bun run test:unit

      - name: Build
        run: bun run build

      - name: E2E tests
        run: bun run test:e2e
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

Commit and push:

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow"
git push
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
bun run db:studio

# If connection fails:
# 1. Verify DATABASE_URL is correct
# 2. Check database is running
# 3. Verify network access (firewall, VPN)
# 4. Check SSL mode (add ?sslmode=require if needed)
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear Bun cache
rm -rf node_modules
bun install

# Rebuild
bun run build
```

### Type Errors

```bash
# Regenerate TypeScript types
bun run db:generate

# Check TypeScript configuration
cat tsconfig.json
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun run dev
```

## Next Steps

Now that your project is set up, you can:

1. **Read the Documentation**
   - [CLAUDE.md](./CLAUDE.md) - AI integration guidelines
   - [AGENTS.md](./AGENTS.md) - Multi-agent workflow
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Development standards
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Architectural patterns

2. **Start Building Features**
   - Create your first API endpoint
   - Build your landing page
   - Add authentication
   - Implement your core features

3. **Set Up Monitoring**
   - Configure error tracking (Sentry)
   - Set up performance monitoring
   - Add logging

4. **Invite Your Team**
   - Share the repository
   - Set up branch protection rules
   - Configure code review requirements

## Commands Reference

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run linter
bun run lint:fix         # Fix linting errors
bun run type-check       # Check TypeScript types
bun run format           # Format code

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:studio        # Open Drizzle Studio
bun run db:seed          # Seed database

# Testing
bun run test             # Run all tests
bun run test:unit        # Run unit tests
bun run test:integration # Run integration tests
bun run test:e2e         # Run E2E tests
bun run test:coverage    # Run tests with coverage
bun run test:watch       # Run tests in watch mode

# Deployment
vercel                   # Deploy to Vercel
vercel --prod            # Deploy to production
vercel env pull          # Pull environment variables
```

## Getting Help

If you encounter issues:

1. Check the [documentation](./README.md)
2. Search [existing issues](https://github.com/yourusername/nextjs-template/issues)
3. Create a [new issue](https://github.com/yourusername/nextjs-template/issues/new)

---

**Congratulations!** You now have a production-grade Next.js application ready for development. Happy coding!
