"use client";

import {
  HighlightCase,
  WorkHighlights,
} from "@/components/home/WorkHighlights";
import { LineScrollStage } from "@/components/layout/LineScrollStage";
import type { PublicWork } from "@/lib/utils";

type Props = {
  works: PublicWork[];
  reel: PublicWork[];
  videoUrl?: string;
  poster?: string;
};

/** Scroll stack — starts AFTER the banner section */
export function HomeScrollExperience({
  works,
  reel,
  videoUrl,
  poster,
}: Props) {
  return (
    <LineScrollStage videoUrl={videoUrl} poster={poster}>
      <div className="relative">
        <WorkHighlights works={works} still={poster} />

        <div className="relative z-30">
          {reel.map((work, i) => (
            <HighlightCase key={work.id} work={work} index={i} />
          ))}
        </div>
      </div>
    </LineScrollStage>
  );
}
