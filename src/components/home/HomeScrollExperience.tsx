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
};

/** Scroll stack — starts AFTER the banner section */
export function HomeScrollExperience({ works, reel }: Props) {
  return (
    <LineScrollStage>
      <div className="relative">
        <WorkHighlights works={works} />

        <div className="relative z-30 flex flex-col gap-[5vh] overflow-x-clip lg:gap-[15vh]">
          {reel.map((work, i) => (
            <HighlightCase
              key={work.id}
              work={work}
              index={i}
              total={reel.length}
              isLast={i === reel.length - 1}
            />
          ))}
        </div>
      </div>
    </LineScrollStage>
  );
}
