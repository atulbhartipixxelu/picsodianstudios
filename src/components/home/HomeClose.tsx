"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: "A collective of artists", accent: false },
  { text: "united by one vision.", accent: false },
  { text: "Tell powerful stories.", accent: true },
];

export function HomeClose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 22,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      const media = el.querySelector<HTMLElement>("[data-close-media]");
      if (media && !reduced) {
        gsap.fromTo(
          media,
          { scale: 1.08 },
          {
            scale: 1,
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
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav-surface="ink"
      className="close-block relative z-10 overflow-hidden text-paper"
    >
      <div className="close-bg" aria-hidden>
        <div data-close-media className="close-bg__media">
          <Image
            src="/home-close-bg.jpg"
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-[42%_45%]"
          />
        </div>
        <div className="close-bg__blue" />
        <div className="close-bg__shade" />
        <div className="close-bg__grain" />
      </div>

      <div className="close-shell">
        <div className="close-copy-col">
          <div data-in className="close-kicker">
            <span>04</span>
            <span>Studio</span>
            <span>Collective</span>
          </div>

          <h2 className="close-heading">
            {LINES.map((line) => (
              <span key={line.text} className="close-clip">
                <span
                  data-line
                  className={line.accent ? "close-accent" : undefined}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h2>

          <p data-in className="close-copy">
            A worldwide collective. One intent: show up better than yesterday,
            and make work that stays on the screen — and in the chest.
          </p>

          <div data-in className="close-actions">
            <div className="close-ctas">
              <Link href="/about" data-cursor="About" className="close-link">
                About the studio
              </Link>
              <Link href="/contact" data-cursor="Enquire" className="close-cta">
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div data-in className="close-foot">
        <div className="flex items-center gap-3">
          <SafeImage src="/logo-white.png" alt="" className="h-8 w-auto" />
          <p className="micro text-paper/70">Picsodian / Collective</p>
        </div>
        <a
          href="mailto:creatives@picsodianstudios.com"
          data-cursor="Mail"
          className="micro text-paper"
        >
          creatives@picsodianstudios.com
        </a>
      </div>
    </section>
  );
}
