# Development Standards

## Overview

This document defines the development standards, best practices, and workflows for building production-grade web applications. All code must meet these standards before deployment.

**Philosophy**: Excellence is not an act, but a habit. Every commit should reflect professional-grade engineering.

## Project Setup

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd <project-name>

# Install dependencies (use Bun)
bun install

# Copy environment variables
cp .env.example .env.local

# Configure git
git config user.name "Tom Pickard"
git config user.email "tom@pickard.dev"

# Set up pre-commit hooks
bun run setup:hooks

# Start development server
bun run dev
```

### Development Tools

Required tools and their versions:

```bash
# Node.js (via Bun)
bun --version  # Should be latest

# Git
git --version  # 2.40+

# Docker (for local databases/services)
docker --version  # 24.0+

# PostgreSQL client (for database operations)
psql --version  # 15+
```

## Code Quality Standards

### TypeScript Configuration

All projects MUST use TypeScript with strict mode:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Code Style

#### Biome Configuration

```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "error",
        "noForEach": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "error"
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error",
        "useTemplate": "error"
      },
      "suspicious": {
        "noConsoleLog": "warn",
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

#### Naming Conventions

```typescript
// 1. Components - PascalCase
export function UserDashboard() {}
export function DataVisualization() {}

// 2. Hooks - camelCase, must start with 'use'
export function useAuth() {}
export function useDebounce() {}
export function useLocalStorage() {}

// 3. Utilities - camelCase
export function formatCurrency() {}
export function validateEmail() {}

// 4. Constants - UPPER_SNAKE_CASE
export const API_TIMEOUT = 5000;
export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

// 5. Types & Interfaces - PascalCase
export interface User {}
export type ApiResponse<T> = {}
export enum UserRole {}

// 6. Private/Internal - prefix with underscore
function _internalHelper() {}
const _privateConstant = 'value';

// 7. Files & Folders - kebab-case
// ✓ user-dashboard.tsx
// ✓ use-auth.ts
// ✓ api-client.ts
// ✗ UserDashboard.tsx
// ✗ useAuth.ts
```

### Project Structure

```
project-root/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   └── users/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── error.tsx                 # Error boundary
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── forms/                    # Form components
│   │   ├── login-form.tsx
│   │   └── user-form.tsx
│   └── layouts/                  # Layout components
│       ├── header.tsx
│       └── footer.tsx
│
├── lib/                          # Utilities and helpers
│   ├── db/                       # Database
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── client.ts
│   ├── auth/                     # Authentication
│   │   ├── config.ts
│   │   └── middleware.ts
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Class name utility
│   │   ├── format.ts             # Formatters
│   │   └── validation.ts         # Validators
│   └── hooks/                    # Custom hooks
│       ├── use-auth.ts
│       └── use-debounce.ts
│
├── api/                          # Python API functions (Vercel)
│   ├── analytics.py
│   └── processing.py
│
├── tests/                        # All test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # E2E tests (Playwright)
│       ├── auth.spec.ts
│       └── user-flow.spec.ts
│
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── styles/                       # Global styles
│   └── globals.css
│
├── .github/                      # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docs/                         # Documentation
│   ├── CLAUDE.md
│   ├── AGENTS.md
│   ├── CODEX.md
│   └── ARCHITECTURE.md
│
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (gitignored)
├── .gitignore
├── biome.json                    # Biome configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
├── vercel.json                   # Vercel configuration
├── package.json                  # Dependencies
├── bun.lockb                     # Lock file
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
└── README.md
```

## Testing Strategy

### Test Coverage Requirements

- **Minimum 80% overall coverage**
- **100% coverage for**:
  - Authentication logic
  - Payment processing
  - Data validation
  - Security-critical functions

### Unit Tests (Vitest)

```typescript
// tests/unit/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/lib/utils/format';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('handles negative numbers', () => {
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
  });

  it('supports different currencies', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-10T12:00:00Z');
    expect(formatDate(date)).toBe('January 10, 2025');
  });

  it('handles invalid dates', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });
});
```

### Integration Tests

```typescript
// tests/integration/api/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { testClient } from '@/tests/utils/test-client';
import { db } from '@/lib/db';

describe('Authentication API', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.migrate.rollback();
  });

  describe('POST /api/auth/register', () => {
    it('creates a new user', async () => {
      const response = await testClient.post('/api/auth/register', {
        json: {
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User'
        }
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.user.email).toBe('test@example.com');
      expect(data.token).toBeDefined();
    });

    it('rejects duplicate emails', async () => {
      // Create first user
      await testClient.post('/api/auth/register', {
        json: {
          email: 'duplicate@example.com',
          password: 'SecurePass123!',
          name: 'First User'
        }
      });

      // Attempt to create duplicate
      const response = await testClient.post('/api/auth/register', {
        json: {
          email: 'duplicate@example.com',
          password: 'SecurePass123!',
          name: 'Second User'
        }
      });

      expect(response.status).toBe(409);
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('user can register and access dashboard', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill in registration form
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="name"]', 'New User');

    // Submit form
    await page.click('[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should see welcome message
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome, New User');

    // Should be able to navigate
    await page.click('[data-testid="settings-link"]');
    await expect(page).toHaveURL('/dashboard/settings');
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/register');

    // Submit empty form
    await page.click('[type="submit"]');

    // Should show validation errors
    await expect(page.locator('[data-testid="error-email"]'))
      .toBeVisible();
    await expect(page.locator('[data-testid="error-password"]'))
      .toBeVisible();
  });

  test('handles server errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('/api/auth/register', route =>
      route.fulfill({
        status: 500,
        json: { error: 'Internal server error' }
      })
    );

    await page.goto('/register');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="name"]', 'Test User');
    await page.click('[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"]'))
      .toContainText('Something went wrong');
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run unit tests only
bun test:unit

# Run integration tests
bun test:integration

# Run E2E tests
bun test:e2e

# Run tests with coverage
bun test:coverage

# Run tests in watch mode
bun test:watch

# Run specific test file
bun test path/to/test.test.ts
```

## Git Workflow

### Branch Strategy

```bash
# Main branches
main              # Production code, protected
develop           # Development integration, protected

# Feature branches (short-lived)
feature/user-auth
feature/dashboard
fix/login-bug
refactor/api-client
docs/update-readme

# Branch naming convention
<type>/<short-description>

# Types: feature, fix, refactor, docs, test, chore
```

### Commit Message Format

```bash
<type>(<scope>): <subject>

<body>

<footer>

# Types:
feat      # New feature
fix       # Bug fix
docs      # Documentation changes
style     # Code style changes (formatting, etc.)
refactor  # Code refactoring
perf      # Performance improvements
test      # Adding or updating tests
chore     # Maintenance tasks

# Examples:
feat(auth): implement OAuth2 login

Add Google and GitHub OAuth providers with secure token handling.
Includes comprehensive tests and error handling.

Closes #123

---

fix(api): resolve race condition in user creation

The user creation endpoint had a race condition when checking for
duplicate emails. Added database-level unique constraint and proper
error handling.

---

refactor(components): simplify button component API

Consolidated variant props and improved TypeScript types.
No breaking changes to existing usage.
```

### Pre-commit Checks

```bash
# .husky/pre-commit
#!/bin/sh

# Run type checking
bun run type-check || exit 1

# Run linter
bun run lint || exit 1

# Run tests
bun run test:unit || exit 1

# Check for debug statements
if git diff --cached | grep -E 'console\.(log|debug|info)'; then
  echo "Error: Console statements found. Remove them before committing."
  exit 1
fi

# Check for TODOs in staged files
if git diff --cached | grep -i 'TODO'; then
  echo "Warning: TODO comments found. Consider addressing them."
fi
```

## Security Best Practices

### Input Validation

```typescript
// ALWAYS validate user input with Zod or similar
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  name: z.string().min(1).max(100),
});

// In API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = userSchema.parse(body);
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ errors: error.errors }, { status: 400 });
    }
  }
}
```

### Authentication & Authorization

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const user = await verifyToken(token);

    // Add user to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

### Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  API_KEY: z.string().min(16),
});

