"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  videoUrl: string;
  poster: string;
  tagline: string;
};

function embedSrc(url: string) {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (yt?.[1]) {
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&rel=0&playsinline=1`;
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`;
  }
  return null;
}

export function ShowreelHero({ videoUrl, poster, tagline }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      wrap.style.setProperty("--mx", `${x * 18}px`);
      wrap.style.setProperty("--my", `${y * 12}px`);
    };

    wrap.addEventListener("mousemove", onMove);
    return () => wrap.removeEventListener("mousemove", onMove);
  }, []);

  const embed = embedSrc(videoUrl);

  return (
    <section
      ref={wrapRef}
      className="relative h-[100svh] overflow-hidden bg-ink"
      data-cursor="Scrub"
    >
      {embed ? (
        <iframe
          src={embed}
          title="Picsodian showreel"
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70"
          style={{ transform: "translate3d(var(--mx, 0), var(--my, 0), 0) scale(1.12)" }}
          src={videoUrl}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 sprockets md:w-7" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 sprockets md:w-7" />

      <div className="relative z-10 flex h-full flex-col justify-between px-4 pt-24 pb-8 md:px-7 md:pt-28">
        <p className="micro max-w-sm text-paper/70">{tagline}</p>

        <div>
          <p className="micro mb-4 text-signal">Showreel / 2026</p>
          <h1 className="display-huge text-[16vw] md:text-[11vw]">
            Picsodian
            <span className="block text-signal">Studios</span>
          </h1>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="micro text-paper/70">
            Scroll
            <span className="mt-2 block h-10 w-px bg-signal" />
          </p>
          {!embed ? (
            <button
              type="button"
              data-cursor="Audio"
              onClick={() => {
                setMuted((m) => !m);
                if (videoRef.current) videoRef.current.muted = !muted;
              }}
              className="flex items-center gap-2 border border-paper/30 px-3 py-2 text-paper"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="micro">{muted ? "Sound off" : "Sound on"}</span>
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  );
}
