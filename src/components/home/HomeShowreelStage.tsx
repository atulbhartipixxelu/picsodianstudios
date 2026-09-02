"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeShowreelStage({
  videoUrl,
  children,
}: {
  videoUrl: string;
  children: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      if (document.documentElement.classList.contains("is-booting")) return;
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener("canplay", play);
    window.addEventListener("ps:ready", play);
    const obs = new MutationObserver(play);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      video.removeEventListener("canplay", play);
      window.removeEventListener("ps:ready", play);
      obs.disconnect();
      video.pause();
    };
  }, [videoUrl]);

  return (
    <div className="home-showreel-stage">
      <div className="home-showreel-pin" aria-hidden>
        <video
          ref={videoRef}
          className="home-showreel-video"
          src={videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="home-showreel-veil" />
      </div>
      <div className="home-showreel-flow">{children}</div>
    </div>
  );
}
