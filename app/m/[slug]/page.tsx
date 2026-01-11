import { Header } from "@/components/header";
import { mdxComponents } from "@/components/mdx-components";
import { MediaViewer } from "@/components/media-viewer";
import { getAllMedia, getAllSlugs, getMediaBySlug } from "@/lib/content";
import { format } from "date-fns";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getMediaBySlug(slug);

  if (!item) {
    return {
      title: "Not Found",
    };
  }

  const description = item.description || `${item.type} by @goatspeed`;
  const imageUrl = item.assets.poster
    ? item.assets.poster.startsWith("http")
      ? item.assets.poster
      : `${process.env.NEXT_PUBLIC_SITE_URL || "https://stupid.hair"}${item.assets.poster}`
    : undefined;

  return {
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      type: "article",
      publishedTime: item.createdAt,
      tags: item.tags,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getMediaBySlug(slug);

  if (!item) {
    notFound();
  }

  // Get next/prev items
  const allItems = getAllMedia();
  const currentIndex = allItems.findIndex((i) => i.slug === slug);
  const prevItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
  const nextItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-sm text-accent hover:underline">
            ← Back to feed
          </Link>
        </div>

        <article>
          <MediaViewer item={item} />

          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-4">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="text-sm px-3 py-1 bg-black/5 dark:bg-white/5 rounded">
                {item.type}
              </div>
            </div>

            <div className="text-sm text-black/60 dark:text-white/60 mb-6">
              {format(new Date(item.createdAt), "MMMM d, yyyy")}
            </div>

            {item.description && (
              <p className="text-lg mb-6 text-black/80 dark:text-white/80">{item.description}</p>
            )}

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    className="text-sm px-3 py-1 bg-black/5 dark:bg-white/5 rounded hover:bg-accent hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {item.sora && (
              <div className="mb-8 p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded">
                <div className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40 mb-2">
                  Sora Metadata
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-black/60 dark:text-white/60">Username:</span>{" "}
                    {item.sora.username}
                  </div>
                  {item.sora.soraId && (
                    <div>
                      <span className="text-black/60 dark:text-white/60">ID:</span>{" "}
                      {item.sora.soraId}
                    </div>
                  )}
                  {item.sora.model && (
                    <div>
                      <span className="text-black/60 dark:text-white/60">Model:</span>{" "}
                      {item.sora.model}
                    </div>
                  )}
                </div>
              </div>
            )}

            {item.content && (
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <MDXRemote source={item.content} components={mdxComponents} />
              </div>
            )}
          </div>
        </article>

        <nav className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {prevItem && (
                <Link
                  href={`/m/${prevItem.slug}`}
                  className="group block hover:text-accent transition-colors"
                >
                  <div className="text-xs text-black/40 dark:text-white/40 mb-1">← Previous</div>
                  <div className="text-sm font-medium group-hover:underline">{prevItem.title}</div>
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextItem && (
                <Link
                  href={`/m/${nextItem.slug}`}
                  className="group block hover:text-accent transition-colors"
                >
                  <div className="text-xs text-black/40 dark:text-white/40 mb-1">Next →</div>
                  <div className="text-sm font-medium group-hover:underline">{nextItem.title}</div>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </main>
    </div>
  );
}
