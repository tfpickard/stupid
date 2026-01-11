import { NextResponse } from "next/server";
import { generateRssFeed } from "@/lib/rss";

export const dynamic = "force-dynamic";

/**
 * GET /rss.xml
 * Generate RSS feed
 */
export async function GET() {
  const feed = generateRssFeed();

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
