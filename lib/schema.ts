import { z } from "zod";

/**
 * Media type discriminator
 */
export const MediaTypeSchema = z.enum(["video", "image", "game", "other"]);
export type MediaType = z.infer<typeof MediaTypeSchema>;

/**
 * Media source discriminator
 */
export const MediaSourceSchema = z.enum(["sora", "upload", "external"]);
export type MediaSource = z.infer<typeof MediaSourceSchema>;

/**
 * Visibility setting
 */
export const VisibilitySchema = z.enum(["public", "unlisted"]);
export type Visibility = z.infer<typeof VisibilitySchema>;

/**
 * Video source with type (e.g., mp4, webm)
 */
export const VideoSourceSchema = z.object({
  src: z.string(),
  type: z.string(),
});
export type VideoSource = z.infer<typeof VideoSourceSchema>;

/**
 * Sora-specific metadata
 */
export const SoraMetadataSchema = z.object({
  username: z.string(),
  soraId: z.string().optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
});
export type SoraMetadata = z.infer<typeof SoraMetadataSchema>;

/**
 * Media assets (poster, sources, dimensions, duration)
 */
export const MediaAssetsSchema = z.object({
  poster: z.string().optional(),
  src: z.string().optional(),
  sources: z.array(VideoSourceSchema).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSec: z.number().optional(),
  embedUrl: z.string().optional(), // For iframes (games, etc.)
});
export type MediaAssets = z.infer<typeof MediaAssetsSchema>;

/**
 * Frontmatter schema for MDX files
 */
export const MediaFrontmatterSchema = z.object({
  title: z.string(),
  createdAt: z.string(), // ISO date string
  type: MediaTypeSchema,
  source: MediaSourceSchema.default("sora"),
  sora: SoraMetadataSchema.optional(),
  assets: MediaAssetsSchema,
  tags: z.array(z.string()).default([]),
  description: z.string().optional(),
  visibility: VisibilitySchema.default("public"),
});
export type MediaFrontmatter = z.infer<typeof MediaFrontmatterSchema>;

/**
 * Full media item with computed fields
 */
export const MediaItemSchema = MediaFrontmatterSchema.extend({
  id: z.string(),
  slug: z.string(),
  content: z.string(), // MDX content body
});
export type MediaItem = z.infer<typeof MediaItemSchema>;

/**
 * Paginated feed response
 */
export const FeedResponseSchema = z.object({
  items: z.array(MediaItemSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
});
export type FeedResponse = z.infer<typeof FeedResponseSchema>;

/**
 * Feed query parameters
 */
export const FeedQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  type: MediaTypeSchema.optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});
export type FeedQuery = z.infer<typeof FeedQuerySchema>;
