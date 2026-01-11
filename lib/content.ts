import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { MediaFrontmatter, MediaFrontmatterSchema, MediaItem } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content/media");

/**
 * In-memory cache for the media index
 */
let cachedIndex: MediaItem[] | null = null;

/**
 * Get all MDX files from content/media
 */
function getAllMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  return files.filter((file) => file.endsWith(".mdx"));
}

/**
 * Parse a single MDX file and return MediaItem
 */
function parseMdxFile(filename: string): MediaItem | null {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Validate frontmatter
    const frontmatter = MediaFrontmatterSchema.parse(data);

    // Generate slug from filename
    const slug = filename.replace(/\.mdx$/, "");

    // Create media item
    const mediaItem: MediaItem = {
      ...frontmatter,
      id: slug,
      slug,
      content: content.trim(),
    };

    return mediaItem;
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error);
    return null;
  }
}

/**
 * Build the full media index from all MDX files
 */
export function buildMediaIndex(): MediaItem[] {
  const files = getAllMdxFiles();
  const items = files
    .map((file) => parseMdxFile(file))
    .filter((item): item is MediaItem => item !== null);

  // Sort by createdAt (newest first)
  items.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return items;
}

/**
 * Get the media index (cached in memory)
 */
export function getMediaIndex(): MediaItem[] {
  if (cachedIndex === null) {
    cachedIndex = buildMediaIndex();
  }
  return cachedIndex;
}

/**
 * Invalidate the cache (useful for development)
 */
export function invalidateCache(): void {
  cachedIndex = null;
}

/**
 * Get all media items (public only by default)
 */
export function getAllMedia(includeUnlisted = false): MediaItem[] {
  const items = getMediaIndex();
  if (includeUnlisted) {
    return items;
  }
  return items.filter((item) => item.visibility === "public");
}

/**
 * Get a single media item by slug
 */
export function getMediaBySlug(slug: string): MediaItem | null {
  const items = getMediaIndex();
  return items.find((item) => item.slug === slug) || null;
}

/**
 * Get all slugs for static generation
 */
export function getAllSlugs(): string[] {
  const items = getMediaIndex();
  return items.map((item) => item.slug);
}

/**
 * Get media items filtered by type
 */
export function getMediaByType(type: string, includeUnlisted = false): MediaItem[] {
  const items = getAllMedia(includeUnlisted);
  return items.filter((item) => item.type === type);
}

/**
 * Get media items filtered by tag
 */
export function getMediaByTag(tag: string, includeUnlisted = false): MediaItem[] {
  const items = getAllMedia(includeUnlisted);
  return items.filter((item) => item.tags.includes(tag));
}

/**
 * Search media items by title or description
 */
export function searchMedia(query: string, includeUnlisted = false): MediaItem[] {
  const items = getAllMedia(includeUnlisted);
  const lowerQuery = query.toLowerCase();
  return items.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const descMatch = item.description?.toLowerCase().includes(lowerQuery) || false;
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return titleMatch || descMatch || tagMatch;
  });
}

/**
 * Get all unique tags from all media items
 */
export function getAllTags(): string[] {
  const items = getAllMedia();
  const tagSet = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
