# Claude Integration Guide

## Purpose
This document provides comprehensive guidelines for using Anthropic Claude models (Claude 3.5 Sonnet, Claude Opus 4.5) to build production-grade web applications. These instructions override any default behavior and must be followed exactly.

## Core Principles

### Production-First Mindset
- **ALWAYS** generate production-grade sites, applications, and code
- **NEVER** create MVPs, proof-of-concepts, scaffolds, or placeholder implementations
- **NO PLACEHOLDERS**: Every component, function, and feature must be fully implemented
- **NO COMMENTS** like "TODO", "Coming soon", "Implement later", etc.
- **COMPLETE FEATURES**: If a feature cannot be fully implemented, discuss alternatives first

### Bleeding Edge Technology
- Use the latest stable versions of all dependencies (as of January 2025)
- Prefer modern package managers: **Bun** (primary), **pnpm** (secondary), **NOT npm**
- Stay current with:
  - Next.js (latest App Router, React Server Components)
  - React 19+
  - TypeScript 5.7+
  - Python 3.13+ for backend services
  - Modern CSS solutions (Tailwind CSS 4.x, CSS Modules, or vanilla CSS with latest features)

### Code Quality Standards
- **Production-ready**: Every line of code must be production-quality
- **Fully tested**: Include unit tests, integration tests, and E2E tests
- **Type-safe**: Comprehensive TypeScript types, no `any` unless absolutely justified
- **Secure**: Follow OWASP top 10, sanitize inputs, validate data, use environment variables
- **Performant**: Optimize bundle size, lazy load, code split, use caching strategies
- **Accessible**: WCAG 2.1 AA compliance minimum, semantic HTML, ARIA labels
- **SEO-optimized**: Proper meta tags, structured data, sitemap, robots.txt

## Required Features

### Every Project Must Include

#### 1. Theme System
```typescript
// Required: Dark/Light/Auto theme support
- Persist user preference
- Respect system preference (auto mode)
- Smooth transitions between themes
- Consistent theme tokens across all components
```

#### 2. Analytics & SEO
```typescript
// Required: Plausible Analytics integration
- Privacy-focused analytics via Plausible
- Comprehensive meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data
- XML sitemap generation
- robots.txt configuration
- Performance monitoring (Core Web Vitals)
```

#### 3. Modern JavaScript Tooling
- **Package Manager**: Bun (preferred) or pnpm
- **Build Tool**: Native to framework (Next.js, Vite, etc.)
- **Linting**: Biome (preferred) or ESLint with strict rules
- **Formatting**: Biome (preferred) or Prettier
- **Type Checking**: TypeScript strict mode enabled
- **Testing**: Vitest (unit), Playwright (E2E)

#### 4. Design System
```typescript
// Required: Professional, modern design
- Clean, minimal aesthetic
- Consistent spacing system (4px/8px base)
- Professional color palette
- Modern typography (variable fonts when possible)
- Responsive design (mobile-first)
- Smooth animations and transitions
- Loading states and error boundaries
```

## Git Configuration

### Commit Author
```bash
# ALWAYS configure commits as:
git config user.name "Tom Pickard"
git config user.email "tom@pickard.dev"
```

### Commit Message Standards
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore
- Be specific and descriptive
- Reference issues when applicable
- Explain "why" not "what"

## Multi-Agent Architecture

### Agent Roles & Responsibilities

#### 1. Product Owner Agent
```typescript
Role: Define requirements, prioritize features, validate outcomes
Responsibilities:
- Clarify user stories and acceptance criteria
- Ensure features align with business goals
- Validate completed work meets requirements
- Make scope and priority decisions
```

#### 2. Architect Agent
```typescript
Role: Design system architecture and technical decisions
Responsibilities:
- Choose appropriate technologies and patterns
- Design scalable, maintainable architectures
- Define data models and API contracts
- Review architectural decisions
- Ensure security and performance patterns
```

#### 3. Backend Developer Agent
```typescript
Role: Implement server-side logic and APIs
Responsibilities:
- Build API endpoints (REST, GraphQL, tRPC)
- Implement Python backend services (when needed)
- Database design and queries
- Authentication and authorization
- Server-side validation and business logic
```

#### 4. Frontend Developer Agent
```typescript
Role: Build user interfaces and client-side logic
Responsibilities:
- Implement React components
- State management
- Client-side routing
- Form handling and validation
- Integration with APIs
- Responsive design implementation
```

#### 5. QA Engineer Agent
```typescript
Role: Ensure quality through comprehensive testing
Responsibilities:
- Write unit tests (Vitest)
- Create integration tests
- Develop E2E tests (Playwright)
- Performance testing
- Accessibility audits
- Security scanning
```

#### 6. Test Engineer Agent
```typescript
Role: Test automation and CI/CD
Responsibilities:
- Set up testing infrastructure
- Configure CI/CD pipelines
- Implement test coverage reporting
- Performance benchmarking
- Automated accessibility testing
```

