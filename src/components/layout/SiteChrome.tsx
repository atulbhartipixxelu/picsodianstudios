"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [ready, setReady] = useState(false);

  if (isAdmin) {
    return <div className="admin-shell min-h-screen bg-ink">{children}</div>;
  }

  function markReady() {
    setReady(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("ps:ready"));
      ScrollTrigger.refresh();
    });
  }

  return (
    <>
      <Preloader onComplete={markReady} />
      <div
        className={
          ready
            ? "relative opacity-100 transition-opacity duration-1000 ease-out"
            : "pointer-events-none relative opacity-0"
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
