"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export function HomeClose({ stills = [] }: { stills?: string[] }) {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");
  const [active, setActive] = useState(0);

  const frames = stills.length
    ? stills.slice(0, 3)
    : ["/cartoon-backdrop.png", "/header-logo.png", "/logo-white.png"];

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

  useEffect(() => {
    if (frames.length < 2) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % frames.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [frames.length]);

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

      const card = plate.current;
      const lamp = spot.current;
      if (lamp) {
        const box = el.getBoundingClientRect();
        gsap.set(lamp, { x: box.width * 0.72, y: box.height * 0.45 });
      }
      if (!card) return;

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * 8,
          rotateX: -y * 5,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (lamp) {
          gsap.to(lamp, {
            x: e.clientX - r.left,
            y: e.clientY - r.top,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };
      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
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

        <div className="close-stage" style={{ perspective: "1100px" }}>
          <div ref={plate} className="close-plate">
            {frames.map((src, i) => (
              <SafeImage
                key={src + i}
                src={src}
                alt=""
                className={i === active ? "is-on" : undefined}
              />
            ))}
            <span className="close-gate" />
            <div className="close-cast">
              <div className="close-cast-track">
                <span>Now casting collaborators — </span>
                <span>Now casting collaborators — </span>
              </div>
            </div>
          </div>

          {frames.length > 1 ? (
            <div className="close-strip" data-in>
              {frames.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={i === active ? "is-on" : undefined}
                  onClick={() => setActive(i)}
                  aria-label={`Frame ${i + 1}`}
                >
                  <SafeImage src={src} alt="" />
                  <span>{`0${i + 1}`}</span>
                </button>
              ))}
            </div>
          ) : null}
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