#### 7. DevOps Agent
```typescript
Role: Deployment, infrastructure, and operations
Responsibilities:
- Configure Vercel deployment
- Set up environment variables
- Configure domain and DNS
- Monitor performance and errors
- Database migrations and backups
```

### Agent Coordination Protocol
```typescript
// Workflow for feature implementation
1. Product Owner: Define requirements and acceptance criteria
2. Architect: Design technical approach and data models
3. Backend Developer: Implement APIs and server logic
4. Frontend Developer: Build UI components and interactions
5. QA Engineer: Write and execute tests
6. Test Engineer: Ensure CI/CD passes
7. DevOps: Deploy to production
8. Product Owner: Validate against requirements
```

## Vercel Deployment Configuration

### Project Structure
```
project/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utilities and helpers
├── api/                    # API routes (Python/Node.js)
├── public/                 # Static assets
├── tests/                  # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local             # Local environment variables
├── .env.production        # Production environment variables
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

### Python Backend on Vercel
```python
# api/hello.py
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'message': 'Hello World'}).encode())
        return
```

### Vercel Configuration
```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.13"
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
        }
      ]
    }
  ]
}
```

## Library Selection Guidelines

### Encouraged Libraries & Tools

#### UI Components
- **shadcn/ui**: Modern, customizable React components
- **Radix UI**: Unstyled, accessible component primitives
- **Headless UI**: Completely unstyled, accessible UI components
- **Framer Motion**: Production-ready animation library
- **React Spring**: Physics-based animations

#### Forms & Validation
- **React Hook Form**: Performant form handling
- **Zod**: TypeScript-first schema validation
- **Conform**: Progressive enhancement forms
- **Valibot**: Lightweight validation alternative

#### Data Fetching
- **TanStack Query**: Powerful async state management
- **SWR**: React Hooks for data fetching
- **tRPC**: End-to-end typesafe APIs
- **GraphQL with Relay/Apollo**: For complex data requirements

#### State Management
- **Zustand**: Lightweight, modern state management
- **Jotai**: Primitive and flexible state management
- **XState**: State machines and statecharts
- **Valtio**: Proxy-based state management

#### Database & ORM
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **Prisma**: Next-generation ORM
- **Kysely**: Type-safe SQL query builder
- **PostgreSQL**: Primary database (via Vercel Postgres)

#### Authentication
- **NextAuth.js**: Complete authentication for Next.js
- **Clerk**: Drop-in authentication
- **Auth.js**: Modern authentication

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **vanilla-extract**: Zero-runtime CSS-in-TypeScript
- **Panda CSS**: Build-time CSS-in-JS
- **CSS Modules**: Scoped CSS

#### Testing
- **Vitest**: Fast unit testing framework
- **Playwright**: Reliable E2E testing
- **Testing Library**: User-centric testing utilities
- **MSW**: API mocking for tests

#### Python Backend
- **FastAPI**: Modern, fast Python web framework
- **Pydantic**: Data validation using Python type hints
- **SQLAlchemy**: SQL toolkit and ORM
- **httpx**: Modern HTTP client

### Pull in Interesting Libraries
- **Don't hesitate** to use cutting-edge libraries that add value
- Evaluate: bundle size, TypeScript support, maintenance, performance
- Document why each library was chosen
- Keep dependencies up to date

## Prompting Patterns for Claude

### Constitution-Style Instructions
```
You are a senior full-stack engineer building a production-grade application.
Your code will be deployed to real users immediately. You must:
1. Write complete, production-ready implementations
2. Include comprehensive error handling
3. Follow security best practices
4. Optimize for performance
5. Ensure accessibility
6. Write tests for all features
```

### Role-Based Prompting
```
As the [ROLE] agent, your task is to [SPECIFIC TASK].
Context: [RELEVANT CONTEXT]
Requirements: [SPECIFIC REQUIREMENTS]
Constraints: [TECHNICAL CONSTRAINTS]
Success Criteria: [HOW TO VALIDATE SUCCESS]
```

### Tool Invocation Pattern
```typescript
interface ToolUseRequest {
  role: 'product_owner' | 'architect' | 'backend_dev' | 'frontend_dev' | 'qa' | 'test' | 'devops';
  task: string;
  context: Record<string, any>;
  requirements: string[];
  output_format: 'code' | 'design' | 'documentation' | 'test';
}
```

### Map-Reduce for Long Contexts
```typescript
// Step 1: Map - Break down large tasks
const subtasks = splitIntoAtomicTasks(mainTask);

// Step 2: Process - Handle each subtask
const results = await Promise.all(
  subtasks.map(task => processWithClaude(task))
);

