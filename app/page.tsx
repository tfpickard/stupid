"use client";

import { FeedFilters } from "@/components/feed-filters";
import { Header } from "@/components/header";
import { InfiniteFeed } from "@/components/infinite-feed";
import type { FeedResponse, MediaType } from "@/lib/schema";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [feedData, setFeedData] = useState<FeedResponse | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    search?: string;
    type?: MediaType;
    tag?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: "20" });
        if (filters.search) params.set("search", filters.search);
        if (filters.type) params.set("type", filters.type);
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
      <FeedFilters onFilterChange={setFilters} availableTags={tags} />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-black/40 dark:text-white/40">Loading feed...</div>
        ) : feedData ? (
          <InfiniteFeed
            initialItems={feedData.items}
            initialCursor={feedData.nextCursor}
            initialHasMore={feedData.hasMore}
            filters={filters}
          />
        ) : (
          <div className="text-center py-12 text-black/40 dark:text-white/40">
            Failed to load feed.
          </div>
        )}
      </main>
    </div>
  );
}
