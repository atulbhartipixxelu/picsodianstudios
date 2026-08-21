"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "We are a passion-driven",
  "creative studio built around",
  "ideas, motion, and people",
  "who truly care.",
];

const CHIPS = ["2D", "Motion", "Film", "Character", "24 fps"];

type Props = {
  still?: string;
};

export function Manifesto({ still }: Props) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const scan = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00:00:00");

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % 24;
      const total = Math.floor(Date.now() / 1000) % 3600;
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      setTime(`01:${m}:${s}:${String(frame).padStart(2, "0")}`);
    }, 1000 / 24);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-word]"),
        { x: -40, opacity: 0, filter: "blur(8px)" },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "center center",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        "[data-iris]",
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(75% at 50% 50%)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.9,
          },
        },
      );

      gsap.fromTo(
        "[data-chip]",
        { x: -16, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: "top 60%",
            end: "top 30%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        "[data-stat] span",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: root,
            start: "top 45%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = ref.current;
    const card = stage.current;
    const photo = img.current;
    if (!root || !card) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
      if (photo) {
        photo.style.transform = `scale(1.12) translate(${x * -18}px, ${y * -12}px)`;
      }
    };
    const onLeave = () => {
      card.style.transform = "perspective(1000px) rotateY(0) rotateX(0)";
      if (photo) photo.style.transform = "scale(1.08) translate(0,0)";
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
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
      ref={ref}
      className="relative overflow-hidden bg-ink px-4 py-24 text-paper md:px-7 md:py-32"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 sprockets md:w-7" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 sprockets md:w-7" />

      <div className="relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="micro mb-8 text-signal">Who we are / 01</p>
          <h2 className="display-huge text-[11vw] lg:text-[5.4vw]">
            {LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                {line.split(" ").map((word) => (
                  <span
                    key={word + line}
                    className="inline-block overflow-hidden pr-[0.28em]"
                  >
                    <span data-word className="inline-block">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70">
            Storytelling is more than frames and effects. We blast the screen with
            energy, emotion, and imagination — work that doesn&apos;t just look good,
            it stays with you.
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square max-w-[460px]" data-iris>
            <div className="manifesto-ring absolute inset-0" />

            <div
              ref={stage}
              className="absolute inset-[13%] overflow-hidden border border-signal/50 bg-ink-2 transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="finder finder-tl" />
              <span className="finder finder-tr" />
              <span className="finder finder-bl" />
              <span className="finder finder-br" />

              {still ? (
                <img
                  ref={img}
                  src={still}
                  alt=""
                  className="manifesto-ken h-full w-full object-cover opacity-85"
                />
              ) : (
                <div className="grid h-full place-items-center bg-ink-2">
                  <img src="/logo.png" alt="" className="w-2/3" />
                </div>
              )}

              <div
                ref={scan}
                className="pointer-events-none absolute right-0 left-0 h-16 bg-gradient-to-b from-transparent via-signal/35 to-transparent"
              />
              <div className="pointer-events-none absolute inset-0 manifesto-grain" />

              <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between">
                <p className="micro text-signal">{time}</p>
                <p className="micro flex items-center gap-2 text-signal">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
                  Rec
                </p>
              </div>
              <p className="micro absolute bottom-3 left-3 z-20 text-signal/80">
                Studio / Gate
              </p>
            </div>

            {CHIPS.map((chip, i) => (
              <span
                key={chip}
                data-chip
                className="absolute border border-signal/40 bg-ink/85 px-3 py-1 micro text-signal backdrop-blur-sm"
                style={{
                  top: `${14 + i * 15}%`,
                  [i % 2 === 0 ? "left" : "right"]: "-2%",
                }}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              ["24", "fps"],
              ["∞", "frames"],
              ["01", "vision"],
            ].map(([n, l]) => (
              <div key={l} data-stat className="border border-line px-2 py-4">
                <span className="font-display block text-3xl text-signal">{n}</span>
                <span className="micro mt-1 block text-mist">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
