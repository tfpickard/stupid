#!/usr/bin/env bun

/**
 * Sync Sora Videos Script
 *
 * Automatically fetches new videos from Sora for user "goatspeed"
 * and creates MDX files for them in content/media.
 *
 * Usage:
 *   bun run scripts/sync-sora-videos.ts [--username=goatspeed] [--limit=20] [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";
import { fetchSoraUserVideos, type SoraVideo } from "../lib/sora-api";
import { getAllMedia } from "../lib/content";

const CONTENT_DIR = path.join(process.cwd(), "content/media");
const PUBLIC_MEDIA_DIR = path.join(process.cwd(), "public/media");

// Parse CLI arguments
const args = process.argv.slice(2);
const getArg = (name: string, defaultValue: string): string => {
  const arg = args.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=")[1] : defaultValue;
};
const hasFlag = (name: string): boolean => args.includes(`--${name}`);

const USERNAME = getArg("username", process.env.SORA_USERNAME || "goatspeed");
const LIMIT = Number.parseInt(getArg("limit", "20"));
const DRY_RUN = hasFlag("dry-run");
const FORCE = hasFlag("force");

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_MEDIA_DIR)) {
    fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
  }
}

/**
 * Generate slug from video title and ID
 */
function generateSlug(video: SoraVideo): string {
  const titleSlug = video.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const date = new Date(video.createdAt);
  const dateStr = date.toISOString().split("T")[0];

  return `${dateStr}-${titleSlug}-${video.id.substring(0, 8)}`;
}

/**
 * Check if video already exists in content
 */
function videoExists(soraId: string): boolean {
  const existing = getAllMedia(true);
  return existing.some(
    (item) => item.source === "sora" && item.sora?.soraId === soraId
  );
}

/**
 * Download video file
 */
async function downloadVideo(
  url: string,
  filename: string
): Promise<string | null> {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would download: ${url}`);
    return `/media/${filename}`;
  }

  try {
    console.log(`  Downloading video: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const filepath = path.join(PUBLIC_MEDIA_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));

    console.log(`  ✓ Saved to: ${filepath}`);
    return `/media/${filename}`;
  } catch (error) {
    console.error(`  ✗ Failed to download video:`, error);
    return null;
  }
}

/**
 * Download poster/thumbnail
 */
async function downloadPoster(
  url: string | undefined,
  filename: string
): Promise<string | null> {
  if (!url) return null;

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would download poster: ${url}`);
    return `/media/${filename}`;
  }

  try {
    console.log(`  Downloading poster: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const filepath = path.join(PUBLIC_MEDIA_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));

    console.log(`  ✓ Saved poster to: ${filepath}`);
    return `/media/${filename}`;
  } catch (error) {
    console.error(`  ✗ Failed to download poster:`, error);
    return null;
  }
}

/**
 * Generate MDX content for video
 */
function generateMDX(video: SoraVideo, localVideoPath: string, posterPath: string | null): string {
  const tags = ["sora", "ai-video", ...(video.tags || [])];
  const createdAt = new Date(video.createdAt).toISOString();

  return `---
title: "${video.title.replace(/"/g, '\\"')}"
createdAt: "${createdAt}"
type: video
source: sora
visibility: public
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
description: "${(video.prompt || "").substring(0, 200).replace(/"/g, '\\"')}"
assets:
  ${posterPath ? `poster: ${posterPath}` : "# No poster available"}
  src: ${localVideoPath}
  ${video.width ? `width: ${video.width}` : ""}
  ${video.height ? `height: ${video.height}` : ""}
  ${video.duration ? `durationSec: ${video.duration}` : ""}
sora:
  username: ${video.username}
  soraId: "${video.id}"
  ${video.prompt ? `prompt: "${video.prompt.replace(/"/g, '\\"')}"` : ""}
  ${video.model ? `model: ${video.model}` : ""}
---

${video.prompt ? `## Prompt\n\n${video.prompt}\n\n` : ""}

