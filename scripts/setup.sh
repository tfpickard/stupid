#!/usr/bin/env bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Print banner
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║          Automated Project Setup Script                  ║"
echo "║          Production-Grade Next.js Template               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Bun is installed
info "Checking for Bun installation..."
if ! command -v bun &> /dev/null; then
    error "Bun is not installed!"
    echo ""
    echo "Please install Bun first:"
    echo "  curl -fsSL https://bun.sh/install | bash"
    echo ""
    exit 1
fi
success "Bun is installed ($(bun --version))"

# Check if git is installed
info "Checking for Git installation..."
if ! command -v git &> /dev/null; then
    error "Git is not installed!"
    exit 1
fi
success "Git is installed ($(git --version | head -n1))"

# Configure Git
info "Configuring Git author information..."
git config user.name "Tom Pickard"
git config user.email "tom@pickard.dev"
success "Git configured (Tom Pickard <tom@pickard.dev>)"

# Setup environment variables
info "Setting up environment variables..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        success "Created .env.local from .env.example"
        warning "Please update .env.local with your actual values"
    else
        warning "No .env.example found, skipping .env.local creation"
    fi
else
    warning ".env.local already exists, skipping"
fi

# Install dependencies
info "Installing dependencies with Bun..."
bun install
success "Dependencies installed"

# Run type check
info "Running TypeScript type check..."
if bun run type-check; then
    success "Type check passed"
else
    error "Type check failed"
    exit 1
fi

# Run linter
info "Running linter..."
if bun run lint; then
    success "Linter passed"
else
    warning "Linter found issues (non-fatal)"
fi

# Run build
info "Building application..."
if bun run build; then
    success "Build successful"
else
    error "Build failed"
    exit 1
fi

# Setup git hooks
info "Setting up Git hooks..."
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/usr/bin/env bash

echo "Running pre-commit checks..."

# Run type check
echo "  → Type checking..."
if ! bun run type-check; then
    echo "❌ Type check failed. Commit aborted."
    exit 1
fi

# Run linter
echo "  → Linting..."
if ! bun run lint; then
    echo "❌ Linter failed. Commit aborted."
    echo "💡 Try running: bun run lint:fix"
    exit 1
fi

echo "✅ All pre-commit checks passed!"
EOF

chmod +x .git/hooks/pre-commit
success "Git hooks configured"

# Print summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║                  Setup Complete! 🎉                       ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
info "Next steps:"
echo "  1. Update .env.local with your actual values"
echo "  2. Start development server: bun run dev"
echo "  3. Visit http://localhost:3000"
echo ""
info "Useful commands:"
echo "  bun run dev         - Start development server"
echo "  bun run build       - Build for production"
echo "  bun run lint        - Run linter"
echo "  bun run lint:fix    - Fix linting issues"
echo "  bun run type-check  - Type check"
echo ""
success "Happy coding! 🚀"
echo ""
