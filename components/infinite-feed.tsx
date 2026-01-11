"use client";

import type { FeedResponse, MediaItem, MediaType } from "@/lib/schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaCard } from "./media-card";

interface InfiniteFeedProps {
  initialItems: MediaItem[];
  initialCursor: string | null;
  initialHasMore: boolean;
  filters?: {
    search?: string;
    type?: MediaType;
    tag?: string;
  };
}

export function InfiniteFeed({
  initialItems,
  initialCursor,
  initialHasMore,
  filters,
}: InfiniteFeedProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset when filters change
  useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
    setError(null);
  }, [initialItems, initialCursor, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        cursor,
        limit: "20",
      });

      if (filters?.search) params.set("search", filters.search);
      if (filters?.type) params.set("type", filters.type);
      if (filters?.tag) params.set("tag", filters.tag);

      const response = await fetch(`/api/feed?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch more items");

      const data: FeedResponse = await response.json();

      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, filters]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-black/40 dark:text-white/40">No items found.</div>
      )}

      {loading && (
        <div className="text-center py-8 text-black/40 dark:text-white/40">Loading...</div>
      )}

      {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}

      {!loading && hasMore && <div ref={observerTarget} className="h-20" />}

      {!loading && !hasMore && items.length > 0 && (
        <div className="text-center py-8 text-black/40 dark:text-white/40">End of feed.</div>
      )}
    </div>
  );
}
