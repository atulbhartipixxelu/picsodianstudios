"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion";
import type { PublicWork } from "@/lib/utils";
import { embedVideoSrc, isDirectVideo } from "@/lib/video";
import { CardFrame } from "@/components/ui/CardFrame";

const ease = cubicBezier(0, 0, 0, 0);
const FALLBACK_VIDEO =
  "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4";

/**
 * HighlightCard — ref on max-h-[25vh] wrapper (exact recreation pattern).
 * Full h-screen panel animates inside compressed scroll trigger.
 */
export function WorkHighlights({ works }: { works: PublicWork[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = String(works.length).padStart(2, "0");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55, 1],
    ["7deg", "0deg", "0deg", "-3deg"],
    { ease },
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55, 1],
    ["-10%", "0%", "0%", "-8%"],
    { ease },
  );
  const y = useTransform(scrollYProgress, [0.55, 1], ["0%", "3%"], { ease });

  return (
    <div ref={ref} className="relative z-20 max-h-[25vh]">
      <motion.div
        style={{ x, y, rotate }}
        className="flex h-screen origin-[0%_0%] flex-col bg-black px-2 pt-2 text-paper lg:origin-[0%_50%] lg:px-[0.46296vw] lg:pt-[0.46296vw]"
      >
        <div className="relative z-10 flex h-full flex-col px-2 pt-24 pb-10 md:px-5">
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-signal">Highlights</p>
          </div>

          <h2 className="display-huge mt-auto text-[16.5vw] md:text-[10vw] lg:text-[9vw]">
            <span className="heading-line">The work [{count}]</span>
            <span className="heading-line text-signal">The studio</span>
          </h2>
        </div>
      </motion.div>
    </div>
  );
}

function CaseMedia({ work }: { work: PublicWork }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = work.videoUrl && isDirectVideo(work.videoUrl) ? work.videoUrl : FALLBACK_VIDEO;
  const embed = work.videoUrl ? embedVideoSrc(work.videoUrl) : null;
  const poster = work.heroImage || work.thumbnail;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || embed) return;
    video.play().catch(() => {});
  }, [embed, src]);

  if (embed) {
    return (
      <iframe
        src={embed}
        title={work.title}
        className="pointer-events-none h-full w-full border-0 object-cover"
        allow="autoplay; fullscreen"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

/**
 * ProjectCard — ref on max-h-[50vh] wrapper (exact recreation pattern).
 * Panel enters bottom-right, exits top-left over sticky bg.
 */
export function HighlightCase({
  work,
  index,
  isLast = false,
}: {
  work: PublicWork;
  index: number;
  total: number;
  isLast?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["50vh end", "50vh start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["55vh", "0vh", "10vh", isLast ? "-110vh" : "-30vh"],
    { ease },
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15vw", "0vw", "0vw", isLast ? "-8vw" : "-15vw"],
    { ease },
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15deg", "0deg", "0deg", isLast ? "-2deg" : "-7deg"],
    { ease },
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.55, 0.82, 1],
    [1, 1, isLast ? 0.35 : 1, isLast ? 0 : 1],
  );
  const rotateChild = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["15deg", "2deg", "0deg", "4deg"],
    { ease },
  );
  const xChild = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["5vw", "2vw", "0vw", "4vw"],
    { ease },
  );
  const yChild = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["25vh", "16vh", "0vh", "35vh"],
    { ease },
  );

  return (
    <div ref={ref} className="relative z-10 max-h-[50vh]" style={{ zIndex: 10 + index }}>
      <motion.div
        style={{ x, y, rotate, opacity }}
        className="flex h-screen origin-bottom-right flex-col gap-[0.46296vw] bg-black lg:origin-[0%_25%]"
      >
        <div className="flex max-lg:flex-[0.25] max-lg:pb-5 items-end justify-between px-2 lg:px-[0.46296vw] lg:pt-[2.31481vw] lg:pb-[0.46296vw]">
          <h2 className="display-huge max-w-[60%] text-[34px] leading-[0.8] md:text-[5.5vw]">
            {work.title}
          </h2>
          <Link
            href={`/work/${work.slug}`}
            data-cursor="View"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/work/${work.slug}`);
            }}
            className="micro shrink-0 text-signal"
          >
            View project →
          </Link>
        </div>

        <div className="relative max-lg:flex-[0.75] lg:flex-1">
          <CardFrame />
          <motion.div
            style={{ x: xChild, y: yChild, rotate: rotateChild }}
            className="h-full w-full"
          >
            <CaseMedia work={work} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
