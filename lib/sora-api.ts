/**
 * Sora API Integration
 *
 * Fetches videos from OpenAI's Sora platform for a specific user.
 * This implementation supports both the official API (when available)
 * and fallback methods like RSS feeds or web scraping.
 */

import type { SoraMetadata } from "./schema";

/**
 * Sora video data from API
 */
export interface SoraVideo {
  id: string;
  title: string;
  prompt: string;
  username: string;
  createdAt: string; // ISO date string
  videoUrl: string;
  posterUrl?: string;
  model?: string;
  duration?: number;
  width?: number;
  height?: number;
  tags?: string[];
}

/**
 * Sora API client configuration
 */
interface SoraClientConfig {
  apiKey?: string;
  baseUrl?: string;
  rssUrl?: string;
}

/**
 * Sora API Client
 */
export class SoraClient {
  private apiKey?: string;
  private baseUrl: string;
  private rssUrl?: string;

  constructor(config: SoraClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.SORA_API_KEY;
    this.baseUrl = config.baseUrl || process.env.SORA_API_BASE_URL || "https://api.openai.com/v1/sora";
    this.rssUrl = config.rssUrl || process.env.SORA_RSS_URL;
  }

  /**
   * Fetch videos for a specific user
   */
  async fetchUserVideos(username: string, limit = 20): Promise<SoraVideo[]> {
    // Try official API first
    if (this.apiKey) {
      try {
        return await this.fetchFromAPI(username, limit);
      } catch (error) {
        console.error("Official API failed, trying fallback methods:", error);
      }
    }

    // Fallback to RSS feed
    if (this.rssUrl) {
      try {
        return await this.fetchFromRSS(username, limit);
      } catch (error) {
        console.error("RSS feed failed:", error);
      }
    }

    // If all methods fail, return empty array
    console.warn(`No Sora videos found for user: ${username}`);
    return [];
  }

  /**
   * Fetch from official Sora API
   */
  private async fetchFromAPI(username: string, limit: number): Promise<SoraVideo[]> {
    if (!this.apiKey) {
      throw new Error("Sora API key not configured");
    }

    const response = await fetch(`${this.baseUrl}/users/${username}/videos?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Sora API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.normalizeAPIResponse(data);
  }

  /**
   * Fetch from RSS feed (alternative method)
   */
  private async fetchFromRSS(username: string, limit: number): Promise<SoraVideo[]> {
    if (!this.rssUrl) {
      throw new Error("RSS URL not configured");
    }

    const rssUrl = this.rssUrl.replace("{username}", username);
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();
    return this.parseRSSFeed(xml, limit);
  }

  /**
   * Normalize API response to SoraVideo format
   */
  private normalizeAPIResponse(data: any): SoraVideo[] {
    // Adjust this based on actual Sora API response format
    if (!data.videos || !Array.isArray(data.videos)) {
      return [];
    }

    return data.videos.map((video: any) => ({
      id: video.id || video.video_id,
      title: video.title || `Sora Creation ${video.id}`,
      prompt: video.prompt || "",
      username: video.username || video.author?.username,
      createdAt: video.created_at || video.createdAt || new Date().toISOString(),
      videoUrl: video.video_url || video.url,
      posterUrl: video.poster_url || video.thumbnail_url,
      model: video.model || "sora-1.0",
      duration: video.duration,
      width: video.width || 1920,
      height: video.height || 1080,
      tags: video.tags || [],
    }));
  }

  /**
   * Parse RSS feed XML
   */
  private parseRSSFeed(xml: string, limit: number): SoraVideo[] {
    // Basic RSS parsing
    // In production, use a proper XML parser like 'fast-xml-parser'
    const videos: SoraVideo[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null && count < limit) {
      const item = match[1];
      const video = this.parseRSSItem(item);
      if (video) {
        videos.push(video);
        count++;
      }
    }

    return videos;
  }

  /**
   * Parse individual RSS item
   */
  private parseRSSItem(item: string): SoraVideo | null {
    try {
      const getTag = (tag: string): string => {
        const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "s");
        const match = item.match(regex);
        return match ? match[1].trim() : "";
      };

      const getCDATA = (tag: string): string => {
        const regex = new RegExp(`<${tag}><!\[CDATA\[(.*?)\]\]><\/${tag}>`, "s");
        const match = item.match(regex);
        return match ? match[1].trim() : getTag(tag);
      };

      const id = getTag("guid") || getTag("link");
      if (!id) return null;

      return {
        id,
        title: getCDATA("title") || `Sora Creation`,
        prompt: getCDATA("description") || getCDATA("content:encoded") || "",
        username: getTag("dc:creator") || "unknown",
        createdAt: getTag("pubDate") || new Date().toISOString(),
        videoUrl: getTag("enclosure").match(/url="([^"]+)"/)?.[1] || "",
        posterUrl: getTag("media:thumbnail").match(/url="([^"]+)"/)?.[1],
        model: "sora-1.0",
        tags: [],
      };
    } catch (error) {
      console.error("Error parsing RSS item:", error);
      return null;
    }
  }

  /**
   * Fetch a single video by ID
   */
  async fetchVideoById(videoId: string): Promise<SoraVideo | null> {
    if (!this.apiKey) {
      console.warn("Sora API key not configured");
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status}`);
      }

      const data = await response.json();
      return this.normalizeAPIResponse({ videos: [data] })[0] || null;
    } catch (error) {
      console.error("Error fetching video by ID:", error);
      return null;
    }
  }
}

/**
 * Default Sora client instance
 */
export const soraClient = new SoraClient();

/**
 * Convenience function to fetch user videos
 */
export async function fetchSoraUserVideos(
  username: string,
  limit = 20
): Promise<SoraVideo[]> {
  return soraClient.fetchUserVideos(username, limit);
}
