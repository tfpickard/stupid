# GitHub Actions Setup Guide

This guide will help you set up GitHub Actions for automated CI/CD.

## Prerequisites

1. A GitHub repository with this code
2. A Vercel account
3. A Vercel project (can be created during this process)

## Step 1: Get Vercel Credentials

### Method 1: Vercel Dashboard (Recommended)

1. **Get Vercel Token:**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it "GitHub Actions"
   - Select appropriate scope (Full Account recommended)
   - Copy the token (you'll only see it once!)

2. **Get Project IDs:**
   - Go to your Vercel project
   - Click "Settings"
   - Scroll down to "General"
   - Copy `Project ID`
   - Copy `Organization ID` (under "Organization" section)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login to Vercel
vercel login

# Link your project (or create new one)
vercel link

# This creates .vercel/project.json with your IDs
cat .vercel/project.json
```

The output will show:
```json
{
  "projectId": "prj_...",
  "orgId": "team_..."
}
```

## Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VERCEL_TOKEN` | Token from Vercel account settings | `ABCdef123...` |
| `VERCEL_ORG_ID` | Organization ID from Vercel | `team_abc123...` |
| `VERCEL_PROJECT_ID` | Project ID from Vercel | `prj_xyz789...` |

### Optional Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your production domain | `https://stupid.hair` |

## Step 3: Verify Setup

### Test the CI Workflow

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify CI workflow"
   git push
   ```
3. Go to **Actions** tab in GitHub
4. Watch the "CI" workflow run
5. All jobs should pass ✅

### Test the Deploy Workflow

1. Push to main branch:
   ```bash
   git checkout main
   git merge your-branch
   git push origin main
   ```
2. Go to **Actions** tab in GitHub
3. Watch the "Deploy to Vercel" workflow run
4. Check the deployment URL in the commit comment

### Test the Preview Workflow

1. Create a pull request
2. Go to **Actions** tab in GitHub
3. Watch the "Preview Deployment" workflow run
4. Check the preview URL in the PR comment

## Step 4: Enable Branch Protection (Recommended)

Protect your main branch to ensure all checks pass before merging:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings
5. Select required status checks:
   - ✅ Lint
   - ✅ Type Check
   - ✅ Build
   - ✅ Security Audit
6. Click **Create**

## Workflow Details

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers on:**
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

**What it does:**
1. Setup: Installs dependencies with caching
2. Lint: Runs Biome linter and formatter
3. Type Check: Validates TypeScript types
4. Build: Builds the Next.js application
5. Security Audit: Checks for vulnerabilities

**Duration:** ~2-3 minutes

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers on:**
- Push to `main` branch
- Manual trigger via Actions tab

**What it does:**
1. Runs full CI checks
2. Builds the application
3. Deploys to Vercel production
4. Comments deployment URL on commit

**Duration:** ~3-5 minutes

### Preview Workflow (`.github/workflows/preview.yml`)

**Triggers on:**
- Pull request opened/updated

**What it does:**
1. Runs full CI checks
2. Builds the application
3. Deploys to Vercel preview
4. Comments preview URL on PR

**Duration:** ~3-5 minutes

## Troubleshooting

### Secrets Not Working

**Error:** `Error: Input required and not supplied: vercel-token`

**Solution:**
1. Verify secrets are named exactly as shown (case-sensitive)
2. Check secrets exist in **Settings → Secrets and variables → Actions**
3. Ensure secrets are set for "Actions" not "Dependabot"

### Build Fails in GitHub Actions but Works Locally

**Possible causes:**
1. Missing environment variables
2. Different Bun version
3. Platform-specific issues

**Debug:**
```yaml
# Add to workflow for debugging
- name: Debug environment
  run: |
    echo "Bun version: $(bun --version)"
    echo "Node version: $(node --version)"
    echo "PWD: $(pwd)"
    echo "Files: $(ls -la)"
```

### Deployment Fails

**Error:** `Error: Invalid vercel-project-id`

**Solution:**
1. Verify `VERCEL_PROJECT_ID` is correct
2. Ensure project exists in Vercel
3. Check organization ID matches

**Error:** `Error: Insufficient permissions`

**Solution:**
1. Recreate Vercel token with "Full Account" scope
2. Update `VERCEL_TOKEN` secret

### Preview Deployment Not Creating

**Issue:** PR created but no preview deployment

**Solution:**
1. Check **Actions** tab for workflow run
2. Verify preview workflow is enabled
3. Check Vercel project settings allow preview deployments

## Advanced Configuration

### Custom Environment Variables

Add environment variables to Vercel:

```bash
# Via CLI
vercel env add CUSTOM_VAR production
vercel env add CUSTOM_VAR preview

# Or via Dashboard
# Project Settings → Environment Variables
```

Then use in workflows:

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: bun run build
  env:
    CUSTOM_VAR: ${{ secrets.CUSTOM_VAR }}
```

### Custom Deployment Domains

Configure custom domains in Vercel:

```bash
# Via CLI
vercel domains add stupid.hair

# Or via Dashboard
# Project Settings → Domains
```

### Slack Notifications

Add Slack notifications for deployments:

```yaml
# Add to deploy.yml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Verification Checklist

After setup, verify:

- [ ] All GitHub secrets are configured
- [ ] CI workflow runs on push
- [ ] Deploy workflow runs on main push
- [ ] Preview workflow runs on PR
- [ ] Vercel deployments succeed
- [ ] Deployment URLs are commented
- [ ] Branch protection is enabled
- [ ] Status checks are required

## Next Steps

1. **Configure automatic deployments** for preview/production
2. **Set up monitoring** (Sentry, LogRocket)
3. **Add performance testing** to CI
4. **Configure deployment notifications** (Slack, email)
5. **Set up database migrations** workflow

## Support

If you encounter issues:

1. Check [AUTOMATION.md](../AUTOMATION.md) for common issues
2. Review workflow logs in **Actions** tab
3. Verify all secrets are correct
4. Check Vercel deployment logs
5. Open an issue in the repository

---

**Congratulations!** Your CI/CD pipeline is now fully automated. Every push triggers tests, every PR gets a preview, and every merge to main deploys to production.
