"use client";

import { SafeImage } from "@/components/ui/SafeImage";

const CARTOON = "/cartoon-backdrop.png";

/**
 * Sticky cartoon bg — panels slide over this AFTER the banner section.
 */
export function LineScrollStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-0 isolate max-w-[100vw] overflow-x-clip">
      <div className="sticky top-0 z-10 pb-[100vh]">
        <div className="relative h-screen overflow-hidden bg-ink">
          <SafeImage
            src={CARTOON}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/65" />
        </div>
      </div>

      <div className="relative z-20 overflow-x-clip">{children}</div>
    </div>
  );
}
