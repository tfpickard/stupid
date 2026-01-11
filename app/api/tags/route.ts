import { NextResponse } from "next/server";
import { getAllTags } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * GET /api/tags
 * Get all unique tags
 */
export async function GET() {
  const tags = getAllTags();

  return NextResponse.json(tags, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
