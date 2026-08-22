"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  accent?: (word: string) => boolean;
};

export function ScrollWords({
  lines,
  className,
  as: Tag = "h2",
  accent,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const row = el.querySelectorAll<HTMLElement>(".heading-line");
      gsap.set(row, { opacity: 0.16, color: "#9c9a9a" });
      gsap.to(row, {
        opacity: 1,
        color: (i) =>
          accent?.(lines[i] ?? "") || accent?.(lines[i]?.split(" ")[0] ?? "")
            ? "#ff4444"
            : "#f2f0f0",
        stagger: 0.14,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 32%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref, dependencies: [lines.join("|")] },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line) => (
        <span
          key={line}
          className={
            accent?.(line) || line.split(" ").some((w) => accent?.(w))
              ? "heading-line text-signal"
              : "heading-line"
          }
        >
          {line}
        </span>
      ))}
    </Tag>
  );
}