Auto-synced from Sora on ${new Date().toISOString().split("T")[0]}.
`;
}

/**
 * Create MDX file for video
 */
async function createVideoMDX(video: SoraVideo): Promise<boolean> {
  const slug = generateSlug(video);
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (fs.existsSync(mdxPath) && !FORCE) {
    console.log(`  ⊘ MDX file already exists: ${slug}.mdx (use --force to overwrite)`);
    return false;
  }

  // Download video file
  const videoFilename = `${slug}.mp4`;
  const localVideoPath = await downloadVideo(video.videoUrl, videoFilename);
  if (!localVideoPath) {
    console.error(`  ✗ Failed to download video, skipping`);
    return false;
  }

  // Download poster if available
  const posterFilename = `${slug}-poster.jpg`;
  const posterPath = video.posterUrl
    ? await downloadPoster(video.posterUrl, posterFilename)
    : null;

  // Generate MDX content
  const mdxContent = generateMDX(video, localVideoPath, posterPath);

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create: ${mdxPath}`);
    console.log(`  Content preview:\n${mdxContent.substring(0, 300)}...`);
    return true;
  }

  // Write MDX file
  fs.writeFileSync(mdxPath, mdxContent, "utf-8");
  console.log(`  ✓ Created: ${slug}.mdx`);

  return true;
}

/**
 * Main sync function
 */
async function syncSoraVideos() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                                                            ║");
  console.log("║              Sora Video Sync Script                        ║");
  console.log("║                                                            ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`Username: ${USERNAME}`);
  console.log(`Limit: ${LIMIT}`);
  console.log(`Dry Run: ${DRY_RUN}`);
  console.log(`Force: ${FORCE}`);
  console.log("");

  // Ensure directories exist
  ensureDirectories();

  // Fetch videos from Sora
  console.log(`📥 Fetching videos from Sora for user: ${USERNAME}...`);
  console.log("");

  let videos: SoraVideo[];
  try {
    videos = await fetchSoraUserVideos(USERNAME, LIMIT);
  } catch (error) {
    console.error("✗ Failed to fetch videos from Sora:");
    console.error(error);
    process.exit(1);
  }

  if (videos.length === 0) {
    console.log("⚠ No videos found");
    console.log("");
    console.log("Possible reasons:");
    console.log("  • Sora API is not configured (check SORA_API_KEY)");
    console.log("  • User has no public videos");
    console.log("  • API endpoint is incorrect");
    console.log("");
    console.log("To configure Sora API:");
    console.log("  1. Get API key from OpenAI dashboard");
    console.log("  2. Add to .env.local: SORA_API_KEY=your-key");
    console.log("  3. Set username: SORA_USERNAME=goatspeed");
    process.exit(0);
  }

  console.log(`✓ Found ${videos.length} video(s)`);
  console.log("");

  // Process each video
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, video] of videos.entries()) {
    console.log(`[${index + 1}/${videos.length}] ${video.title}`);
    console.log(`  ID: ${video.id}`);
    console.log(`  Date: ${new Date(video.createdAt).toLocaleDateString()}`);

    // Check if already exists
    if (videoExists(video.id) && !FORCE) {
      console.log(`  ⊘ Already synced (use --force to re-sync)`);
      skipped++;
      console.log("");
      continue;
    }

    // Create MDX file
    const success = await createVideoMDX(video);
    if (success) {
      created++;
    } else {
      failed++;
    }

    console.log("");
  }

  // Summary
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`${DRY_RUN ? "DRY RUN " : ""}Summary:`);
  console.log(`  Total videos: ${videos.length}`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log("");

  if (DRY_RUN) {
    console.log("ℹ This was a dry run. No files were created.");
    console.log("  Run without --dry-run to actually sync videos.");
  } else {
    console.log("✓ Sync complete!");
    console.log("");
    console.log("Next steps:");
    console.log("  • Rebuild your app: bun run build");
    console.log("  • The videos will appear in your feed automatically");
  }

  console.log("");
}

// Run the script
syncSoraVideos().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
