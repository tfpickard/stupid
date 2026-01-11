# Architectural Principles

## Overview

This document defines the architectural patterns, principles, and decisions for building scalable, maintainable, and production-grade web applications.

**Philosophy**: Good architecture makes the system easy to understand, easy to develop, easy to maintain, and easy to deploy.

## Core Architectural Principles

### 1. Separation of Concerns

Each layer of the application has a single, well-defined responsibility:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│              (UI Components, Pages)                  │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                  Application Layer                   │
│           (Business Logic, Use Cases)                │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                   Domain Layer                       │
│           (Entities, Value Objects)                  │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│               Infrastructure Layer                   │
│        (Database, External APIs, Services)           │
└─────────────────────────────────────────────────────┘
```

### 2. Dependency Inversion

High-level modules should not depend on low-level modules. Both should depend on abstractions.

```typescript
// ❌ BAD: Direct dependency on implementation
class UserService {
  private db: PostgresDatabase;

  async getUser(id: string) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}

// ✅ GOOD: Depend on abstraction
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class UserService {
  constructor(private repository: UserRepository) {}

  async getUser(id: string) {
    return this.repository.findById(id);
  }
}

// Multiple implementations possible
class PostgresUserRepository implements UserRepository {
  async findById(id: string) { /* Implementation */ }
  async save(user: User) { /* Implementation */ }
}

class InMemoryUserRepository implements UserRepository {
  async findById(id: string) { /* Implementation */ }
  async save(user: User) { /* Implementation */ }
}
```

### 3. Single Responsibility Principle

Each module should have one reason to change:

```typescript
// ❌ BAD: Multiple responsibilities
class UserManager {
  validateUser(data: unknown) { /* Validation */ }
  saveUser(user: User) { /* Persistence */ }
  sendWelcomeEmail(user: User) { /* Email */ }
  logUserCreation(user: User) { /* Logging */ }
}

// ✅ GOOD: Single responsibility per class
class UserValidator {
  validate(data: unknown): User { /* Validation */ }
}

class UserRepository {
  save(user: User): Promise<void> { /* Persistence */ }
}

class EmailService {
  sendWelcomeEmail(user: User): Promise<void> { /* Email */ }
}

class AuditLogger {
  logUserCreation(user: User): void { /* Logging */ }
}
```

### 4. Open/Closed Principle

Open for extension, closed for modification:

```typescript
// ✅ GOOD: Extensible without modification
interface PaymentProcessor {
  processPayment(amount: number, method: PaymentMethod): Promise<PaymentResult>;
}

class StripeProcessor implements PaymentProcessor {
  async processPayment(amount: number, method: PaymentMethod) {
    // Stripe implementation
  }
}

class PayPalProcessor implements PaymentProcessor {
  async processPayment(amount: number, method: PaymentMethod) {
    // PayPal implementation
  }
}

// Add new processors without modifying existing code
class CryptoProcessor implements PaymentProcessor {
  async processPayment(amount: number, method: PaymentMethod) {
    // Crypto implementation
  }
}
```

### 5. Composition Over Inheritance

Prefer composition to build complex behaviors:

```typescript
// ❌ AVOID: Deep inheritance hierarchies
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}
class GoldenRetriever extends Dog {}

// ✅ GOOD: Composition
interface Behavior {
  execute(): void;
}

class WalkBehavior implements Behavior {
  execute() { console.log('Walking'); }
}

class BarkBehavior implements Behavior {
  execute() { console.log('Barking'); }
}

class Dog {
  constructor(
    private walkBehavior: Behavior,
    private soundBehavior: Behavior
  ) {}

  walk() { this.walkBehavior.execute(); }
  makeSound() { this.soundBehavior.execute(); }
}
```

## Application Architecture

### Next.js App Router Structure

```typescript
// Modern Next.js architecture with App Router

