"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { CollectiveStage } from "@/components/ui/CollectiveStage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: "A collective of artists", accent: false },
  { text: "united by one vision.", accent: false },
  { text: "Tell powerful stories.", accent: true },
];

export function HomeClose({ stills = [] }: { stills?: string[] }) {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % 24;
      const total = Math.floor(Date.now() / 1000) % 3600;
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      setTime(`04:${m}:${s}:${String(frame).padStart(2, "0")}`);
    }, 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

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
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 74%", once: true },
        },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      gsap.from(el.querySelector(".close-stage"), {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      const iris = el.querySelector<HTMLElement>("[data-iris]");
      if (iris && !reduced) {
        gsap.fromTo(
          iris,
          { rotate: -12, scale: 0.92 },
          {
            rotate: 8,
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      }

      const lamp = spot.current;
      if (lamp) {
        const box = el.getBoundingClientRect();
        gsap.set(lamp, { x: box.width * 0.72, y: box.height * 0.45 });
      }

      const onMove = (e: MouseEvent) => {
        if (!lamp) return;
        const r = el.getBoundingClientRect();
        gsap.to(lamp, {
          x: e.clientX - r.left,
          y: e.clientY - r.top,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      el.addEventListener("mousemove", onMove);
      return () => {
        el.removeEventListener("mousemove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="close-block relative z-10 overflow-hidden bg-ink px-4 py-10 text-paper md:px-7 md:py-12"
    >
      <div className="close-fx" aria-hidden>
        <div className="close-hatch" />
        <div className="close-iris" data-iris>
          <span />
          <span />
          <span />
        </div>
        <div className="close-wash" />
        <span className="close-spine">Collective</span>
        <div className="close-grain" />
        <div ref={spot} className="close-spot" />
      </div>

      <div className="close-shell">
        <div className="close-copy-col">
          <div data-in className="close-kicker">
            <span>04</span>
            <span>Studio</span>
            <span>{time}</span>
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
            <div className="close-chips">
              <span>24 fps</span>
              <span>Collective</span>
              <span>Open gate</span>
            </div>
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

        <div className="close-stage-wrap" data-in>
          <CollectiveStage stills={stills} />
        </div>
      </div>

      <div data-in className="close-foot">
        <div className="flex items-center gap-3">
          <SafeImage src="/logo-white.png" alt="" className="h-8 w-auto" />
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
    </section>
  );
}
