"use client";

import {
  HighlightCase,
  WorkHighlights,
} from "@/components/home/WorkHighlights";
import type { PublicWork } from "@/lib/utils";

type Props = {
  works: PublicWork[];
  reel: PublicWork[];
};

/** Scroll stack — starts AFTER the banner section */
export function HomeScrollExperience({ works, reel }: Props) {
  return (
    <div className="relative z-0 max-w-[100vw] bg-transparent">
      <WorkHighlights works={works} />

      <div className="relative z-30">
        {reel.map((work, i) => (
          <HighlightCase key={work.id} work={work} index={i} />
        ))}
      </div>
    </div>
  );
}
