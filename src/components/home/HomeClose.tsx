"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "A collective",
  "of artists",
  "united by one",
  "vision — tell",
  "powerful",
  "stories.",
];

export function HomeClose({ stills = [] }: { stills?: string[] }) {
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { y: "120%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "top 35%",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        el.querySelectorAll("[data-card]"),
        { y: 80, rotate: 0, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          rotate: (i) => [-12, 4, 14][i] ?? 8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.8,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = root.current;
    const pile = deck.current;
    if (!section || !pile) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      pile.style.transform = `translate3d(${x * 18}px, ${y * 12}px, 0)`;
    };
    const onLeave = () => {
      pile.style.transform = "translate3d(0,0,0)";
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const cards = stills.length
    ? stills.slice(0, 3)
    : ["/logo.png", "/logo.png", "/logo.png"];

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-ink px-4 py-24 text-paper md:px-7 md:py-32"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 sprockets md:w-7" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 sprockets md:w-7" />
      <p className="pointer-events-none absolute top-10 right-8 font-display text-[28vw] leading-none text-signal/10 select-none md:text-[14vw]">
        04
      </p>

      <div className="relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="micro text-signal">Studio / 04</p>
          <h2 className="display-huge mt-6 text-[12vw] lg:text-[5.2vw]">
            {LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span
                  data-line
                  className={
                    line.includes("powerful") || line.includes("stories")
                      ? "inline-block text-signal"
                      : "inline-block"
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p className="mt-8 max-w-md text-paper/65">
            A worldwide collective. One intent: show up better than yesterday,
            and make work that stays on the screen — and in the chest.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/about"
              data-cursor="About"
              className="border border-paper/30 px-6 py-3 micro transition-colors hover:border-signal hover:text-signal"
            >
              About the studio
            </Link>
            <Link
              href="/contact"
              data-cursor="Enquire"
              className="border border-signal bg-signal px-6 py-3 text-ink micro"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div
            ref={deck}
            className="relative mx-auto h-[380px] w-full max-w-[420px] transition-transform duration-300 ease-out md:h-[460px]"
          >
            {cards.map((src, i) => (
              <div
                key={src + i}
                data-card
                className="absolute top-8 left-1/2 w-[68%] overflow-hidden border border-paper/20 bg-ink-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                style={{
                  zIndex: i + 1,
                  marginLeft: `${(i - 1) * 28}px`,
                  transform: `rotate(${[-12, 3, 14][i]}deg)`,
                }}
              >
                <div className="flex justify-between px-2 py-1.5">
                  <span className="h-1.5 w-2.5 bg-ink" />
                  <span className="h-1.5 w-2.5 bg-ink" />
                  <span className="h-1.5 w-2.5 bg-ink" />
                </div>
                <img
                  src={src}
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="flex justify-between px-2 py-1.5">
                  <span className="h-1.5 w-2.5 bg-ink" />
                  <span className="h-1.5 w-2.5 bg-ink" />
                  <span className="h-1.5 w-2.5 bg-ink" />
                </div>
              </div>
            ))}

            <div className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 border border-signal bg-ink px-4 py-2">
              <p className="micro text-signal">Now casting collaborators</p>
            </div>
          </div>

          <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-10 w-auto" />
              <p className="micro text-mist">Picsodian / Collective</p>
            </div>
            <a
              href="mailto:creatives@picsodianstudios.com"
              data-cursor="Mail"
              className="micro text-signal"
            >
              creatives@picsodianstudios.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
