"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FALLBACK_BACKDROP,
  FALLBACK_SHOWREEL,
  isDirectVideo,
} from "@/lib/video";

gsap.registerPlugin(useGSAP);

export type SoonKind = "entertainment" | "feed" | "store";

const KICKER: Record<SoonKind, string> = {
  entertainment: "Entertainment",
  feed: "Feed",
  store: "Store",
};

export function ComingSoon({
  kind,
  videoUrl,
}: {
  kind: SoonKind;
  videoUrl?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const src =
    videoUrl && isDirectVideo(videoUrl)
      ? videoUrl
      : FALLBACK_BACKDROP || FALLBACK_SHOWREEL;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.05, ease: "power4.out" },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 16,
        opacity: 0,
        duration: 0.65,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { scope: root },
  );

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
  }, [src]);

  return (
    <section ref={root} className="soon-banner">
      <video
        ref={videoRef}
        className="soon-banner-video"
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
      <div className="soon-banner-veil" aria-hidden />

      <div className="soon-banner-copy">
        <p data-in className="soon-banner-kicker">
          {KICKER[kind]}
        </p>
        <h1 className="soon-banner-title">
          <span className="soon-clip">
            <span data-line>Coming</span>
          </span>
          <span className="soon-clip">
            <span data-line>soon.</span>
          </span>
        </h1>
      </div>
    </section>
  );
}
