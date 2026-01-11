"use client";

import { FeedFilters } from "@/components/feed-filters";
import { Header } from "@/components/header";
import { InfiniteFeed } from "@/components/infinite-feed";
import type { FeedResponse } from "@/lib/schema";
import { useEffect, useState } from "react";

export default function VideosPage() {
  const [feedData, setFeedData] = useState<FeedResponse | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    search?: string;
    tag?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: "20", type: "video" });
        if (filters.search) params.set("search", filters.search);
        if (filters.tag) params.set("tag", filters.tag);

        const [feedRes, tagsRes] = await Promise.all([
          fetch(`/api/feed?${params.toString()}`),
          fetch("/api/tags"),
        ]);

        const feedData: FeedResponse = await feedRes.json();
        const tagsData: string[] = tagsRes.ok ? await tagsRes.json() : [];

        setFeedData(feedData);
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [filters]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="border-b border-black/10 dark:border-white/10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Videos</h1>
        </div>
      </div>
      <FeedFilters onFilterChange={setFilters} availableTags={tags} />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-black/40 dark:text-white/40">
            Loading videos...
          </div>
        ) : feedData ? (
          <InfiniteFeed
            initialItems={feedData.items}
            initialCursor={feedData.nextCursor}
            initialHasMore={feedData.hasMore}
            filters={{ ...filters, type: "video" }}
          />
        ) : (
          <div className="text-center py-12 text-black/40 dark:text-white/40">
            Failed to load videos.
          </div>
        )}
      </main>
    </div>
  );
}
