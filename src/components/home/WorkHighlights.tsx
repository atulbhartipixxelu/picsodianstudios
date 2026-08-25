"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cubicBezier, motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicWork } from "@/lib/utils";
import { embedVideoSrc, isDirectVideo } from "@/lib/video";
import { CardFrame } from "@/components/ui/CardFrame";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger);

const ease = cubicBezier(0, 0, 0, 0);
const FALLBACK_VIDEO =
  "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4";

/**
 * Highlights intro — first slides flush to the top, then the work cards move.
 */
export function WorkHighlights({
  works,
}: {
  works: PublicWork[];
  still?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = String(works.length).padStart(2, "0");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["72vh", "0vh"], { ease });

  return (
    <div ref={ref} className="relative z-20 h-[100svh]">
      <motion.div
        style={{ y }}
        className="relative flex h-screen flex-col overflow-hidden bg-ink text-paper"
      >
        <div className="absolute inset-0">
          <SafeImage
            src="/highlights-city.jpg"
            alt=""
            className="highlights-photo h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-ink/25" />
        </div>

        <div className="relative z-10 flex h-full flex-col px-4 pt-24 pb-10 md:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="crosshair" aria-hidden />
            <p className="micro text-signal">Highlights</p>
          </div>

          <h2 className="highlights-title mt-auto">
            <span>The work [{count}]</span>
            <span>The studio</span>
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
 * Project card — rotates in to a full-screen hold, then the next section takes over.
 */
export function HighlightCase({
  work,
  index,
}: {
  work: PublicWork;
  index: number;
  total?: number;
  isLast?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const face = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = root.current;
    const panel = face.current;
    if (!el || !panel) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(panel, { clearProps: "all" });
        return;
      }

      gsap.set(panel, { transformOrigin: "100% 100%" });
      gsap.fromTo(
        panel,
        { xPercent: 22, yPercent: 28, rotate: 11 },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top top",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        },
      );

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=120%",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("ps:ready", refresh);
    requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("ps:ready", refresh);
      ctx.revert();
    };
  }, [work.id]);

  return (
    <section
      ref={root}
      className="relative h-[100svh]"
      style={{ zIndex: 20 + index }}
    >
      <div
        ref={face}
        className="flex h-full flex-col gap-3 overflow-hidden bg-ink px-4 pt-8 pb-4 text-paper md:gap-4 md:px-7 md:pt-10 md:pb-5"
      >
        <div className="flex items-end justify-between gap-6">
          <h2 className="case-title max-w-[70%]">{work.title}</h2>
          <Link
            href={`/work/${work.slug}`}
            data-cursor="View"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/work/${work.slug}`);
            }}
            className="micro shrink-0 pb-1 text-signal"
          >
            View project →
          </Link>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <CardFrame />
          <div className="absolute inset-0">
            <CaseMedia work={work} />
          </div>
        </div>
      </div>
    </section>
  );
}