export const env = envSchema.parse(process.env);

// Usage
import { env } from '@/lib/env';
const dbUrl = env.DATABASE_URL; // Type-safe!
```

### SQL Injection Prevention

```typescript
// ✅ GOOD: Use parameterized queries with Drizzle ORM
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const user = await db
  .select()
  .from(users)
  .where(eq(users.email, userEmail))
  .limit(1);

// ❌ BAD: String concatenation
// Never do this!
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### XSS Prevention

```typescript
// React automatically escapes content
// But be careful with dangerouslySetInnerHTML

// ✅ GOOD: Sanitize HTML content
import DOMPurify from 'isomorphic-dompurify';

function SafeHTML({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ❌ BAD: Raw HTML without sanitization
function UnsafeHTML({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
```

## Performance Optimization

### Bundle Size

```bash
# Analyze bundle size
bun run build
bun run analyze

# Lazy load components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if not needed
});

# Code splitting
# Next.js automatically splits by route
# Additional splitting can be done with dynamic imports
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // For above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/..." // Or import image for automatic blur
    />
  );
}
```

### Database Queries

```typescript
// ✅ GOOD: Select only needed columns
const users = await db
  .select({
    id: users.id,
    name: users.name,
    email: users.email,
  })
  .from(users);

// ❌ BAD: Select all columns when not needed
const users = await db.select().from(users);

// ✅ GOOD: Use pagination
const pageSize = 20;
const page = 1;
const users = await db
  .select()
  .from(users)
  .limit(pageSize)
  .offset((page - 1) * pageSize);

// ✅ GOOD: Use indexes
// In schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));
```

