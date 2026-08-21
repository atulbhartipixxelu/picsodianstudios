import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans, Syne } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      className={`${syne.variable} ${instrument.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
