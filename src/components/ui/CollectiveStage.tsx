"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SafeImage } from "@/components/ui/SafeImage";

const FALLBACK = [
  "/cartoon-backdrop.png",
  "/header-logo.png",
  "/logo-white.png",
];

export function CollectiveStage({
  stills = [],
  showSpine = false,
}: {
  stills?: string[];
  showSpine?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const frames = stills.length ? stills.slice(0, 3) : FALLBACK;

  useEffect(() => {
    if (frames.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % frames.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [frames.length]);

  useEffect(() => {
    const el = stage.current;
    const card = plate.current;
    if (!el || !card) return;

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
  }, []);

  return (
    <div
      ref={stage}
      className={showSpine ? "close-stage has-spine" : "close-stage"}
      style={{ perspective: "1100px" }}
    >
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
        <div className="close-strip">
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

      {showSpine ? (
        <span className="close-stage-spine" aria-hidden>
          Collective
        </span>
      ) : null}
    </div>
  );
}
