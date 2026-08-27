"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, type PublicWork } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FilmStrip({ works }: { works: PublicWork[] }) {
  const items = works.slice(0, 6);
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const ids = items.map((work) => work.id).join("|");
  const current = items[active] ?? items[0];

  useGSAP(
    () => {
      const wrap = root.current;
      if (!wrap || items.length < 2) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        wrap.classList.add("is-static");
        return () => wrap.classList.remove("is-static");
      }

      const unit = window.innerHeight * (window.innerWidth < 768 ? 0.7 : 0.85);
      wrap.style.height = `${Math.max(2, items.length) * unit}px`;

      const trigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(
            items.length - 1,
            Math.round(self.progress * (items.length - 1)),
          );
          if (next === activeRef.current) return;
          activeRef.current = next;
          setActive(next);
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("ps:ready", refresh);
      requestAnimationFrame(refresh);

      return () => {
        trigger.kill();
        window.removeEventListener("ps:ready", refresh);
        wrap.style.height = "";
        wrap.classList.remove("is-static");
      };
    },
    { scope: root, dependencies: [ids] },
  );

  if (!items.length || !current) return null;

  return (
    <div ref={root} className="strip-root relative bg-ink">
      <section className="strip-pin sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-ink">
        <div className="flex items-center justify-between px-4 pt-20 md:px-8 md:pt-24">
          <p className="micro text-signal">Latest works / 02</p>
          <Link href="/work" className="micro text-paper/70 hover:text-paper" data-cursor="Index">
            All work →
          </Link>
        </div>

        <div className="strip-layout">
          <h2 className="strip-title">
            <span>On the</span>
            <span>strip</span>
          </h2>

          <ol className="strip-index">
            {items.map((work, i) => {
              const on = i === active;
              return (
                <li key={work.id}>
                  <Link
                    href={`/work/${work.slug}`}
                    data-cursor="View"
                    className={cn("strip-row", on && "is-on")}
                    onMouseEnter={() => {
                      activeRef.current = i;
                      setActive(i);
                    }}
                    onFocus={() => {
                      activeRef.current = i;
                      setActive(i);
                    }}
                  >
                    <span className="strip-row-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="strip-row-name">{work.title}</span>
                    <span className="strip-row-year">{work.year}</span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <Link
            href={`/work/${current.slug}`}
            data-cursor="View"
            className="strip-frame"
          >
            <span className="strip-corner strip-corner-tl" />
            <span className="strip-corner strip-corner-tr" />
            <span className="strip-corner strip-corner-bl" />
            <span className="strip-corner strip-corner-br" />

            <div className="strip-plates">
              {items.map((work, i) => (
                <div
                  key={work.id}
                  className={cn("strip-plate", i === active && "is-on")}
                >
                  <SafeImage
                    src={work.thumbnail || work.heroImage}
                    alt={work.title}
                    className="strip-photo"
                  />
                </div>
              ))}
            </div>

            <div className="strip-frame-meta">
              <p className="micro text-paper/80">
                {String(active + 1).padStart(2, "0")} / {current.category}
              </p>
              <p className="micro text-paper/80">View cut →</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
