# Sora Video Sync

Automatic synchronization of Sora videos from user **goatspeed** to your portfolio site.

## Overview

This system automatically fetches new videos posted by user `goatspeed` on Sora (OpenAI's video generation platform) and adds them to your site's feed. Videos are synced every 6 hours via GitHub Actions and appear instantly in your portfolio.

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. GitHub Actions runs every 6 hours                  │
│     ↓                                                   │
│  2. Sync script calls Sora API                         │
│     ↓                                                   │
│  3. Fetches new videos for "goatspeed"                 │
│     ↓                                                   │
│  4. Downloads video files & thumbnails                 │
│     ↓                                                   │
│  5. Generates MDX files in content/media               │
│     ↓                                                   │
│  6. Commits new videos to repository                   │
│     ↓                                                   │
│  7. Vercel auto-deploys with new videos                │
│     ↓                                                   │
│  8. Videos appear in feed immediately                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Setup

### 1. Get Sora API Credentials

Currently, Sora API is in limited beta. Get access at:
- https://platform.openai.com/sora

Once you have access:
1. Get your API key from: https://platform.openai.com/api-keys
2. Note your Sora username (in this case: `goatspeed`)

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Required |
|------------|-------------|----------|
| `SORA_API_KEY` | OpenAI API key with Sora access | Yes |
| `SORA_API_BASE_URL` | Custom API endpoint (optional) | No |
| `SORA_RSS_URL` | RSS feed URL (fallback method) | No |

### 3. Enable GitHub Actions

The sync workflow is already configured in `.github/workflows/sync-sora.yml`. It will:
- Run automatically every 6 hours
- Can be triggered manually from Actions tab
- Commits new videos to your repository
- Triggers deployment automatically

### 4. Configure Local Development

For testing locally:

```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local and add:
SORA_API_KEY=your-api-key-here
SORA_USERNAME=goatspeed
```

## Usage

### Automatic Sync (Production)

The sync happens automatically every 6 hours via GitHub Actions. No manual intervention needed.

**Schedule:**
- 12:00 AM UTC
- 6:00 AM UTC
- 12:00 PM UTC
- 6:00 PM UTC

### Manual Sync

#### Via GitHub Actions

1. Go to **Actions** tab
2. Select "Sync Sora Videos" workflow
3. Click "Run workflow"
4. Configure options:
   - Username (default: goatspeed)
   - Limit (default: 20)
   - Dry run (preview without creating files)
5. Click "Run workflow"

#### Via Command Line

```bash
# Sync videos (creates actual files)
bun run sora:sync

# Dry run (preview without creating files)
bun run sora:sync:dry

# Custom options
bun run scripts/sync-sora-videos.ts --username=goatspeed --limit=10

# Force re-sync existing videos
bun run scripts/sync-sora-videos.ts --force
```

## CLI Options

```bash
bun run scripts/sync-sora-videos.ts [options]

Options:
  --username=<name>    Sora username (default: goatspeed)
  --limit=<number>     Max videos to fetch (default: 20)
  --dry-run            Preview without creating files
  --force              Re-sync existing videos
```

## What Gets Synced

For each Sora video, the script:

1. **Downloads video file** → `public/media/{slug}.mp4`
2. **Downloads thumbnail** → `public/media/{slug}-poster.jpg`
3. **Creates MDX file** → `content/media/{slug}.mdx`

### MDX File Structure

```yaml
---
title: "Video Title"
createdAt: "2025-01-11T00:00:00.000Z"
type: video
source: sora
visibility: public
tags:
  - sora
  - ai-video
  - creative
description: "Video prompt/description"
assets:
  poster: /media/video-poster.jpg
  src: /media/video.mp4
  width: 1920
  height: 1080
  durationSec: 10
sora:
  username: goatspeed
  soraId: "abc123..."
  prompt: "The original Sora prompt"
  model: sora-1.0
---

## Prompt

The original Sora prompt...

Auto-synced from Sora on 2025-01-11.
```

## Video Lifecycle

### New Video Posted

1. User posts video on Sora
2. Sync runs (next scheduled time or manual trigger)
3. Video detected as new
4. Files downloaded and MDX created
5. Changes committed to repository
6. Vercel deploys automatically
7. Video appears in feed

### Video Already Synced

- Script checks `soraId` in existing MDX files
- Skips videos that are already synced
- Use `--force` to re-sync if needed

### Failed Downloads

- Videos that fail to download are skipped
- Error logged in workflow output
- Other videos continue to process
- Re-run workflow to retry failed videos

## Monitoring

### Check Sync Status

**GitHub Actions:**
- Go to **Actions** tab
- Select "Sync Sora Videos" workflow
- View recent runs and logs

**Workflow Summary:**
- Number of videos processed
- Created, skipped, and failed counts
- Detailed logs for each video

### Notifications

Failed workflows will:
- Send email notifications (if enabled)
- Show as failed in Actions tab
- Can be re-run manually

## Troubleshooting

### No Videos Synced

**Possible causes:**
1. Sora API key not configured
2. API key doesn't have Sora access
3. User has no public videos
4. API endpoint is incorrect

**Debug:**
```bash
# Test locally with dry run
bun run sora:sync:dry

# Check logs for error messages
```

### API Rate Limits

If you hit rate limits:
- Reduce `--limit` parameter
- Increase sync interval in workflow
- Use `--dry-run` for testing

### Download Failures

If videos fail to download:
- Check network connectivity
- Verify video URLs are accessible
- Check file permissions for `public/media/`
- Re-run sync to retry

### Duplicate Videos

If same video syncs multiple times:
- Check `soraId` is unique in frontmatter
- Verify `videoExists()` function works
- Use `--force` flag intentionally only

## Advanced Configuration

### Custom API Endpoint

If using a custom Sora API:

```bash
# .env.local
SORA_API_BASE_URL=https://custom-sora-api.com/v1
```

### RSS Fallback

If API is unavailable, configure RSS:

```bash
# .env.local
SORA_RSS_URL=https://sora.openai.com/users/{username}/feed.xml
```

### Custom Sync Schedule

Edit `.github/workflows/sync-sora.yml`:

```yaml
on:
  schedule:
    # Every 12 hours instead of 6
    - cron: '0 */12 * * *'
```

### Filter Videos

Modify `sync-sora-videos.ts` to add filtering:

```typescript
// Only sync videos with specific tags
const videos = (await fetchSoraUserVideos(USERNAME, LIMIT))
  .filter(v => v.tags?.includes('portfolio'));
```

## File Structure

```
.
├── .github/workflows/
│   └── sync-sora.yml              # GitHub Actions workflow
├── content/media/
│   ├── 2025-01-11-video-1-abc123.mdx
│   ├── 2025-01-11-video-2-def456.mdx
│   └── ...
├── public/media/
│   ├── 2025-01-11-video-1-abc123.mp4
│   ├── 2025-01-11-video-1-abc123-poster.jpg
│   └── ...
├── lib/
│   └── sora-api.ts                # Sora API client
├── scripts/
│   └── sync-sora-videos.ts        # Sync script
└── docs/
    └── SORA-SYNC.md               # This file
```

## API Reference

### SoraClient

```typescript
import { SoraClient } from '@/lib/sora-api';

const client = new SoraClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.openai.com/v1/sora',
});

// Fetch user videos
const videos = await client.fetchUserVideos('goatspeed', 20);

// Fetch single video
const video = await client.fetchVideoById('video-id');
```

### Video Data Structure

```typescript
interface SoraVideo {
  id: string;              // Unique video ID
  title: string;           // Video title
  prompt: string;          // Generation prompt
  username: string;        // Creator username
  createdAt: string;       // ISO date string
  videoUrl: string;        // Video file URL
  posterUrl?: string;      // Thumbnail URL
  model?: string;          // Sora model version
  duration?: number;       // Duration in seconds
  width?: number;          // Video width
  height?: number;         // Video height
  tags?: string[];         // Associated tags
}
```

## Security Notes

- **Never commit API keys** to the repository
- API keys are stored in GitHub Secrets (encrypted)
- Keys are only accessible during workflow execution
- Local `.env.local` is in `.gitignore`

## Cost Considerations

- **API calls**: Each sync makes 1 API call
- **Storage**: Videos are stored in your repository
- **Bandwidth**: Downloads happen during sync
- **Vercel**: Triggers deployment on each sync

**Recommendations:**
- Limit videos per sync (`--limit=10`)
- Sync only new videos (default behavior)
- Monitor repository size

## Next Steps

1. **Get Sora API access** from OpenAI
2. **Configure GitHub Secrets** with your API key
3. **Run manual sync** to test: `bun run sora:sync:dry`
4. **Enable automatic sync** (already configured)
5. **Monitor Actions tab** for successful syncs

## Support

For issues or questions:
- Check workflow logs in Actions tab
- Review error messages in sync output
- Test locally with `--dry-run` flag
- Open issue in repository

---

**Enjoy automatic Sora video syncing! 🎬**
