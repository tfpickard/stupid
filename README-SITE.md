# stupid.hair

A fast, minimal, expandable portfolio website showcasing Sora creations by [@goatspeed](https://twitter.com/goatspeed).

## Features

- **MDX-powered content**: Write rich, interactive content with custom components
- **Infinite scroll feed**: Smooth doom-scroll browsing with cursor-based pagination
- **Full-text search**: Search by title, description, or tags
- **Type filters**: Filter by video, image, game, or other media types
- **Tag system**: Organize and filter content by tags
- **RSS feed**: Subscribe at `/rss.xml` or `/feed.xml`
- **SEO optimized**: Full Open Graph and Twitter Card support
- **Responsive**: Works beautifully on all screen sizes
- **Type-safe**: Full TypeScript coverage with Zod schema validation
- **Production-ready**: Built with Next.js 15 App Router and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 4
- **Content**: MDX with next-mdx-remote
- **Validation**: Zod
- **Linting**: Biome
- **Deployment**: Vercel-ready

## Project Structure

```
stupid/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home feed
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── m/[slug]/            # Media detail pages
│   ├── videos/              # Videos filter view
│   ├── photos/              # Photos filter view
│   ├── games/               # Games view
│   ├── api/
│   │   ├── feed/           # Feed API endpoint
│   │   └── tags/           # Tags API endpoint
│   ├── rss.xml/            # RSS feed
│   └── feed.xml/           # RSS alias
├── components/              # React components
│   ├── header.tsx
│   ├── media-card.tsx
│   ├── media-viewer.tsx
│   ├── infinite-feed.tsx
│   ├── feed-filters.tsx
│   └── mdx-components.tsx   # Custom MDX components
├── content/
│   └── media/              # MDX content files
│       ├── example-sora-video.mdx
│       └── example-experimental-image.mdx
├── lib/                     # Core utilities
│   ├── schema.ts           # Zod schemas and types
│   ├── content.ts          # MDX loader and index
│   ├── pagination.ts       # Cursor-based pagination
│   └── rss.ts              # RSS feed generation
├── public/
│   └── media/              # Static media assets
├── scripts/                 # CLI tools
│   ├── media-add.ts        # Add new media
│   ├── media-validate.ts   # Validate content
│   └── media-build-index.ts # Build index
└── .generated/              # Generated artifacts
    └── media-index.json
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- Node.js 18+ (for Vercel deployment)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd stupid

# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Content Authoring

### Adding New Media

Use the interactive CLI tool:

```bash
bun run media:add
```

This will prompt you for:
- Title
- Type (video/image/game/other)
- Source (sora/upload/external)
- Tags
- Description
- Asset paths
- Sora metadata (if applicable)

The script generates an MDX file in `content/media/` with frontmatter and a content template.

### Manual Creation

Create a new `.mdx` file in `content/media/`:

```mdx
---
title: "Your Title"
createdAt: "2025-01-11T00:00:00.000Z"
type: video
source: sora
visibility: public
tags:
  - sora
  - experimental
description: "A short description"
assets:
  poster: /media/your-poster.jpg
  src: /media/your-video.mp4
sora:
  username: goatspeed
  prompt: "Your Sora prompt here"
---

Write your content here using MDX.

You can use custom components like:

<PromptBlock>
Your Sora prompt
</PromptBlock>

<Callout type="info">
Info, warning, error, or success callouts
</Callout>

## Heading

Regular markdown works too!
```

### Frontmatter Schema

```typescript
{
  title: string                    // Required
  createdAt: string                // ISO date, required
  type: "video" | "image" | "game" | "other"  // Required
  source: "sora" | "upload" | "external"      // Default: sora
  visibility: "public" | "unlisted"           // Default: public
  tags: string[]                   // Default: []
  description?: string
  assets: {
    poster?: string               // Image URL or path
    src?: string                  // Media URL or path
    sources?: Array<{             // For multiple video sources
      src: string
      type: string               // e.g., "video/mp4"
    }>
    width?: number
    height?: number
    durationSec?: number
    embedUrl?: string            // For iframe embeds (games)
  }
  sora?: {
    username: string              // Sora username
    soraId?: string              // Sora creation ID
    prompt?: string              // Generation prompt
    model?: string               // Model version
  }
}
```

### Custom MDX Components

Available components:

- `<PromptBlock>` - Styled prompt display
- `<Callout type="info|warning|error|success">` - Colored callouts
- `<TagList tags={[...]} />` - Tag display
- `<MediaEmbed src="..." type="video|image" caption="..." />` - Embedded media

### Validating Content

```bash
bun run media:validate
```

This checks:
- Frontmatter schema compliance
- Required fields presence
- Asset file existence (for local paths)
- Filename format (must be lowercase-with-hyphens)

### Building Index

```bash
bun run media:build-index
```

Generates `.generated/media-index.json` with statistics.

## Media Assets

### Local Assets

Place media files in `public/media/`:

```
public/media/
├── my-video.mp4
├── my-poster.jpg
└── my-image.png
```

Reference them in MDX frontmatter:

```yaml
assets:
  poster: /media/my-poster.jpg
  src: /media/my-video.mp4
```

### External Assets

Use full URLs:

```yaml
assets:
  poster: https://example.com/poster.jpg
  src: https://example.com/video.mp4
```

### Video Sources

For multiple formats:

```yaml
assets:
  poster: /media/poster.jpg
  sources:
    - src: /media/video.mp4
      type: video/mp4
    - src: /media/video.webm
      type: video/webm
```

## Development

### Scripts

```bash
# Development
bun dev                  # Start dev server with Turbopack
bun run build            # Production build
bun start                # Start production server

# Code quality
bun run lint             # Check with Biome
bun run lint:fix         # Fix linting issues
bun run format           # Format code
bun run type-check       # TypeScript check

# Content management
bun run media:add        # Add new media (interactive)
bun run media:validate   # Validate all MDX files
bun run media:build-index # Build index cache
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://stupid.hair
```

For production, set this in Vercel.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SITE_URL=https://stupid.hair`
4. Deploy

Vercel auto-detects Next.js and Bun.

### Vercel Configuration

Optional `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun dev",
  "installCommand": "bun install",
  "framework": "nextjs"
}
```

### Custom Domain

1. Add domain in Vercel project settings
2. Update DNS records as instructed
3. Update `NEXT_PUBLIC_SITE_URL` environment variable

## API Routes

### GET /api/feed

Paginated feed with filters.

**Query Parameters:**
- `cursor` - Pagination cursor (optional)
- `limit` - Items per page (default: 20, max: 100)
- `type` - Filter by type: video, image, game, other
- `tag` - Filter by tag
- `search` - Search in title/description/tags

**Response:**
```json
{
  "items": [...],
  "nextCursor": "base64-cursor",
  "hasMore": true
}
```

### GET /api/tags

Get all unique tags.

**Response:**
```json
["sora", "experimental", "ai-video", ...]
```

### GET /rss.xml

RSS 2.0 feed with latest 50 items.

## Future Integration: Sora API

When an official Sora API becomes available:

1. Create `lib/sora-sync.ts`:
```typescript
export async function fetchSoraFeed(username: string) {
  // Implement API client
}
```

2. Add sync script `scripts/sora-sync.ts`:
```typescript
// Fetch from API and generate/update MDX files
```

3. Add environment variables:
```env
SORA_API_KEY=your-api-key
SORA_USERNAME=goatspeed
```

4. Run periodically:
```bash
bun run sora:sync
```

The MDX-first architecture makes this transition seamless - just add files!

## Performance

- **Server Components**: Default for static content
- **Client Components**: Only for interactive features (scroll, filters)
- **Image Optimization**: Automatic via next/image
- **Code Splitting**: Automatic via Next.js
- **Caching**: Feed API cached with stale-while-revalidate

## SEO

Every media page includes:
- Title, description meta tags
- Open Graph tags (title, description, image, type)
- Twitter Card tags (summary_large_image)
- Canonical URLs
- RSS feed autodiscovery

## Accessibility

- Semantic HTML throughout
- Keyboard navigation support
- Alt text for images (via MDX)
- Focus indicators
- ARIA labels where appropriate

## Browser Support

Modern browsers with ES2022 support:
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

## License

See LICENSE file.

## Credits

Built with Next.js, React, Tailwind CSS, and Bun.
Created by [@goatspeed](https://twitter.com/goatspeed).

---

**stupid.hair** - because sometimes the best ideas start with the dumbest domain names.
