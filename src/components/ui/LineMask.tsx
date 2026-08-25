"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function LineMask({
  lines,
  className,
  accent,
}: {
  lines: string[];
  className?: string;
  accent?: (line: string) => boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const row = el.querySelectorAll<HTMLElement>(".heading-line");
      gsap.set(row, { opacity: 0.16, color: "#F2F0F0" });
      gsap.to(row, {
        opacity: 1,
        color: "#F2F0F0",
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          end: "top 32%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref, dependencies: [lines.join("|")] },
  );

  return (
    <h2 ref={ref} className={className}>
      {lines.map((line) => (
        <span
          key={line}
          className={accent?.(line) ? "heading-line text-signal" : "heading-line"}
        >
          {line}
        </span>
      ))}
    </h2>
  );
}
