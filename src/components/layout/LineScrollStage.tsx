"use client";

import { useEffect, useRef, useState } from "react";
import { embedVideoSrc, FALLBACK_SHOWREEL, isDirectVideo } from "@/lib/video";

type Props = {
  children: React.ReactNode;
  videoUrl?: string;
  poster?: string;
};

/**
 * Sticky showreel behind the highlight stack.
 * Panels overlay from the first scroll — video stays pinned.
 */
export function LineScrollStage({
  children,
  videoUrl = FALLBACK_SHOWREEL,
  poster = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [booting, setBooting] = useState(true);
  const embed = videoUrl ? embedVideoSrc(videoUrl) : null;
  const src =
    embed
      ? null
      : videoUrl && (isDirectVideo(videoUrl) || videoUrl.startsWith("/"))
        ? videoUrl
        : FALLBACK_SHOWREEL;

  useEffect(() => {
    if (!document.documentElement.classList.contains("is-booting")) {
      setBooting(false);
      return;
    }
    const obs = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("is-booting")) {
        setBooting(false);
        obs.disconnect();
      }
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || booting) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [src, booting]);

  return (
    <div className="relative z-0 isolate max-w-[100vw]">
      <div className="sticky top-0 z-0 h-screen overflow-hidden bg-ink">
        {embed ? (
          <iframe
            src={embed}
            title="Highlights backdrop"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 border-0"
            allow="autoplay; muted"
          />
        ) : (
          <video
            ref={videoRef}
            src={src ?? FALLBACK_SHOWREEL}
            poster={poster || undefined}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay={!booting}
            muted
            loop
            playsInline
            preload={booting ? "none" : "metadata"}
          />
        )}
        <div className="absolute inset-0 bg-ink/45" />
      </div>

      <div className="relative z-10 -mt-[100vh]">{children}</div>
    </div>
  );
}
