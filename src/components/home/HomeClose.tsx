"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: "A collective of", accent: false },
  { text: "artists united", accent: false },
  { text: "by one vision.", accent: false },
  { text: "Tell powerful", accent: true },
  { text: "stories.", accent: true },
];

const FAN = [
  { x: -52, rotate: -16 },
  { x: 8, rotate: 3 },
  { x: 64, rotate: 17 },
];

export function HomeClose({ stills = [] }: { stills?: string[] }) {
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const lines = el.querySelectorAll<HTMLElement>("[data-line]");
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      const rest = el.querySelectorAll<HTMLElement>("[data-in]");
      const num = el.querySelector<HTMLElement>("[data-num]");

      gsap.fromTo(
        lines,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        },
      );

      gsap.from(rest, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.28,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      gsap.set(cards, { y: 110, x: 0, rotate: 0, opacity: 0 });
      gsap.to(cards, {
        y: 0,
        x: (i) => FAN[i]?.x ?? 0,
        rotate: (i) => FAN[i]?.rotate ?? 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.13,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 68%", once: true },
        onComplete: () => {
          cards.forEach((card, i) => {
            gsap.to(card, {
              y: "+=12",
              duration: 2.2 + i * 0.25,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              delay: i * 0.18,
            });
          });
        },
      });

      if (num) {
        gsap.fromTo(
          num,
          { yPercent: 8, opacity: 0.08 },
          {
            yPercent: -10,
            opacity: 0.14,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      }

      const pile = deck.current;
      if (!pile) return;

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(pile, {
          x: x * 22,
          y: y * 14,
          rotateX: -y * 6,
          rotateY: x * 10,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(pile, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: root },
  );

  const cards = stills.length
    ? stills.slice(0, 3)
    : ["/cartoon-backdrop.png", "/header-logo.png", "/logo-white.png"];

  return (
    <section
      ref={root}
      className="close-block relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-ink px-4 py-24 text-paper md:px-7 md:py-32"
    >
      <p
        data-num
        className="close-num pointer-events-none absolute top-6 right-4 select-none md:top-4 md:right-8"
      >
        04
      </p>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p data-in className="micro text-paper/70">
            Studio / 04
          </p>

          <h2 className="close-heading mt-6">
            {LINES.map((line) => (
              <span key={line.text} className="close-clip">
                <span
                  data-line
                  className={
                    line.accent ? "heading-line close-accent" : "heading-line"
                  }
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>

          <p data-in className="close-copy mt-8 max-w-md">
            A worldwide collective. One intent: show up better than yesterday,
            and make work that stays on the screen — and in the chest.
          </p>

          <div data-in className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/about"
              data-cursor="About"
              className="border border-paper/30 px-6 py-3 micro transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              About the studio
            </Link>
            <Link
              href="/contact"
              data-cursor="Enquire"
              className="border border-paper bg-paper px-6 py-3 text-ink micro"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div
            ref={deck}
            className="close-deck relative mx-auto h-[380px] w-full max-w-[420px] md:h-[460px]"
            style={{ perspective: "900px", transformStyle: "preserve-3d" }}
          >
            <span className="close-orbit" aria-hidden />

            {cards.map((src, i) => (
              <article
                key={src + i}
                data-card
                className="close-card absolute top-10 left-1/2 w-[68%] -translate-x-1/2"
                style={{ zIndex: i + 1 }}
              >
                <div className="close-card-inner">
                  <div className="flex justify-between px-2 py-1.5">
                    <span className="h-1.5 w-2.5 bg-ink" />
                    <span className="h-1.5 w-2.5 bg-ink" />
                    <span className="h-1.5 w-2.5 bg-ink" />
                  </div>
                  <div className="relative overflow-hidden">
                    <SafeImage
                      src={src}
                      alt=""
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <span className="close-scan" />
                    <span className="close-card-index">{`0${i + 1}`}</span>
                  </div>
                  <div className="flex justify-between px-2 py-1.5">
                    <span className="h-1.5 w-2.5 bg-ink" />
                    <span className="h-1.5 w-2.5 bg-ink" />
                    <span className="h-1.5 w-2.5 bg-ink" />
                  </div>
                </div>
              </article>
            ))}

            <div className="close-cast">
              <div className="close-cast-track">
                <span>Now casting collaborators — </span>
                <span>Now casting collaborators — </span>
                <span>Now casting collaborators — </span>
                <span>Now casting collaborators — </span>
              </div>
            </div>
          </div>

          <div
            data-in
            className="mt-14 flex items-center justify-between gap-4 border-t border-paper/20 pt-6"
          >
            <div className="flex items-center gap-3">
              <SafeImage src="/logo-white.png" alt="" className="h-10 w-auto" />
              <p className="micro text-paper/55">Picsodian / Collective</p>
            </div>
            <a
              href="mailto:creatives@picsodianstudios.com"
              data-cursor="Mail"
              className="micro text-paper"
            >
              creatives@picsodianstudios.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
