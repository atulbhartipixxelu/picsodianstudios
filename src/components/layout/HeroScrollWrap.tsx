"use client";

import { useRef } from "react";
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion";

const ease = cubicBezier(0, 0, 0, 0);

/** Banner parallax on scroll-out — only applies to the hero banner section */
export function HeroScrollWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"], { ease });
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "-15deg"], { ease });

  return (
    <section ref={ref} className="relative h-[100svh]">
      <motion.div
        style={{ x, rotate }}
        className="absolute inset-0 origin-bottom-left"
      >
        {children}
      </motion.div>
    </section>
  );
}