app/
├── (auth)/                          // Route group (doesn't affect URL)
│   ├── layout.tsx                   // Auth layout
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── (dashboard)/                     // Route group
│   ├── layout.tsx                   // Dashboard layout
│   ├── page.tsx                     // /dashboard
│   ├── profile/
│   │   └── page.tsx                 // /dashboard/profile
│   └── settings/
│       └── page.tsx                 // /dashboard/settings
│
├── api/                             // API routes
│   ├── auth/
│   │   ├── login/route.ts           // POST /api/auth/login
│   │   ├── logout/route.ts          // POST /api/auth/logout
│   │   └── register/route.ts        // POST /api/auth/register
│   └── users/
│       ├── route.ts                 // GET /api/users
│       └── [id]/
│           ├── route.ts             // GET/PATCH/DELETE /api/users/:id
│           └── posts/route.ts       // GET /api/users/:id/posts
│
├── layout.tsx                       // Root layout
├── page.tsx                         // Home page
├── error.tsx                        // Error boundary
├── loading.tsx                      // Loading UI
└── not-found.tsx                    // 404 page
```

### Component Architecture

```typescript
// Component organization by feature

components/
├── ui/                              // Generic, reusable components
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── button.stories.tsx
│   ├── input/
│   ├── card/
│   └── dialog/
│
├── features/                        // Feature-specific components
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── password-reset-form.tsx
│   ├── user/
│   │   ├── user-profile.tsx
│   │   ├── user-avatar.tsx
│   │   └── user-settings.tsx
│   └── posts/
│       ├── post-list.tsx
│       ├── post-card.tsx
│       └── post-editor.tsx
│
└── layouts/                         // Layout components
    ├── header.tsx
    ├── footer.tsx
    ├── sidebar.tsx
    └── page-container.tsx
```

### Data Layer Architecture

```typescript
// Repository pattern for data access

// lib/repositories/user-repository.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

export class DrizzleUserRepository implements UserRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  // ... other methods
}

// lib/services/user-service.ts
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    // Validation
    const validated = createUserSchema.parse(input);

    // Check if user exists
    const existing = await this.userRepo.findByEmail(validated.email);
    if (existing) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password);

    // Create user
    const user = await this.userRepo.create({
      ...validated,
      password: hashedPassword,
    });

    // Send welcome email (fire and forget)
    this.emailService.sendWelcomeEmail(user).catch(error => {
      this.logger.error('Failed to send welcome email', { error, userId: user.id });
    });

    // Log event
    this.logger.info('User created', { userId: user.id });

    return user;
  }
}
```

## API Design Patterns

### RESTful API Design

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users?page=1&limit=20&sort=name
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const sort = searchParams.get('sort') ?? 'createdAt';

  const users = await userService.list({ page, limit, sort });

  return NextResponse.json({
    data: users,
    pagination: {
      page,
      limit,
      total: users.length,
      hasMore: users.length === limit,
    },
  });
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await userService.create(body);

  return NextResponse.json(
    { data: user },
    {
      status: 201,
      headers: {
        'Location': `/api/users/${user.id}`,
      },
    }
  );
}

// app/api/users/[id]/route.ts
// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await userService.getById(params.id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: user });
}

// PATCH /api/users/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const user = await userService.update(params.id, body);

  return NextResponse.json({ data: user });
}

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await userService.delete(params.id);

  return new NextResponse(null, { status: 204 });
}
```

### tRPC (Type-safe APIs)

```typescript
// lib/trpc/routers/user.ts
import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';

export const userRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      return userService.list(input);
    }),

  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      const user = await userService.getById(input);
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(12),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return userService.create(input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check authorization
      if (input.id !== ctx.user.id && !ctx.user.isAdmin) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return userService.update(input.id, input);
    }),
});
```

## State Management Patterns

### Server State (TanStack Query)

```typescript
// lib/hooks/use-user.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Or optimistically update
      queryClient.setQueryData(['users', newUser.id], newUser);
    },
  });
}

// Usage in component
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <div>{user.name}</div>;
}
```

### Client State (Zustand)

