"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CRAFT = ["2D", "Motion", "Film"];

type Props = {
  still?: string;
};

export function Manifesto({ still }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");
  const [tick, setTick] = useState("00");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });
      gsap.from(el.querySelectorAll("[data-meter]"), {
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el.querySelector(".studio-meter"),
          start: "top 88%",
          once: true,
        },
      });
      gsap.from(el.querySelectorAll("[data-meter-val]"), {
        yPercent: 110,
        duration: 0.85,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el.querySelector(".studio-meter"),
          start: "top 88%",
          once: true,
        },
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
      setTick(String(frame).padStart(2, "0"));
    }, 1000 / 24);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const wrap = root.current;
    const card = stage.current;
    const photo = img.current;
    if (!wrap || !card) return;

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1100px) rotateY(${mx * 6}deg) rotateX(${-my * 5}deg)`;
      if (photo) {
        photo.style.transform = `scale(1.08) translate(${mx * -10}px, ${my * -8}px)`;
      }
    };
    const onLeave = () => {
      card.style.transform = "perspective(1100px) rotateY(0) rotateX(0)";
      if (photo) photo.style.transform = "scale(1.04) translate(0,0)";
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const line = scan.current;
    if (!line) return;
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
    tl.fromTo(line, { top: "-8%" }, { top: "108%", duration: 2.4 }).to(line, {
      opacity: 0,
      duration: 0.2,
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="studio-block relative z-10 overflow-hidden bg-ink text-paper"
    >
      <span className="studio-watermark" aria-hidden>
        Stays
      </span>

      <div className="relative mx-auto max-w-6xl px-4 pt-20 md:px-7 md:pt-28">
        <div className="studio-top" data-in>
          <p className="micro text-paper/80">03 / Who we are</p>
          <p className="micro hidden text-paper/55 sm:block">Picsodian Studios</p>
        </div>

        <div className="studio-grid">
          <div>
            <h2 data-in className="studio-title">
              <span>Work that</span>
              <span>stays with</span>
              <span>you.</span>
            </h2>

            <p data-in className="studio-lede">
              We are a passion-driven studio built around ideas, motion, and
              people who care. Storytelling is more than frames and effects — it
              should hit with energy, then linger.
            </p>

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

          <div data-in>
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
                    <SafeImage src="/logo-white.png" alt="" className="w-1/2 opacity-80" />
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
                  <span className="h-1.5 w-1.5 rounded-full bg-paper" />
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

      <div className="studio-meter">
        <span className="studio-meter-rail" aria-hidden />
        <span className="studio-meter-playhead" aria-hidden />
        <dl className="studio-meter-grid">
          <div data-meter className="studio-meter-cell">
            <span className="studio-meter-no">01</span>
            <dt>Frame rate</dt>
            <dd>
              <span className="studio-meter-clip">
                <span data-meter-val>24 fps</span>
              </span>
              <span className="studio-meter-live">{tick}</span>
            </dd>
          </div>
          <div data-meter className="studio-meter-cell">
            <span className="studio-meter-no">02</span>
            <dt>Canvas</dt>
            <dd>
              <span className="studio-meter-clip">
                <span data-meter-val>
                  <span className="studio-meter-infinity">∞</span> frames
                </span>
              </span>
            </dd>
          </div>
          <div data-meter className="studio-meter-cell">
            <span className="studio-meter-no">03</span>
            <dt>Focus</dt>
            <dd>
              <span className="studio-meter-clip">
                <span data-meter-val>01 vision</span>
              </span>
              <span className="studio-meter-cursor" aria-hidden />
            </dd>
          </div>
        </dl>
        <span className="studio-meter-rail" aria-hidden />
      </div>
    </section>
  );
}

export function StudioGate({ still }: { still?: string }) {
  return <Manifesto still={still} />;
}
