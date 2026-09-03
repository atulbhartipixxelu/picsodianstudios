"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollBridge() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;

    const sync = () => {
      const html = document.documentElement;
      if (
        html.classList.contains("is-nav-open") ||
        html.classList.contains("is-filters-lock")
      ) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    sync();

    return () => obs.disconnect();
  }, [lenis]);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("ps:ready", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("ps:ready", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.05,
        smoothWheel: true,
        anchors: false,
        syncTouch: true,
      }}
    >
      <LenisScrollBridge />
      {children}
    </ReactLenis>
  );
}
