"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { stillSrc } from "@/lib/utils";
import { FALLBACK_SHOWREEL } from "@/lib/video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CAPABILITIES = [
  "2D Animation",
  "Motion Graphics",
  "Character & Creature",
  "Prop Animation",
  "Film Production",
  "Lookdev / Compositing",
];

const VALUES = [
  {
    n: "01",
    t: "Feel it",
    d: "We don't just perform. We connect — energy first, polish always. Every frame should make you part of the experience.",
  },
  {
    n: "02",
    t: "Chase the next",
    d: "We explore, evolve, and refuse to repeat yesterday's trick. The intent is simple: be better than yesterday.",
  },
  {
    n: "03",
    t: "Stay fearless",
    d: "Work that shakes systems, breaks patterns, and stays with you. Mind-blowing, fresh, and undeniably cool.",
  },
];

const HERO = ["Built around ideas,", "motion, and people", "who care."];
const GATE_COPY = "PICSODIAN STUDIOS  ·  24 FPS  ·  GATE  ·  SILENCE ON SET  ·  ";

type Props = {
  paragraphs: string[];
  stills?: string[];
};

export function AboutExperience({ paragraphs, stills = [] }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(el.querySelectorAll("[data-hero-line]"), {
        yPercent: 110,
        duration: 1.05,
        stagger: 0.12,
        ease: "power4.out",
      });

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 86%", once: true },
        });
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

  const story =
    paragraphs.length > 0
      ? paragraphs
      : [
          "Picsodian Studios is a passion-driven creative studio built around ideas, motion, and people who truly care about the work they create.",
          "We believe storytelling is more than frames and effects. It's about blasting the screen with energy, emotion, and imagination.",
        ];

  const frames = stills.length ? stills : [stillSrc()];

  return (
    <div ref={root} className="about-page">
      <span className="about-watermark" aria-hidden>
        Studio
      </span>
      <div className="about-grid-bg" aria-hidden />

      <section className="about-hero">
        <div className="about-kicker" data-in>
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-signal">Studio / About</p>
          </div>
          <p className="micro text-paper/50">{time}</p>
        </div>

        <h1 className="about-title">
          {HERO.map((line) => (
            <span key={line} className="about-clip">
              <span
                data-hero-line
                className={line.includes("care") ? "about-mark" : undefined}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="about-hero-body">
          <div>
            <p className="about-lede" data-in>
              A collective of artists from around the world, united by one
              vision: tell powerful stories and create visuals that are
              undeniably cool.
            </p>
            <div className="about-hero-meta" data-in>
              <span>24 fps</span>
              <span>Collective</span>
              <span>Open gate</span>
            </div>
          </div>

          <div className="about-hero-still" data-in>
            <AboutHeroGate />
          </div>
        </div>

        <div className="about-plates" data-in>
          {[0, 1, 2].map((i) => (
            <div key={i} className="about-plate">
              <SafeImage src={frames[i % frames.length]} alt="" />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-copy" data-rise>
          <p className="micro text-signal">01 / The story</p>
          <div className="about-story-rail">
            {story.map((p, i) => (
              <p key={p.slice(0, 28)}>
                <span className="about-story-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </p>
            ))}
          </div>
        </div>

        <aside className="about-aside" data-rise>
          <div className="about-aside-card">
            <p className="micro text-paper/45">Inquiries</p>
            <a
              href="mailto:creatives@picsodianstudios.com"
              className="about-mail"
              data-cursor="Mail"
            >
              creatives@picsodianstudios.com
            </a>
          </div>
          <div className="about-aside-card">
            <p className="micro text-paper/45">Collective</p>
            <p>
              Artists from around the world, united by one vision: tell powerful
              stories and create visuals that are undeniably cool.
            </p>
          </div>
          <div className="about-aside-meter">
            <span>24 fps</span>
            <span>Open gate</span>
            <span>01 vision</span>
          </div>
        </aside>
      </section>

      <section className="about-make">
        <div className="about-make-head" data-rise>
          <p className="micro text-signal">02 / Capabilities</p>
          <h2 className="about-heading">What we make</h2>
        </div>
        <ul className="about-crafts">
          {CAPABILITIES.map((item, i) => (
            <li key={item} data-rise>
              <span className="about-craft-no">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="about-craft-name">{item}</span>
              <span className="about-craft-mark" aria-hidden />
            </li>
          ))}
        </ul>
      </section>

      <section className="about-values">
        {VALUES.map((item) => (
          <article key={item.n} className="about-value" data-rise>
            <span className="about-value-ghost" aria-hidden>
              {item.n}
            </span>
            <p className="micro text-signal">{item.n}</p>
            <h3>{item.t}</h3>
            <p className="about-value-copy">{item.d}</p>
          </article>
        ))}
      </section>

      <section className="about-next" data-rise>
        <p className="micro text-signal">03 / Next</p>
        <h2 className="about-heading about-next-title">
          Let&apos;s make something
          <br />
          that stays.
        </h2>
        <div className="about-next-actions">
          <Link href="/work" className="about-btn" data-cursor="Work">
            See the work
          </Link>
          <Link
            href="/contact"
            className="about-btn about-btn-fill"
            data-cursor="Enquire"
          >
            Start a project
          </Link>
        </div>
      </section>
    </div>
  );
}

function AboutHeroGate() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    const play = () => {
      if (document.documentElement.classList.contains("is-booting")) return;
      void video.play().catch(() => {});
    };
    video.addEventListener("canplay", play);
    play();
    const obs = new MutationObserver(play);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      video.removeEventListener("canplay", play);
      obs.disconnect();
      video.pause();
    };
  }, []);

  return (
    <div className="about-gate">
      <video
        ref={videoRef}
        className="about-gate-video"
        src={`${FALLBACK_SHOWREEL}#t=0.001`}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="about-gate-veil" />
      <div className="about-gate-glow" />
      <svg className="about-gate-orbit" viewBox="0 0 400 400">
        <defs>
          <path
            id="about-orbit"
            d="M200,200 m-148,0 a148,148 0 1,1 296,0 a148,148 0 1,1 -296,0"
          />
        </defs>
        <text className="about-gate-orbit-text">
          <textPath href="#about-orbit">{GATE_COPY.repeat(2)}</textPath>
        </text>
      </svg>
      <span className="about-hero-still-label">Rolling</span>
    </div>
  );
}
