"use client";

import { useEffect, useRef } from "react";
import { embedVideoSrc, isDirectVideo } from "@/lib/video";

const FALLBACK =
  "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4";

type Props = {
  src?: string | null;
  poster?: string | null;
  className?: string;
  overlay?: "dark" | "light" | "none";
};

export function ScrollPanelVideo({
  src,
  poster,
  className = "",
  overlay = "dark",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resolved =
    src && isDirectVideo(src) ? src : src ? null : FALLBACK;
  const embed = src ? embedVideoSrc(src) : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || embed) return;
    video.play().catch(() => {});
  }, [embed, resolved]);

  const overlayClass =
    overlay === "dark"
      ? "from-ink/85 via-ink/45 to-ink/75"
      : overlay === "light"
        ? "from-ink/55 via-ink/20 to-ink/50"
        : "";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {embed ? (
        <iframe
          src={embed}
          title=""
          className="pointer-events-none h-full w-full scale-110 border-0 object-cover"
          allow="autoplay; fullscreen"
        />
      ) : (
        <video
          ref={videoRef}
          src={resolved ?? FALLBACK}
          poster={poster ?? undefined}
          className="h-full w-full scale-110 object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {overlay !== "none" && (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${overlayClass}`}
        />
      )}
    </div>
  );
}
