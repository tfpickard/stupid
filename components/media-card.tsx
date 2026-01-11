import type { MediaItem } from "@/lib/schema";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface MediaCardProps {
  item: MediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  const { slug, title, type, createdAt, assets, tags } = item;

  return (
    <Link
      href={`/m/${slug}`}
      className="group block border border-black/10 dark:border-white/10 hover:border-accent transition-colors"
    >
      <div className="aspect-video bg-black/5 dark:bg-white/5 overflow-hidden relative">
        {assets.poster ? (
          <Image
            src={assets.poster}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/20 dark:text-white/20">
            <span className="text-4xl">{type === "video" ? "▶" : "○"}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-black/60 dark:text-white/60 mb-2">
          {format(new Date(createdAt), "MMM d, yyyy")}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-black/5 dark:bg-white/5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
