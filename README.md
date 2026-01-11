# Next.js Production Template

A production-grade Next.js template with **fully automated** setup, modern tooling, comprehensive documentation, and AI-assisted development workflows.

## Key Features

- **🤖 Fully Automated**: One-command setup, automatic deployments, zero manual configuration
- **🚀 Production-First**: No MVPs, prototypes, or placeholders—only production-ready code
- **⚡ Bleeding Edge**: Latest stable versions of Next.js, React, TypeScript, and tooling
- **🛠️ Modern Stack**: Bun, TypeScript, Tailwind CSS, Drizzle ORM, Biome
- **☁️ Vercel Optimized**: Configured for seamless Vercel deployment with Python support
- **🤝 Multi-Agent Architecture**: Structured workflows for collaborative AI development
- **✅ Fully Tested**: Unit, integration, and E2E testing with Vitest and Playwright
- **♿ Accessible**: WCAG 2.1 AA compliance built-in
- **🎨 Theme System**: Dark/light/auto themes with smooth transitions
- **📊 Analytics**: Plausible Analytics integration for privacy-focused tracking
- **🔒 Type-Safe**: Strict TypeScript configuration with comprehensive types
- **🔐 Secure**: OWASP best practices, input validation, and security headers

## Quick Start

### Automated Setup (Recommended)

```bash
# One command to set up everything
git clone https://github.com/yourusername/nextjs-template.git my-project
cd my-project
./scripts/setup.sh
```

The setup script automatically:
- ✅ Configures Git author
- ✅ Installs dependencies
- ✅ Sets up environment files
- ✅ Installs Git hooks
- ✅ Validates everything works

### Manual Setup

```bash
# Clone repository
git clone https://github.com/yourusername/nextjs-template.git my-project
cd my-project

# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development
bun run dev
```

Visit [AUTOMATION.md](./AUTOMATION.md) for automation details or [QUICKSTART.md](./QUICKSTART.md) for manual setup.

## Documentation

- **[AUTOMATION.md](./AUTOMATION.md)** - 🤖 Automation guide (CI/CD, Git hooks, one-command setup)
- **[QUICKSTART.md](./QUICKSTART.md)** - Step-by-step setup guide
- **[CLAUDE.md](./CLAUDE.md)** - AI/Claude integration guidelines and prompting patterns
- **[AGENTS.md](./AGENTS.md)** - Multi-agent development workflows
- **[CODEX.md](./CODEX.md)** - Code generation standards and templates
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development standards and best practices
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architectural patterns and principles
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel deployment guide

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript 5.7+ |
| Package Manager | Bun |
| Styling | Tailwind CSS 4.x |
| Database | PostgreSQL with Drizzle ORM |
| Authentication | NextAuth.js |
| Testing | Vitest + Playwright |
| Linting/Formatting | Biome |
| Deployment | Vercel |
| Analytics | Plausible |
| Python Backend | Python 3.13+ |

## Commands

```bash
# Setup & Automation
bun run setup            # Automated project setup (recommended)
bun run hooks            # Install Git hooks

# Development
bun run dev              # Start dev server
bun run build            # Production build
bun run start            # Start production server
bun run lint             # Lint code
bun run lint:fix         # Fix linting issues
bun run type-check       # Type checking
bun run format           # Format code
bun run format:check     # Check formatting

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:studio        # Open Drizzle Studio
bun run db:seed          # Seed database

# Testing
bun run test             # Run all tests
bun run test:unit        # Unit tests
bun run test:integration # Integration tests
bun run test:e2e         # E2E tests
bun run test:coverage    # Coverage report

# Deployment (Automatic via GitHub Actions)
# Manual deployment (if needed):
vercel                   # Deploy preview
vercel --prod            # Deploy production
```

## Project Structure

```
.
├── .github/             # GitHub configuration
│   ├── workflows/      # CI/CD workflows
│   └── SETUP.md        # GitHub Actions setup guide
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth routes
│   ├── (dashboard)/    # Dashboard routes
│   └── api/            # API routes
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── features/       # Feature-specific components
│   └── layouts/        # Layout components
├── lib/                 # Utilities and shared code
│   ├── db/             # Database (schema, client)
│   ├── auth/           # Authentication
│   └── utils/          # Utility functions
├── scripts/             # Automation scripts
│   ├── setup.sh        # Automated project setup
│   └── install-hooks.sh # Git hooks installer
├── api/                 # Python API functions
├── tests/               # All tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/              # Static assets
└── vercel.json          # Vercel configuration
```

## Core Principles

1. **Production-Grade**: Every feature is fully implemented with no placeholders or TODOs
2. **Type-Safe**: Strict TypeScript with comprehensive types throughout
3. **Tested**: Minimum 80% code coverage with unit, integration, and E2E tests
4. **Secure**: OWASP Top 10 compliance, input validation, output sanitization
5. **Performant**: Optimized bundles, lazy loading, efficient caching
6. **Accessible**: WCAG 2.1 AA compliant with semantic HTML and ARIA labels
7. **Documented**: Comprehensive documentation for all major components

## Contributing

Contributions are welcome! Please read [DEVELOPMENT.md](./DEVELOPMENT.md) for code standards and [CLAUDE.md](./CLAUDE.md) for AI-assisted development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

For questions or issues:
- Check the [documentation](./QUICKSTART.md)
- Search [existing issues](https://github.com/yourusername/nextjs-template/issues)
- Open a [new issue](https://github.com/yourusername/nextjs-template/issues/new)

---

**Built with attention to quality, security, and developer experience.**
