# Code Generation Guide

## Purpose

This document defines standardized instructions for AI-powered code generation agents to safely and effectively generate, modify, and maintain production-grade code in this repository.

**Core Principle**: Generated code must be indistinguishable from code written by experienced senior engineers. No shortcuts, no placeholders, no "TODO" comments.

## Repository Analysis Protocol

### Before Making Any Changes

**CRITICAL**: Always analyze the repository structure and existing patterns before generating or modifying code.

#### Step 1: Understand the Project Structure
```bash
# Examine the directory structure
tree -L 3 -I 'node_modules|.next|.git'

# Identify key configuration files
ls -la *.config.* *.json *.yaml *.yml

# Check package manager
ls -la package-lock.json pnpm-lock.yaml bun.lockb yarn.lock
```

#### Step 2: Analyze Existing Architecture
```typescript
// Questions to answer:
- What framework is being used? (Next.js, Remix, etc.)
- What's the routing strategy? (App Router, Pages Router)
- Where do components live?
- How is state management handled?
- What's the data fetching pattern?
- How are styles organized?
- What testing framework is used?
- How are types organized?
```

#### Step 3: Study Code Patterns
```bash
# Find common patterns
grep -r "export default" --include="*.tsx" --include="*.ts" | head -20
grep -r "import.*from" --include="*.tsx" --include="*.ts" | head -20

# Check component patterns
find . -name "*.tsx" -type f | head -10 | xargs cat

# Check API patterns
find ./api -name "*.ts" -type f 2>/dev/null | xargs cat

# Study test patterns
find . -name "*.test.*" -o -name "*.spec.*" | head -5 | xargs cat
```

#### Step 4: Identify Dependencies
```bash
# Read package.json to understand the tech stack
cat package.json | jq '.dependencies, .devDependencies'

# Check TypeScript configuration
cat tsconfig.json

# Check linter/formatter config
cat biome.json eslint.config.* .prettierrc*
```

### Respect Existing Patterns

**ALWAYS** match the existing codebase patterns:

#### Import Style
```typescript
// If the codebase uses:
import { Component } from '@/components/ui/component'

// Don't use:
import { Component } from '../../components/ui/component'
```

#### Component Structure
```typescript
// If existing components follow this pattern:
export function ComponentName({ prop1, prop2 }: Props) {
  // hooks
  // handlers
  // render
}

// Match it exactly, don't introduce:
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => { ... }
```

#### Naming Conventions
```typescript
// Match existing conventions:
- PascalCase for components: UserProfile, DataTable
- camelCase for functions: fetchUserData, handleSubmit
- UPPER_SNAKE_CASE for constants: MAX_RETRIES, API_BASE_URL
- kebab-case for files: user-profile.tsx, data-table.test.ts
```

## Guardrails & Protocols

### Critical File Protection

**NEVER** modify these files without explicit approval:
- `package.json` (dependencies)
- Database migration files (once applied)
- `.env.production` (production secrets)
- `vercel.json` (production config)
- Any file with `CRITICAL` or `DO NOT MODIFY` comments

### Database Schema Changes

```typescript
// Protocol for schema changes:
1. Create a new migration file (never edit existing ones)
2. Write both "up" and "down" migrations
3. Test migration on development database
4. Document breaking changes
5. Plan data migration if needed
6. Get approval before applying to production

// Example migration:
// migrations/2025-01-10-add-user-preferences.ts
export async function up(db: Database) {
  await db.schema
    .createTable('user_preferences')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('theme', 'text', (col) => col.notNull())
    .addColumn('language', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Database) {
  await db.schema.dropTable('user_preferences').execute();
}
```

### Safe File Edit Protocol

```typescript
// 1. Read the file first
const content = await readFile(filePath);

// 2. Parse and understand the structure
const ast = parse(content);

// 3. Make targeted changes
const modified = transform(ast, {
  // Specific transformations
});

// 4. Validate the changes
const isValid = await validate(modified);
if (!isValid) {
  throw new Error('Invalid code generated');
}

// 5. Write the file
await writeFile(filePath, modified);

// 6. Run tests
await runTests(relatedTestFiles);
```

### Commit Practices

```bash
# Configure git identity
git config user.name "Tom Pickard"
git config user.email "tom@pickard.dev"

# Commit message format
<type>(<scope>): <short summary>

<detailed description of changes>
<reasoning for the approach taken>

<breaking changes if any>

# Types:
# feat: New feature
# fix: Bug fix
# refactor: Code restructuring without behavior change
# perf: Performance improvement
# test: Adding or updating tests
# docs: Documentation changes
# style: Formatting, missing semicolons, etc.
# chore: Maintenance tasks

# Example:
git commit -m "feat(auth): implement password reset flow

- Add /api/auth/password-reset endpoint
- Create PasswordResetForm component
- Add email service integration
- Implement secure token generation
- Add rate limiting (3 requests/hour/IP)

Tested with:
- Unit tests for token generation
- Integration tests for email flow
- E2E tests for user journey"
```

