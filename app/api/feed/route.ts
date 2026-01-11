import { getPaginatedFeed } from "@/lib/pagination";
import { FeedQuerySchema } from "@/lib/schema";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/feed
 * Paginated feed API with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const query = FeedQuerySchema.parse({
      cursor: searchParams.get("cursor") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      type: searchParams.get("type") || undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
    });

    // Get paginated results
    const response = getPaginatedFeed(query);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  }
}
