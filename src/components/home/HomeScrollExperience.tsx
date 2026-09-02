"use client";

import {
  HighlightCase,
  WorkHighlights,
} from "@/components/home/WorkHighlights";
import type { PublicWork } from "@/lib/utils";

type Props = {
  works: PublicWork[];
  reel: PublicWork[];
  showIntro?: boolean;
  startIndex?: number;
  solid?: boolean;
};

/** Scroll stack — starts AFTER the banner section */
export function HomeScrollExperience({
  works,
  reel,
  showIntro = true,
  startIndex = 0,
  solid = false,
}: Props) {
  if (!showIntro && reel.length === 0) return null;

  return (
    <div
      className={`relative z-0 max-w-[100vw] ${solid ? "bg-ink" : "bg-transparent"}`}
    >
      {showIntro ? <WorkHighlights works={works} /> : null}

      <div className="relative z-30">
        {reel.map((work, i) => (
          <HighlightCase
            key={work.id}
            work={work}
            index={startIndex + i}
            solid={solid}
          />
        ))}
      </div>
    </div>
  );
}
