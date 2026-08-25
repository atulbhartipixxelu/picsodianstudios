"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";

const CARTOON_SRC = "/cartoon-backdrop.png";

type Props = {
  /** Ref to the scroll stack container for parallax sync */
  containerRef?: React.RefObject<HTMLElement | null>;
};

/** Cartoon illustration fixed behind moving scroll panels — peeks through on rotate/slide */
export function ScrollCartoonBackdrop({ containerRef }: Props) {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const target = containerRef ?? fallbackRef;

  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.12, 1.06]);

  return (
    <div
      ref={fallbackRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div style={{ y, scale }} className="absolute inset-[-12%]">
        <SafeImage
          src={CARTOON_SRC}
          alt=""
          className="h-full w-full object-cover opacity-95"
          draggable={false}
        />
        <div className="absolute inset-0 bg-ink/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/70" />
      </motion.div>
    </div>
  );
}

/** Per-section cartoon slice — optional accent behind individual panels */
export function SectionCartoonPeek({
  src = CARTOON_SRC,
  position = "right",
}: {
  src?: string;
  position?: "left" | "right" | "center";
}) {
  const objectPos =
    position === "left"
      ? "object-left"
      : position === "center"
        ? "object-center"
        : "object-right";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <SafeImage
        src={src}
        alt=""
        className={`absolute inset-0 h-full w-[130%] max-w-none ${objectPos} object-cover opacity-75`}
        draggable={false}
      />
    </div>
  );
}
