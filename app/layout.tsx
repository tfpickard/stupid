import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "stupid.hair - Sora Creations by @goatspeed",
    template: "%s | stupid.hair",
  },
  description: "A collection of Sora creations and experimental media by @goatspeed",
  keywords: ["sora", "ai video", "generative art", "creative coding", "goatspeed"],
  authors: [{ name: "goatspeed" }],
  creator: "goatspeed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stupid.hair",
    title: "stupid.hair",
    description: "Sora creations by @goatspeed",
    siteName: "stupid.hair",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@goatspeed",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://stupid.hair"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
