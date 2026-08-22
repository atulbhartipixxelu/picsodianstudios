"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Skip stacked scroll panels (e.g. horizontal film strip). */
export function FoldSkip({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * The Line–style scroll stack (thelinestudio.com):
 * each full-screen panel is sticky; the next panel enters from bottom-right
 * while the previous one shrinks toward the top-left.
 */
export function FoldStack({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children).filter(isValidElement);
  const lastSlideAt = items.reduce(
    (acc, child, i) => (child.type === FoldSkip ? acc : i),
    -1,
  );

  useEffect(() => {
    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("ps:ready", refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("ps:ready", refresh);
      window.removeEventListener("load", refresh);
    };
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const pages = gsap.utils.toArray<HTMLElement>(
        root.current?.querySelectorAll("[data-slide-page]") ?? [],
      );

      pages.forEach((page, i) => {
        const park = page.querySelector<HTMLElement>("[data-slide-park]");
        const face = page.querySelector<HTMLElement>("[data-slide-face]");
        if (!park || !face) return;

        gsap.set(face, { transformOrigin: "100% 100%" });
        gsap.set(park, { transformOrigin: "0% 0%" });

        if (reduced) {
          gsap.set([face, park], { clearProps: "all" });
          return;
        }

        if (i > 0) {
          gsap.fromTo(
            face,
            {
              xPercent: 88,
              yPercent: 42,
              scale: 1.12,
              rotateZ: 7,
              filter: "brightness(0.55)",
            },
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              rotateZ: 0,
              filter: "brightness(1)",
              ease: "none",
              scrollTrigger: {
                trigger: page,
                start: "top bottom",
                end: "top 18%",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        const next = pages[i + 1];
        if (next) {
          gsap.fromTo(
            park,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              rotateZ: 0,
              opacity: 1,
              filter: "brightness(1)",
            },
            {
              xPercent: -30,
              yPercent: -22,
              scale: 0.68,
              rotateZ: -5,
              opacity: 0.35,
              filter: "brightness(0.45)",
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top 18%",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [items.length] },
  );

  return (
    <div ref={root} className="slide-scene">
      {items.map((child, i) => {
        const skip = child.type === FoldSkip;
        const inner = skip
          ? (child as ReactElement<{ children: ReactNode }>).props.children
          : child;

        if (skip) {
          return (
            <div
              key={child.key ?? `skip-${i}`}
              className="relative bg-ink"
              style={{ zIndex: i + 1 }}
            >
              {inner}
            </div>
          );
        }

        const isLast = i === lastSlideAt;
        return (
          <div
            key={child.key ?? `slide-${i}`}
            data-slide-page
            className={isLast ? "relative h-[130svh]" : "relative h-[150svh]"}
            style={{ zIndex: i + 1 }}
          >
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <div data-slide-park className="slide-park h-full w-full">
                <div data-slide-face className="slide-face h-full w-full bg-ink">
                  {inner}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
