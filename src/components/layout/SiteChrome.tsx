"use client";

import { useLayoutEffect, useState } from "react";
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

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("is-home", pathname === "/");
    html.classList.toggle("is-work", pathname === "/work");
    html.classList.toggle("is-contact", pathname === "/contact");
    return () => {
      html.classList.remove("is-home");
      html.classList.remove("is-work");
      html.classList.remove("is-contact");
    };
  }, [pathname]);

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
      {ready ? <div className="grain" aria-hidden /> : null}
      {ready ? <CustomCursor /> : null}
      <div
        className={
          ready
            ? "relative opacity-100 transition-opacity duration-700 ease-out"
            : "pointer-events-none relative opacity-0"
        }
      >
        <SmoothScroll>
          {ready ? <Nav /> : null}
          <main className="site-main relative z-10 min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
