"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [ready, setReady] = useState(false);

  if (isAdmin) {
    return <div className="admin-shell min-h-screen bg-ink">{children}</div>;
  }

  return (
    <>
      <Preloader onComplete={() => setReady(true)} />
      <div
        className={
          ready
            ? "opacity-100 transition-opacity duration-700"
            : "pointer-events-none h-screen overflow-hidden opacity-0"
        }
      >
        <div className="grain" aria-hidden />
        <CustomCursor />
        <Nav />
        <SmoothScroll>
          <main className="relative z-10 min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
