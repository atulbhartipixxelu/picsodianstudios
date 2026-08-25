"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CRAFT = ["2D", "Motion", "Film", "Character"];
const LINES = ["Work that", "stays with", "you."];

type Props = {
  still?: string;
};

export function Manifesto({ still }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) return;

      gsap.from(el.querySelectorAll("[data-line]"), {
        yPercent: 112,
        duration: 1.05,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });

      gsap.from(el.querySelector(".studio-gate"), {
        y: 48,
        rotate: 6,
        scale: 0.92,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % 24;
      const total = Math.floor(Date.now() / 1000) % 3600;
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      setTime(`01:${m}:${s}:${String(frame).padStart(2, "0")}`);
    }, 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const card = stage.current;
    const photo = img.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1100px) rotateY(${mx * 7}deg) rotateX(${-my * 6}deg)`;
      if (photo) {
        photo.style.transform = `scale(1.1) translate(${mx * -12}px, ${my * -9}px)`;
      }
    };
    const onLeave = () => {
      card.style.transform = "perspective(1100px) rotateY(0) rotateX(0)";
      if (photo) photo.style.transform = "scale(1.04) translate(0,0)";
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const line = scan.current;
    if (!line) return;
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    tl.fromTo(line, { top: "-10%", opacity: 0.9 }, { top: "110%", duration: 2.6 }).to(
      line,
      { opacity: 0, duration: 0.15 },
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="studio-block relative z-10 overflow-hidden bg-ink text-paper"
    >
      <div className="studio-grid-bg" aria-hidden />
      <span className="studio-watermark" aria-hidden>
        Stays
      </span>

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-7 md:py-28">
        <div className="studio-top" data-in>
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-paper/80">03 / Who we are</p>
          </div>
          <p className="micro hidden text-paper/50 sm:block">{time}</p>
        </div>

        <div className="studio-grid">
          <div>
            <h2 className="studio-title">
              {LINES.map((line) => (
                <span key={line} className="studio-clip">
                  <span
                    data-line
                    className={line === "you." ? "studio-title-mark" : undefined}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <p data-in className="studio-lede">
              We are a passion-driven studio built around ideas, motion, and
              people who care. Storytelling is more than frames and effects — it
              should hit with energy, then linger.
            </p>

            <div data-in className="studio-pulse">
              <span>24 fps</span>
              <span>∞ frames</span>
              <span>01 vision</span>
            </div>

            <Link
              data-in
              href="/about"
              className="studio-cta"
              data-cursor="About"
            >
              Read the full story
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <div
              ref={stage}
              className="studio-gate transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="studio-gate-photo">
                <span className="finder finder-tl" />
                <span className="finder finder-tr" />
                <span className="finder finder-bl" />
                <span className="finder finder-br" />

                {still ? (
                  <SafeImage
                    ref={img}
                    src={still}
                    alt="On set at Picsodian Studios"
                    className="manifesto-ken h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-ink">
                    <SafeImage
                      src="/logo-white.png"
                      alt=""
                      className="w-1/2 opacity-80"
                    />
                  </div>
                )}

                <div
                  ref={scan}
                  className="pointer-events-none absolute right-0 left-0 h-16 bg-gradient-to-b from-transparent via-paper/30 to-transparent"
                />
              </div>

              <div className="studio-hud">
                <p className="micro text-paper">{time}</p>
                <p className="micro flex items-center gap-2 text-paper">
                  <span className="studio-rec-dot" />
                  Rec
                </p>
              </div>
            </div>

            <ul className="studio-crafts">
              {CRAFT.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudioGate({ still }: { still?: string }) {
  return <Manifesto still={still} />;
}
