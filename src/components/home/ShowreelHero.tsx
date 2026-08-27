"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { PlayPauseControl } from "@/components/ui/PlayPauseControl";
import {
  SHOWREEL_EVENT,
  SHOWREEL_STORAGE_KEY,
  applyShowreel,
  type ShowreelPayload,
} from "@/lib/showreel";

type Props = {
  videoUrl: string;
  poster: string;
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

export function ShowreelHero({ videoUrl, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [src, setSrc] = useState(videoUrl);
  const [cover, setCover] = useState(poster);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    setSrc(videoUrl);
    setCover(poster);
  }, [videoUrl, poster]);

  useEffect(() => {
    setMuted(true);
  }, [src]);

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
    setSrc(videoUrl);
    setCover(poster);
  }, [videoUrl, poster]);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch("/api/studio", { cache: "no-store" })
        .then((res) => res.json())
        .then((data: ShowreelPayload) => {
          if (cancelled) return;
          applyShowreel(data, setSrc, setCover);
        })
        .catch(() => {});
    };

    load();

    const onCustom = (event: Event) => {
      applyShowreel((event as CustomEvent<ShowreelPayload>).detail, setSrc, setCover);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== SHOWREEL_STORAGE_KEY || !event.newValue) return;
      try {
        applyShowreel(JSON.parse(event.newValue) as ShowreelPayload, setSrc, setCover);
      } catch {
        load();
      }
    };

    window.addEventListener(SHOWREEL_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      window.removeEventListener(SHOWREEL_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", load);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || booting) return;
    video.load();
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src, booting]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [src]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const play = () => {
      gsap.fromTo(
        wrap.querySelectorAll("[data-hero]"),
        { y: "115%" },
        {
          y: "0%",
          stagger: 0.1,
          duration: 1.05,
          ease: "power3.out",
        },
      );
    };

    gsap.set(wrap.querySelectorAll("[data-hero]"), { y: "115%" });

    if (!document.documentElement.classList.contains("is-booting")) {
      play();
      return;
    }

    const obs = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("is-booting")) {
        play();
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

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  };

  const embed = embedSrc(src);

  return (
    <section ref={wrapRef} className="relative h-full overflow-hidden bg-ink">
      {embed ? (
        <iframe
          key={src}
          src={embed}
          title="Picsodian showreel"
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <video
          key={src}
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70"
          style={{ transform: "translate3d(var(--mx, 0), var(--my, 0), 0) scale(1.12)" }}
          src={src}
          poster={cover}
          autoPlay={!booting}
          muted={muted}
          loop
          playsInline
          preload={booting ? "none" : "auto"}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/15 to-ink/90" />

      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 pt-24 md:px-7 md:pb-12 md:pt-28">
        <div className="flex w-full items-end justify-between gap-4">
          <div className="w-1/2 shrink-0 overflow-hidden">
            <div data-hero className="overflow-hidden">
              <Image
                src="/logo-white.png"
                alt="Picsodian Studios"
                width={1200}
                height={280}
                priority
                className="h-auto w-full object-contain object-left mix-blend-screen"
              />
            </div>
          </div>

          {!embed && (
            <PlayPauseControl
              playing={playing}
              muted={muted}
              onToggle={togglePlayback}
              onMuteToggle={toggleMute}
            />
          )}
        </div>
      </div>
    </section>
  );
}
