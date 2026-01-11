import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold hover:opacity-70 transition-opacity">
              stupid.hair
            </Link>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">@goatspeed</p>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/videos" className="hover:opacity-70 transition-opacity">
              Videos
            </Link>
            <Link href="/photos" className="hover:opacity-70 transition-opacity">
              Photos
            </Link>
            <Link href="/games" className="hover:opacity-70 transition-opacity">
              Games
            </Link>
            <Link
              href="/rss.xml"
              className="hover:opacity-70 transition-opacity"
              target="_blank"
            >
              RSS
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
