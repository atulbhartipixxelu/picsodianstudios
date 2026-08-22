"use client";

import { useEffect, useRef, useState } from "react";
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ease = cubicBezier(0, 0, 0, 0);

const LINES = [
  "We are a passion-driven",
  "creative studio built around",
  "ideas, motion, and people",
  "who truly care.",
];

const CHIPS = ["2D", "Motion", "Film", "Character", "24 fps"];

/** TheStudio — slides up after project stack (outside gap container) */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["50vh end", "100vh end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50vh", "0vh"], { ease });
  const rotate = useTransform(scrollYProgress, [0, 0.3], ["7deg", "0deg"], { ease });
  const x = useTransform(scrollYProgress, [0, 0.3], ["-10%", "0%"], { ease });

  useEffect(() => {
    const title = heading.current;
    if (!title) return;
    const lines = title.querySelectorAll<HTMLElement>(".heading-line");
    const ctx = gsap.context(() => {
      gsap.set(lines, { opacity: 0.16, color: "#9c9a9a" });
      gsap.to(lines, {
        opacity: 1,
        color: "#f2f0f0",
        stagger: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "top 78%",
          end: "top 30%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
    }, title);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative z-40 max-h-[50vh]">
      <motion.div
        style={{ x, y, rotate }}
        className="flex min-h-screen origin-[0%_0%] flex-col justify-center overflow-hidden bg-[#333333f2] px-4 py-28 text-paper lg:origin-[0%_50%] md:px-7"
      >
        <p className="micro mb-8 text-signal">Who we are / 01</p>
        <h2
          ref={heading}
          className="display-huge max-w-[16ch] text-[11.5vw] md:text-[7vw] lg:text-[6.2vw]"
        >
          {LINES.map((line) => (
            <span key={line} className="heading-line">
              {line}
            </span>
          ))}
        </h2>
      </motion.div>
    </div>
  );
}

export function StudioGate({ still }: { still?: string }) {
  const gate = useRef<HTMLElement>(null);
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
    const root = gate.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelector("[data-iris]"),
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(75% at 50% 50%)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = gate.current;
    const card = stage.current;
    const photo = img.current;
    if (!root || !card) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${mx * 12}deg) rotateX(${-my * 8}deg)`;
      if (photo) {
        photo.style.transform = `scale(1.12) translate(${mx * -18}px, ${my * -12}px)`;
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
    <section ref={gate} className="relative bg-ink px-4 py-20 text-paper md:px-7 md:py-28">
      <div className="relative grid w-full items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="micro mb-6 text-signal">The lowdown</p>
          <p className="max-w-xl text-lg leading-relaxed text-paper/70">
            Storytelling is more than frames and effects. We blast the screen with
            energy, emotion, and imagination — work that doesn&apos;t just look good,
            it stays with you.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
            {[
              ["24", "fps"],
              ["∞", "frames"],
              ["01", "vision"],
            ].map(([n, l]) => (
              <div key={l} className="border border-line px-2 py-4">
                <span className="font-display block text-3xl text-signal">{n}</span>
                <span className="micro mt-1 block text-mist">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-6">
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
        </div>
      </div>
    </section>
  );
}