## Accessibility

### WCAG 2.1 AA Compliance

```typescript
// Semantic HTML
export function AccessibleButton() {
  return (
    <button
      type="button"
      aria-label="Close dialog"
      aria-pressed="false"
      onClick={handleClick}
    >
      <X className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

// Keyboard navigation
export function AccessibleDialog({ isOpen, onClose }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Dialog content */}
    </div>
  );
}

// Focus management
import { useEffect, useRef } from 'react';

export function Modal({ isOpen }: { isOpen: boolean }) {
  const firstFocusableElement = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstFocusableElement.current?.focus();
    }
  }, [isOpen]);

  return (
    <div>
      <button ref={firstFocusableElement}>Close</button>
      {/* Rest of modal */}
    </div>
  );
}
```

## Monitoring & Logging

### Error Tracking

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export function initErrorTracking() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: process.env.VERCEL_ENV || 'production',
    });
  }
}

// Usage in API route
export async function GET(request: Request) {
  try {
    // API logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/users',
        method: 'GET',
      },
      extra: {
        requestUrl: request.url,
      },
    });

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Analytics

```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }
}

// Usage
import { trackEvent } from '@/lib/analytics';

function handlePurchase() {
  trackEvent('Purchase Completed', {
    product: 'Premium Plan',
    revenue: 99.00,
  });
}
```

## Documentation

### Code Comments

```typescript
// ✅ GOOD: Explain WHY, not WHAT
/**
 * We use a mutex lock here to prevent race conditions when multiple
 * requests try to create the same user simultaneously. The database
 * unique constraint is not enough because we need to check existence
 * before insertion in a separate query.
 */
const lock = await acquireLock(`user:${email}`);

// ❌ BAD: Stating the obvious
// Loop through users
for (const user of users) {
  // ...
}
```

### API Documentation

```typescript
/**
 * Retrieves a user by ID
 *
 * @param id - The user's UUID
 * @returns The user object if found
 * @throws {NotFoundError} If the user doesn't exist
 * @throws {UnauthorizedError} If the caller lacks permission
 *
 * @example
 * ```ts
 * const user = await getUser('123e4567-e89b-12d3-a456-426614174000');
 * console.log(user.name);
 * ```
 */
export async function getUser(id: string): Promise<User> {
  // Implementation
}
```

---

**Remember**: These standards exist to ensure consistency, quality, and maintainability. Follow them rigorously, and the codebase will thank you.
