#!/usr/bin/env bash

set -e

echo "Installing Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/usr/bin/env bash

set -e

echo "🔍 Running pre-commit checks..."
echo ""

# Check if bun is available
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed!"
    exit 1
fi

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx|json)$' || true)

if [ -z "$STAGED_FILES" ]; then
    echo "ℹ️  No TypeScript/JavaScript files to check"
    exit 0
fi

# Run formatter check
echo "📝 Checking code formatting..."
if ! bun run format:check; then
    echo "❌ Formatting check failed"
    echo "💡 Run: bun run format"
    exit 1
fi

# Run linter
echo "🔎 Running linter..."
if ! bun run lint; then
    echo "❌ Linter failed"
    echo "💡 Try running: bun run lint:fix"
    exit 1
fi

# Run type check
echo "🔧 Type checking..."
if ! bun run type-check; then
    echo "❌ Type check failed"
    exit 1
fi

echo ""
echo "✅ All pre-commit checks passed!"
echo ""
EOF

# Pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/usr/bin/env bash

set -e

echo "🚀 Running pre-push checks..."
echo ""

# Run build
echo "🏗️  Building project..."
if ! bun run build; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ All pre-push checks passed!"
echo ""
EOF

# Commit-msg hook
cat > .git/hooks/commit-msg << 'EOF'
#!/usr/bin/env bash

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Conventional commit pattern
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .{1,100}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Commit message must follow conventional commits format:"
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert"
    echo ""
    echo "Examples:"
    echo "  feat(auth): add login functionality"
    echo "  fix(api): resolve CORS issue"
    echo "  docs: update README"
    echo ""
    exit 1
fi
EOF

# Make all hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/commit-msg

echo "✅ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  • pre-commit  - Runs linter, formatter, and type check"
echo "  • pre-push    - Runs build"
echo "  • commit-msg  - Validates commit message format"
echo ""
echo "To bypass hooks temporarily, use: git commit --no-verify"
echo ""