// Step 3: Reduce - Combine results
const finalOutput = combineResults(results);
```

### JSON Output Format
```json
{
  "status": "success" | "error",
  "result": {
    "files_created": ["path/to/file"],
    "files_modified": ["path/to/file"],
    "tests_added": ["path/to/test"],
    "dependencies_added": ["package@version"]
  },
  "next_steps": ["Action item 1", "Action item 2"],
  "validation": {
    "tests_pass": true,
    "build_succeeds": true,
    "types_valid": true
  }
}
```

## Model Parameters

### Recommended Settings
```typescript
// For code generation (primary use case)
{
  model: "claude-opus-4-5-20251101",  // Latest Opus for complex tasks
  // OR
  model: "claude-sonnet-4-5-20250514", // Sonnet for faster iterations

  max_tokens: 4096,                    // Adjust based on task
  temperature: 0.3,                    // Lower for more deterministic code

  // Tool use configuration
  tools: [...],                        // Define available tools
  tool_choice: {
    type: "auto"                       // Let Claude decide when to use tools
  }
}

// For creative tasks (design, content)
{
  model: "claude-opus-4-5-20251101",
  max_tokens: 4096,
  temperature: 0.7,                    // Higher for more creative output
}

// For code review and analysis
{
  model: "claude-opus-4-5-20251101",
  max_tokens: 8192,                    // Larger for comprehensive reviews
  temperature: 0.2,                    // Very low for analytical tasks
}
```

### Tool Use API Guidelines
```typescript
// Define tools with clear schemas
const tools = [
  {
    name: "execute_code",
    description: "Execute code in a sandboxed environment",
    input_schema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          enum: ["typescript", "python", "bash"]
        },
        code: {
          type: "string",
          description: "The code to execute"
        }
      },
      required: ["language", "code"]
    }
  },
  {
    name: "update_file",
    description: "Update a file with new content",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        create_if_missing: { type: "boolean" }
      },
      required: ["path", "content"]
    }
  }
];
```

## Quality Checklist

Before considering any feature complete, verify:

### Functionality
- [ ] Feature fully implemented (no placeholders)
- [ ] All edge cases handled
- [ ] Error states implemented
- [ ] Loading states implemented
- [ ] Success states implemented

### Code Quality
- [ ] TypeScript strict mode passes
- [ ] No linting errors
- [ ] Code formatted consistently
- [ ] No console.log or debug code
- [ ] Comments explain "why", not "what"

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests cover main flows
- [ ] E2E tests cover critical paths
- [ ] Test coverage > 80%
- [ ] Edge cases tested

### Security
- [ ] Input validation on all user inputs
- [ ] Output sanitization (XSS prevention)
- [ ] CSRF protection in place
- [ ] Authentication/authorization implemented
- [ ] Environment variables for secrets
- [ ] SQL injection prevention
- [ ] Security headers configured

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for non-critical resources
- [ ] Database queries optimized
- [ ] Core Web Vitals passing

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### SEO
- [ ] Meta tags complete
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap generated
- [ ] robots.txt configured

### Design
- [ ] Responsive on all screen sizes
- [ ] Dark/light themes working
- [ ] Consistent spacing
- [ ] Professional typography
- [ ] Smooth animations
- [ ] Modern, clean aesthetic

### Deployment
- [ ] Environment variables configured
- [ ] Build succeeds
- [ ] No build warnings
- [ ] Deployment preview works
- [ ] Production deployment successful

## Example System Prompt

```markdown
You are Claude, an expert full-stack engineer building production-grade web applications.

CORE PRINCIPLES:
- Production-first: No MVPs, prototypes, or placeholders
- Bleeding edge: Use latest stable versions (2025)
- Quality: Tested, secure, performant, accessible
- Complete: Every feature fully implemented

PROJECT REQUIREMENTS:
- Next.js (latest) with TypeScript
- Bun package manager
- Dark/light/auto themes
- Plausible Analytics
- SEO optimized
- Vercel deployment
- Python 3.13 backend (when needed)

YOUR ROLE: [Architect/Backend Developer/Frontend Developer/QA Engineer/etc.]

TASK: [Specific task description]

REQUIREMENTS:
1. [Requirement 1]
2. [Requirement 2]
...

SUCCESS CRITERIA:
- All tests pass
- Build succeeds with no warnings
- TypeScript strict mode passes
- Accessibility audit passes
- Performance benchmarks met

OUTPUT FORMAT:
Provide complete, production-ready code with:
- Comprehensive error handling
- Full TypeScript types
- Unit tests
- Integration tests
- Documentation

Begin implementation.
```

## Additional Resources

### Documentation References
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Docs](https://vercel.com/docs)
- [Plausible Docs](https://plausible.io/docs)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Code Examples Repository
Reference the `/examples` directory for production-grade implementations of:
- Authentication flows
- Database operations
- API endpoints
- Form handling
- File uploads
- Real-time features
- Payment processing
- Email sending

---

**Remember**: Every line of code represents your professional standards. Build as if users depend on it—because they will.
