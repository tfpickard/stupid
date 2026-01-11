import { getAllMedia } from "./content";
import { MediaItem } from "./schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stupid.hair";
const SITE_TITLE = "stupid.hair";
const SITE_DESCRIPTION = "Sora creations by @goatspeed";

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate RSS feed XML
 */
export function generateRssFeed(): string {
  const items = getAllMedia().slice(0, 50); // Latest 50 items
  const buildDate = new Date().toUTCString();

  const itemsXml = items
    .map((item) => {
      const link = `${SITE_URL}/m/${item.slug}`;
      const pubDate = new Date(item.createdAt).toUTCString();
      const description = item.description || item.title;

      // Add media enclosure for videos
      let enclosure = "";
      if (item.type === "video" && item.assets.src) {
        // Try to determine file size (not critical for RSS)
        enclosure = `<enclosure url="${escapeXml(item.assets.src)}" type="video/mp4" length="0"/>`;
      }

      // Add poster/thumbnail as media:content
      let mediaContent = "";
      if (item.assets.poster) {
        const posterUrl = item.assets.poster.startsWith("http")
          ? item.assets.poster
          : `${SITE_URL}${item.assets.poster}`;
        mediaContent = `<media:content url="${escapeXml(posterUrl)}" medium="image"/>`;
      }

      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      ${item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
      ${enclosure}
      ${mediaContent}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;
}
