"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  cubicBezier,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const ease = cubicBezier(0, 0, 0, 0);

const PanelScrollContext = createContext<MotionValue<number> | null>(null);

/**
 * The Line scroll panel — matches ProjectCard from awwwards-the-line-studio:
 * enters bottom-right, exits top-left, scrubbed to scroll.
 */
export function LineScrollPanel({
  children,
  className = "",
  zIndex = 10,
}: {
  children: ReactNode;
  className?: string;
  zIndex?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["50vh end", "50vh start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["55vh", "0vh", "10vh", "-30vh"],
    { ease },
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15vw", "0vw", "0vw", "-15vw"],
    { ease },
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15deg", "0deg", "0deg", "-7deg"],
    { ease },
  );

  return (
    <PanelScrollContext.Provider value={scrollYProgress}>
      <section ref={ref} className={`relative ${className}`} style={{ zIndex }}>
        <motion.div
          style={{ x, y, rotate }}
          className="relative flex h-[100svh] flex-col overflow-hidden bg-ink origin-bottom-right lg:origin-[0%_25%]"
        >
          {children}
        </motion.div>
      </section>
    </PanelScrollContext.Provider>
  );
}

/** Inner video parallax — child layer motion from same scroll progress */
export function LineScrollMedia({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollYProgress = useContext(PanelScrollContext);
  if (!scrollYProgress) return <div className={className}>{children}</div>;

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["5vw", "2vw", "0vw", "4vw"],
    { ease },
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["25vh", "16vh", "0vh", "35vh"],
    { ease },
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15deg", "2deg", "0deg", "4deg"],
    { ease },
  );

  return (
    <motion.div
      style={{ x, y, rotate }}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