### Error Handling Strategy

```typescript
// ALWAYS implement comprehensive error handling

// ❌ BAD: No error handling
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}

// ✅ GOOD: Complete error handling
async function fetchUser(id: string): Promise<Result<User, FetchError>> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return err({ type: 'NOT_FOUND', message: 'User not found' });
      }
      if (response.status === 401) {
        return err({ type: 'UNAUTHORIZED', message: 'Authentication required' });
      }
      return err({
        type: 'SERVER_ERROR',
        message: `HTTP ${response.status}`,
        status: response.status
      });
    }

    const data = await response.json();
    const parsed = UserSchema.safeParse(data);

    if (!parsed.success) {
      return err({
        type: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        errors: parsed.error.errors
      });
    }

    return ok(parsed.data);

  } catch (error) {
    if (error instanceof TypeError) {
      return err({ type: 'NETWORK_ERROR', message: 'Network request failed' });
    }
    return err({
      type: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

### Fallback Strategies

```typescript
// When code generation fails or produces unexpected results:

// 1. Try a simpler approach
if (complexApproachFailed) {
  return simpleButWorkingSolution();
}

// 2. Break into smaller pieces
if (largeFunctionFailed) {
  return [
    generateSmallPiece1(),
    generateSmallPiece2(),
    generateSmallPiece3()
  ].join('\n');
}

// 3. Use established patterns
if (novelApproachFailed) {
  return useEstablishedPattern();
}

// 4. Document and escalate
if (allApproachesFailed) {
  throw new Error('Unable to generate code. Manual intervention required. Context: ...');
}
```

## Style Rules

### TypeScript Configuration

```json
// tsconfig.json - Always use strict mode
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Code Formatting Rules

#### Biome Configuration (Preferred)
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noConsoleLog": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "error"
      }
    }
  }
}
```

#### Python Formatting (Ruff)
```toml
[tool.ruff]
line-length = 100
target-version = "py313"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "ANN", "S", "B", "A", "C4", "DTZ", "T10", "PIE", "PT", "Q"]
ignore = ["ANN101", "ANN102"]  # Type annotations for self and cls

[tool.pyright]
strictListInference = true
strictDictionaryInference = true
strictSetInference = true
reportUnusedVariable = "error"
reportUnusedImport = "error"
```

### Naming Conventions

```typescript
// Components - PascalCase
export function UserProfile() { }
export function DataTable() { }

// Hooks - camelCase with 'use' prefix
export function useAuth() { }
export function useLocalStorage() { }

// Utilities - camelCase
export function formatDate() { }
export function debounce() { }

// Constants - UPPER_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';
export const MAX_RETRIES = 3;

// Types/Interfaces - PascalCase
export interface UserProfile { }
export type ApiResponse<T> = { }

// Files - kebab-case
// user-profile.tsx
// data-table.test.ts
// use-auth.ts
// api-client.ts
```

### Test Coverage Requirements

```typescript
// Minimum 80% code coverage for:
- All business logic functions
- All API endpoints
- All React components
- All custom hooks
- All utility functions

// Test categories:

// 1. Unit Tests (Vitest)
describe('calculateTotal', () => {
  it('calculates total with tax', () => {
    expect(calculateTotal(100, 0.1)).toBe(110);
  });

  it('handles zero amount', () => {
    expect(calculateTotal(0, 0.1)).toBe(0);
  });

  it('handles negative tax rate', () => {
    expect(() => calculateTotal(100, -0.1)).toThrow();
  });
});

// 2. Integration Tests
describe('User Registration Flow', () => {
  it('creates user and sends welcome email', async () => {
    const result = await registerUser({
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User'
    });

    expect(result.success).toBe(true);
    expect(mockEmailService.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      template: 'welcome'
    });
  });
});

// 3. E2E Tests (Playwright)
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', 'buyer@example.com');
  await page.fill('[name="card"]', '4242424242424242');
  await page.click('[data-testid="complete-purchase"]');

  await expect(page.locator('[data-testid="success-message"]'))
    .toBeVisible();
});
```

### Linting Guidelines

```typescript
// ALWAYS:
- Use const by default, let when mutation is needed, never var
- Prefer functional programming patterns
- Avoid any type (use unknown and type guards instead)
- Use optional chaining (?.) and nullish coalescing (??)
- Destructure objects and arrays
- Use template literals for string interpolation
- Prefer async/await over .then()
- Use early returns to avoid deep nesting

