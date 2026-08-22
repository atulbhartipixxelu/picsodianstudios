"use client";

import { useRef } from "react";
import { ScrollCartoonBackdrop } from "@/components/layout/ScrollCartoonBackdrop";

/** Wraps scroll stack with shared cartoon backdrop layer */
export function ScrollStackShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const stackRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={stackRef} className="relative">
      <ScrollCartoonBackdrop containerRef={stackRef} />
      <div className="relative z-30 flex flex-col gap-[5vh] overflow-x-clip lg:gap-[15vh]">
        {children}
      </div>
    </div>
  );
}
