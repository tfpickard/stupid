import type { MediaItem } from "@/lib/schema";
import Image from "next/image";

interface MediaViewerProps {
  item: MediaItem;
}

export function MediaViewer({ item }: MediaViewerProps) {
  const { type, assets } = item;

  if (type === "video") {
    return (
      <div className="aspect-video bg-black">
        <video controls poster={assets.poster} className="w-full h-full" preload="metadata">
          {assets.sources?.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          {assets.src && <source src={assets.src} type="video/mp4" />}
          <track kind="captions" />
        </video>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="relative aspect-video bg-black/5 dark:bg-white/5">
        {assets.src ? (
          <Image
            src={assets.src}
            alt={item.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/20 dark:text-white/20">
            No image
          </div>
        )}
      </div>
    );
  }

  if (type === "game") {
    if (assets.embedUrl) {
      return (
        <div className="aspect-video">
          <iframe
            src={assets.embedUrl}
            className="w-full h-full border-0"
            allow="fullscreen"
            title={item.title}
          />
        </div>
      );
    }
    return (
      <div className="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black/40 dark:text-white/40 mb-4">Game embed not available</p>
          {assets.src && (
            <a
              href={assets.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Open game →
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
      <p className="text-black/40 dark:text-white/40">Media type: {type}</p>
    </div>
  );
}
