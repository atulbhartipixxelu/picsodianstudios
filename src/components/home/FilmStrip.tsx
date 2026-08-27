"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicWork } from "@/lib/utils";
import { LineMask } from "@/components/ui/LineMask";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function FilmStrip({ works }: { works: PublicWork[] }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const frameEl = useRef<HTMLSpanElement>(null);
  const catEl = useRef<HTMLParagraphElement>(null);
  const titleEl = useRef<HTMLHeadingElement>(null);
  const yearEl = useRef<HTMLParagraphElement>(null);
  const ids = works.map((work) => work.id).join("|");

  useGSAP(
    () => {
      const wrap = root.current;
      const board = stage.current;
      if (!wrap || !board) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        board.querySelectorAll("[data-strip-card]"),
      );
      const photos = gsap.utils.toArray<HTMLElement>(
        board.querySelectorAll("[data-strip-photo]"),
      );
      const ticks = gsap.utils.toArray<HTMLElement>(
        wrap.querySelectorAll("[data-strip-tick]"),
      );
      const n = cards.length;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const setFrame = (index: number) => {
        const work = works[index];
        if (!work) return;
        if (frameEl.current) {
          frameEl.current.textContent = String(index + 1).padStart(2, "0");
        }
        if (catEl.current) catEl.current.textContent = work.category;
        if (titleEl.current) titleEl.current.textContent = work.title;
        if (yearEl.current) yearEl.current.textContent = String(work.year);
        ticks.forEach((tick, i) => {
          tick.classList.toggle("is-on", i === index);
        });
        cards.forEach((card, i) => {
          card.style.pointerEvents = i === index ? "auto" : "none";
        });
      };

      setFrame(0);

      if (reduced || n < 2) {
        wrap.classList.add("is-static");
        return () => wrap.classList.remove("is-static");
      }

      const unit = window.innerHeight * (window.innerWidth < 768 ? 0.9 : 1.05);
      wrap.style.height = `${n * unit}px`;

      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          filter: "brightness(1)",
          clipPath:
            i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        });
        if (photos[i]) {
          gsap.set(photos[i], { scale: i === 0 ? 1 : 1.16 });
        }
      });

      if (rail.current) gsap.set(rail.current, { scaleY: 0, transformOrigin: "top" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              n - 1,
              Math.round(self.progress * (n - 1)),
            );
            setFrame(index);
          },
        },
      });

      if (rail.current) {
        tl.to(rail.current, { scaleY: 1, duration: n - 1 }, 0);
      }

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(
          cards[i],
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
          at,
        );
        tl.to(
          cards[i - 1],
          {
            scale: 0.94,
            filter: "brightness(0.45)",
            duration: 1,
          },
          at,
        );
        if (photos[i]) {
          tl.to(photos[i], { scale: 1, duration: 1 }, at);
        }
        if (photos[i - 1]) {
          tl.to(photos[i - 1], { scale: 1.08, duration: 1 }, at);
        }
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("ps:ready", refresh);
      requestAnimationFrame(refresh);

      return () => {
        window.removeEventListener("ps:ready", refresh);
        wrap.style.height = "";
        wrap.classList.remove("is-static");
      };
    },
    { scope: root, dependencies: [ids] },
  );

  if (!works.length) return null;

  const first = works[0];

  return (
    <div ref={root} className="strip-root relative bg-ink">
      <section className="strip-pin sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-ink">
        <div className="flex items-end justify-between px-4 pt-10 pb-5 md:px-7">
          <div>
            <p className="micro text-signal">Latest works / 02</p>
            <LineMask
              lines={["On the strip"]}
              className="display-huge mt-2 text-5xl md:text-7xl"
            />
          </div>
          <Link href="/work" className="micro text-paper" data-cursor="Index">
            All work →
          </Link>
        </div>

        <div className="strip-board relative mx-4 mb-5 flex min-h-0 flex-1 gap-4 md:mx-7 md:gap-6">
          <ol className="strip-ticks hidden shrink-0 flex-col justify-center gap-3 md:flex" aria-hidden>
            {works.map((work, i) => (
              <li
                key={work.id}
                data-strip-tick
                className={i === 0 ? "is-on" : undefined}
              >
                {String(i + 1).padStart(2, "0")}
              </li>
            ))}
          </ol>

          <div ref={stage} className="strip-stage relative min-h-0 flex-1">
            {works.map((work, i) => (
              <Link
                key={work.id}
                href={`/work/${work.slug}`}
                data-strip-card
                data-cursor="View"
                className="strip-card group"
                style={{ zIndex: i + 1 }}
              >
                <div className="strip-still">
                  <SafeImage
                    data-strip-photo
                    src={work.thumbnail || work.heroImage}
                    alt={work.title}
                    className="strip-photo"
                  />
                </div>
                <div className="strip-static-meta">
                  <p className="micro text-mist">
                    {String(i + 1).padStart(2, "0")} / {work.category}
                  </p>
                  <h3 className="font-display mt-1 text-2xl tracking-tight uppercase">
                    {work.title}
                  </h3>
                </div>
              </Link>
            ))}
            <div className="strip-rail" aria-hidden>
              <div ref={rail} className="strip-rail-fill" />
            </div>
          </div>
        </div>

        <div className="strip-live flex items-start justify-between gap-4 px-4 pb-10 md:px-7">
          <div>
            <p className="micro text-mist">
              <span ref={frameEl}>{String(1).padStart(2, "0")}</span>
              {" / "}
              <span ref={catEl}>{first.category}</span>
            </p>
            <h3
              ref={titleEl}
              className="font-display mt-1 text-2xl tracking-tight uppercase md:text-3xl"
            >
              {first.title}
            </h3>
          </div>
          <p ref={yearEl} className="micro text-signal">
            {first.year}
          </p>
        </div>
      </section>
    </div>
  );
}
