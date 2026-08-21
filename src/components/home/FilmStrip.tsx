"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicWork } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function FilmStrip({ works }: { works: PublicWork[] }) {
  const spacer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = spacer.current;
    const row = track.current;
    if (!wrap || !row) return;
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const distance = Math.max(row.scrollWidth - window.innerWidth, 0);
      wrap.style.height = `${distance + window.innerHeight}px`;

      gsap.to(row, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => {
      ctx.revert();
      wrap.style.height = "";
    };
  }, [works]);

  if (!works.length) return null;

  return (
    <div ref={spacer} className="relative bg-ink">
      <section className="sticky top-0 overflow-hidden bg-ink">
        <div className="flex items-end justify-between px-4 pt-10 pb-6 md:px-7">
          <div>
            <p className="micro text-signal">Latest works / 02</p>
            <h2 className="display-huge mt-2 text-5xl md:text-7xl">On the strip</h2>
          </div>
          <Link href="/work" className="micro text-paper" data-cursor="Index">
            All work →
          </Link>
        </div>

        <div ref={track} className="flex w-max gap-4 px-4 pb-16 md:gap-6 md:px-7">
          {works.map((work, i) => (
            <Link
              key={work.id}
              href={`/work/${work.slug}`}
              data-cursor="View"
              className="group relative w-[78vw] shrink-0 md:w-[38vw]"
            >
              <div className="relative overflow-hidden border border-paper/10">
                <div className="absolute top-0 right-0 left-0 z-10 flex justify-between px-3 py-2">
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                </div>
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute right-0 bottom-0 left-0 z-10 flex justify-between px-3 py-2">
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                  <span className="h-2 w-3 rounded-sm bg-ink/80" />
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="micro text-mist">
                    {String(i + 1).padStart(2, "0")} / {work.category}
                  </p>
                  <h3 className="font-display mt-1 text-2xl tracking-tight uppercase">
                    {work.title}
                  </h3>
                </div>
                <p className="micro text-signal">{work.year}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
