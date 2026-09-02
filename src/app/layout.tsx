import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Picsodian Studios — Creative Visual Studio",
    template: "%s / Picsodian Studios",
  },
  description:
    "Picsodian Studios is a passion-driven creative studio. Motion, film, and visuals that are undeniably cool.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  referrer: "no-referrer",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "37x35" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-paper">
        <link
          rel="preload"
          href="/fonts/BrunsonRough.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Brunson.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/LemonMilk-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
