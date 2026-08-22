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
  icons: { icon: [{ url: "/logo.png" }, { url: "/favicon.svg" }] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-paper">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
