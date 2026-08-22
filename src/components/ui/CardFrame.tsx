"use client";

import { type ReactNode } from "react";

/** Film crop / overscan overlay — matches The Line ProjectCard boilerplate */
export function CardFrame() {
  const label = "micro text-signal/80";
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <span className={`absolute top-3 left-3 ${label}`}>Overscan</span>
      <span className={`absolute top-3 right-3 ${label}`}>1241 × 692</span>
      <span className={`absolute bottom-3 left-3 ${label}`}>Action safe</span>
      <span className={`absolute bottom-3 right-3 ${label}`}>100%</span>
      <span className={`absolute top-1/2 left-3 -translate-y-1/2 ${label}`}>
        [ 16:9 ]
      </span>
      <div className="absolute inset-[8%] border border-signal/25" />
      <div className="absolute inset-[13%] border border-paper/10" />
    </div>
  );
}

export function CardChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-full flex-col gap-1 bg-ink-2/95 p-1 md:gap-1.5 md:p-1.5">
      {children}
    </div>
  );
}
