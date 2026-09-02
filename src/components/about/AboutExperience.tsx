"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CollectiveStage } from "@/components/ui/CollectiveStage";
import { stillSrc } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO = ["Built around ideas,", "motion, and people", "who care."];

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
      <section className="about-hero">
        <div className="about-kicker" data-in>
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-signal">Studio / About</p>
          </div>
          <p className="micro text-paper/50">{time}</p>
        </div>

        <div className="about-hero-split">
          <div>
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

          <div className="about-hero-stage" data-in>
            <CollectiveStage stills={frames} />
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-copy" data-rise>
          <p className="micro text-signal">01 / The story</p>
          <ul className="about-story-rail">
            {story.map((text, i) => (
              <li key={text.slice(0, 28)}>
                <span className="about-story-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p>{text}</p>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