```typescript
// lib/stores/ui-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'auto',
      sidebarOpen: true,

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'ui-preferences',
    }
  )
);

// Usage
function Header() {
  const { theme, setTheme, toggleSidebar } = useUIStore();

  return (
    <header>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

## Error Handling Architecture

### Result Type Pattern

```typescript
// lib/utils/result.ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
async function fetchUser(id: string): Promise<Result<User, FetchError>> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return err({ type: 'HTTP_ERROR', status: response.status });
    }

    const data = await response.json();
    return ok(data);

  } catch (error) {
    return err({ type: 'NETWORK_ERROR', message: 'Failed to fetch' });
  }
}

// Consuming code
const result = await fetchUser('123');
if (result.ok) {
  console.log(result.value.name);
} else {
  console.error(result.error);
}
```

### Custom Error Classes

```typescript
// lib/errors/index.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource, id });
  }
}

export class ValidationError extends AppError {
  constructor(errors: unknown[]) {
    super('Validation failed', 'VALIDATION_ERROR', 400, { errors });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

// Usage in API route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userService.getById(params.id);

    if (!user) {
      throw new NotFoundError('User', params.id);
    }

    return NextResponse.json({ data: user });

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code, ...error.metadata },
        { status: error.statusCode }
      );
    }

    // Log unexpected errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Security Architecture

### Authentication Flow

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ Client  │                │  Server │                │   DB    │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │  POST /api/auth/login    │                          │
     │ {email, password}        │                          │
     ├─────────────────────────►│                          │
     │                          │                          │
     │                          │  Fetch user by email     │
     │                          ├─────────────────────────►│
     │                          │                          │
     │                          │◄─────────────────────────┤
     │                          │  User data               │
     │                          │                          │
     │                          │  Verify password         │
     │                          │  (bcrypt.compare)        │
     │                          │                          │
     │                          │  Generate JWT token      │
     │                          │                          │
     │◄─────────────────────────┤                          │
     │  {token, user}           │                          │
     │                          │                          │
     │  Store token in cookie   │                          │
     │                          │                          │
     │  GET /api/protected      │                          │
     │  Cookie: auth-token=xxx  │                          │
     ├─────────────────────────►│                          │
     │                          │                          │
     │                          │  Verify JWT token        │
     │                          │                          │
     │◄─────────────────────────┤                          │
     │  Protected data          │                          │
     │                          │                          │
```

### Authorization Pattern

```typescript
// lib/auth/authorization.ts
export enum Permission {
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  ADMIN_ACCESS = 'admin:access',
}

export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.USER_READ],
  [Role.MODERATOR]: [
    Permission.USER_READ,
    Permission.USER_WRITE,
  ],
  [Role.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.USER_DELETE,
    Permission.ADMIN_ACCESS,
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function requirePermission(permission: Permission) {
  return async function middleware(
    request: NextRequest,
    context: { params: unknown }
  ) {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user.role, permission)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null; // Allow request to proceed
  };
}

// Usage
export const DELETE = compose(
  requirePermission(Permission.USER_DELETE),
  async function handler(request: NextRequest, { params }) {
    await userService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  }
);
```

## Performance Patterns

### Caching Strategy

```typescript
// lib/cache/index.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  // Fetch and cache
  const data = await fetcher();
  await redis.setex(key, ttl, data);

  return data;
}

// Usage
export async function GET() {
  const users = await cached(
    'users:all',
    () => userService.list(),
    60 * 5 // 5 minutes
  );

  return NextResponse.json({ data: users });
}
```

### Optimistic Updates

```typescript
// lib/hooks/use-update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    // Optimistically update the cache
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['users', variables.id] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['users', variables.id]);

      // Optimistically update
      queryClient.setQueryData(['users', variables.id], (old: User) => ({
        ...old,
        ...variables.data,
      }));

      return { previous };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['users', variables.id],
        context?.previous
      );
    },

    // Refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}
```

---

**Remember**: Good architecture is about making the right tradeoffs. Optimize for maintainability first, then performance, then other concerns.
