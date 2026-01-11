import { generateRssFeed } from "@/lib/rss";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /feed.xml (alias for /rss.xml)
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
