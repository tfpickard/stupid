"use client";

import { useState, useCallback } from "react";
import { MediaType } from "@/lib/schema";

interface FeedFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    type?: MediaType;
    tag?: string;
  }) => void;
  availableTags: string[];
}

export function FeedFilters({ onFilterChange, availableTags }: FeedFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MediaType | "">("");
  const [tag, setTag] = useState("");

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      onFilterChange({
        search: value || undefined,
        type: type || undefined,
        tag: tag || undefined,
      });
    },
    [type, tag, onFilterChange]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value as MediaType | "");
      onFilterChange({
        search: search || undefined,
        type: value ? (value as MediaType) : undefined,
        tag: tag || undefined,
      });
    },
    [search, tag, onFilterChange]
  );

  const handleTagChange = useCallback(
    (value: string) => {
      setTag(value);
      onFilterChange({
        search: search || undefined,
        type: type || undefined,
        tag: value || undefined,
      });
    },
    [search, type, onFilterChange]
  );

  return (
    <div className="border-b border-black/10 dark:border-white/10 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-black focus:border-accent outline-none transition-colors"
            />
          </div>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-4 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-black focus:border-accent outline-none transition-colors"
          >
            <option value="">All types</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="game">Game</option>
            <option value="other">Other</option>
          </select>
          {availableTags.length > 0 && (
            <select
              value={tag}
              onChange={(e) => handleTagChange(e.target.value)}
              className="px-4 py-2 border border-black/10 dark:border-white/10 bg-white dark:bg-black focus:border-accent outline-none transition-colors"
            >
              <option value="">All tags</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
