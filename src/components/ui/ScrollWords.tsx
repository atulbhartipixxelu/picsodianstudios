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
  /** Client-only matcher. Server pages should use `accentWords`. */
  accent?: (word: string) => boolean;
  /** Serializable highlight match — safe to pass from Server Components. */
  accentWords?: string[];
};

function isAccent(
  text: string,
  accent?: (word: string) => boolean,
  accentWords?: string[],
) {
  if (accent?.(text)) return true;
  const lower = text.toLowerCase();
  return Boolean(accentWords?.some((word) => lower.includes(word.toLowerCase())));
}

export function ScrollWords({
  lines,
  className,
  as: Tag = "h2",
  accent,
  accentWords,
}: Props) {
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
            isAccent(line, accent, accentWords) ||
            line.split(" ").some((word) => isAccent(word, accent, accentWords))
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