// NEVER:
- console.log in production code (use proper logging)
- Unused variables or imports
- any type without justification
- Non-null assertions (!) unless absolutely certain
- Mutation of function parameters
- Global variables
- Tight coupling between modules
```

## Code Generation Templates

### Component Template

```typescript
// components/ui/button.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### API Route Template (Next.js App Router)

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params
    const { id } = paramsSchema.parse(params);

    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (user.id !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Return data
    return NextResponse.json({ user });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    });

    const updates = updateSchema.parse(body);

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Python API Template (Vercel)

```python
# api/users.py
from http.server import BaseHTTPRequestHandler
import json
import os
from typing import Any, TypedDict
import psycopg2
from psycopg2.extras import RealDictCursor

class User(TypedDict):
    id: str
    email: str
    name: str
    created_at: str

class ErrorResponse(TypedDict):
    error: str
    details: Any | None

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status_code: int = 200) -> None:
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def _get_db_connection(self) -> psycopg2.extensions.connection:
        return psycopg2.connect(
            os.environ['DATABASE_URL'],
            cursor_factory=RealDictCursor
        )

    def _send_json(self, data: Any, status_code: int = 200) -> None:
        self._set_headers(status_code)
        self.wfile.write(json.dumps(data).encode())

    def _send_error(self, error: str, status_code: int = 500, details: Any = None) -> None:
        response: ErrorResponse = {'error': error, 'details': details}
        self._send_json(response, status_code)

    def do_GET(self) -> None:
        try:
            conn = self._get_db_connection()
            cursor = conn.cursor()

            cursor.execute('''
                SELECT id, email, name, created_at
                FROM users
                ORDER BY created_at DESC
                LIMIT 100
            ''')

            users = cursor.fetchall()
            cursor.close()
            conn.close()

            self._send_json({'users': users})

        except psycopg2.Error as e:
            self._send_error('Database error', 500, str(e))
        except Exception as e:
            self._send_error('Internal server error', 500, str(e))

    def do_POST(self) -> None:
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode())

            # Validate required fields
            if 'email' not in data or 'name' not in data:
                self._send_error('Missing required fields', 400)
                return

            conn = self._get_db_connection()
            cursor = conn.cursor()

            cursor.execute('''
                INSERT INTO users (email, name)
                VALUES (%s, %s)
                RETURNING id, email, name, created_at
            ''', (data['email'], data['name']))

            user = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()

            self._send_json({'user': user}, 201)

        except json.JSONDecodeError:
            self._send_error('Invalid JSON', 400)
        except psycopg2.IntegrityError as e:
            self._send_error('User already exists', 409, str(e))
        except psycopg2.Error as e:
            self._send_error('Database error', 500, str(e))
        except Exception as e:
            self._send_error('Internal server error', 500, str(e))
```

### Test Template

```typescript
// components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Cancel</Button>);
    expect(button).toHaveClass('border');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref to button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});
```

## Example System Prompt

Copy this prompt when instructing code generation agents:

```markdown
You are an expert full-stack engineer generating production-grade code.

## Core Requirements
- Production-first: No MVPs, prototypes, or placeholders
- Type-safe: Full TypeScript with strict mode
- Tested: Unit, integration, and E2E tests
- Secure: Input validation, output sanitization, proper error handling
- Accessible: WCAG 2.1 AA compliance
- Performant: Optimized bundles, lazy loading, caching

## Before You Start
1. Analyze the existing codebase structure
2. Study existing patterns and conventions
3. Identify the tech stack and dependencies
4. Understand the project's architecture

## Code Standards
- Use Bun package manager
- Follow existing naming conventions
- Match existing import styles
- Respect established patterns
- Write comprehensive tests
- Include proper error handling
- Add TypeScript types for everything
- Document complex logic

## Git Configuration
- Author: Tom Pickard <tom@pickard.dev>
- Commit format: <type>(<scope>): <description>
- Include detailed commit messages

## Safety Protocols
- Never modify critical files without approval
- Create new migrations, don't edit existing ones
- Test all changes before committing
- Run linter and type checker
- Ensure all tests pass

## Output Format
For each task, provide:
1. Analysis of existing code
2. Implementation plan
3. Complete code with tests
4. Commit message
5. Verification steps

## Quality Checklist
Before considering code complete, verify:
- [ ] TypeScript strict mode passes
- [ ] All tests pass (unit, integration, E2E)
- [ ] Linter passes with no warnings
- [ ] Code follows existing patterns
- [ ] Proper error handling implemented
- [ ] Accessibility requirements met
- [ ] Performance optimized
- [ ] Security best practices followed
- [ ] Documentation added where needed
- [ ] Commit message is clear and descriptive

Begin generating production-grade code.
```

---

**Remember**: Every line of code you generate represents the engineering standards of this project. Quality is non-negotiable.
