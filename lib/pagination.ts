import { getAllMedia, getMediaByTag, getMediaByType, searchMedia } from "./content";
import type { FeedQuery, FeedResponse, MediaItem } from "./schema";

/**
 * Create a cursor from a media item (createdAt + slug for uniqueness)
 */
function createCursor(item: MediaItem): string {
  return Buffer.from(`${item.createdAt}:${item.slug}`).toString("base64");
}

/**
 * Parse a cursor back to date and slug
 */
function parseCursor(cursor: string): { date: string; slug: string } | null {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    const [date, slug] = decoded.split(":");
    return { date, slug };
  } catch {
    return null;
  }
}

/**
 * Apply filters to media items
 */
function applyFilters(query: FeedQuery): MediaItem[] {
  let items: MediaItem[];

  // Start with base set
  if (query.search) {
    items = searchMedia(query.search);
  } else if (query.type) {
    items = getMediaByType(query.type);
  } else if (query.tag) {
    items = getMediaByTag(query.tag);
  } else {
    items = getAllMedia();
  }

  return items;
}

/**
 * Get paginated feed with cursor-based pagination
 */
export function getPaginatedFeed(query: FeedQuery): FeedResponse {
  const limit = query.limit || 20;
  let items = applyFilters(query);

  // If cursor is provided, find the starting point
  if (query.cursor) {
    const parsed = parseCursor(query.cursor);
    if (parsed) {
      const { date, slug } = parsed;
      // Find the index of the cursor item
      const cursorIndex = items.findIndex((item) => item.createdAt === date && item.slug === slug);
      if (cursorIndex !== -1) {
        // Start from the next item after the cursor
        items = items.slice(cursorIndex + 1);
      }
    }
  }

  // Take limit + 1 to check if there are more items
  const pageItems = items.slice(0, limit + 1);
  const hasMore = pageItems.length > limit;
  const returnItems = hasMore ? pageItems.slice(0, limit) : pageItems;

  // Create next cursor from the last item
  const nextCursor =
    hasMore && returnItems.length > 0 ? createCursor(returnItems[returnItems.length - 1]) : null;

  return {
    items: returnItems,
    nextCursor,
    hasMore,
  };
}
