import { Header } from "@/components/header";
import { getMediaBySlug } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getMediaBySlug(slug);

  if (!item || item.type !== "game") {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/games" className="text-sm text-accent hover:underline">
            ← Back to games
          </Link>
        </div>

        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
          <p className="text-black/60 dark:text-white/60 mb-8">
            Game detail page stub. Full game experience coming soon.
          </p>
          <Link
            href={`/m/${slug}`}
            className="inline-block px-6 py-3 bg-accent text-white rounded hover:bg-accent-dark transition-colors"
          >
            View in media gallery →
          </Link>
        </div>
      </main>
    </div>
  );
}
