"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCountSound, unlockLoaderAudio } from "@/lib/loaderSound";
import { embedVideoSrc, FALLBACK_SHOWREEL } from "@/lib/video";

type Props = {
  onComplete: () => void;
};

const ORBIT_COPY = "PICSODIAN STUDIOS  ·  24 FPS  ·  GATE  ·  SILENCE ON SET  ·  ";
const SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Preloader({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(3);
  const [tc, setTc] = useState("00:00:00:00");
  const [media, setMedia] = useState({
    url: FALLBACK_SHOWREEL,
    poster: "",
  });
  const done = useRef(false);
  const revealed = useRef(false);

  function finish() {
    if (done.current) return;
    done.current = true;
    document.body.style.overflow = "";
    document.documentElement.classList.remove("is-booting");
    onComplete();
  }

  function revealSite() {
    if (revealed.current) return;
    revealed.current = true;
    onComplete();
  }

  useEffect(() => {
    document.documentElement.classList.add("is-booting");
    document.body.style.overflow = "hidden";

    fetch("/api/studio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { showreelUrl?: string; showreelPoster?: string }) => {
        if (data.showreelUrl) {
          setMedia({
            url: data.showreelUrl,
            poster: data.showreelPoster ?? "",
          });
        }
      })
      .catch(() => {});

    const hold = 1000;
    const timers = [
      window.setTimeout(() => setStarted(true), hold),
      window.setTimeout(() => setCount(2), hold + 1100),
      window.setTimeout(() => setCount(1), hold + 2200),
      window.setTimeout(() => setCount(0), hold + 3300),
      window.setTimeout(revealSite, hold + 3900),
      window.setTimeout(() => setVisible(false), hold + 4300),
    ];

    let frames = 0;
    const clock = window.setInterval(() => {
      frames += 1;
      const ff = frames % 24;
      const ss = Math.floor(frames / 24) % 60;
      const mm = Math.floor(frames / 24 / 60) % 60;
      const hh = Math.floor(frames / 24 / 60 / 60);
      const pad = (n: number) => String(n).padStart(2, "0");
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
    }, 1000 / 24);

    const unlock = () => unlockLoaderAudio();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(clock);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    playCountSound(count === 0 ? "go" : "tick");
  }, [count, started]);

  const label = !started ? null : count === 0 ? "GO" : String(count);

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.15, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <LoaderVideo src={media.url} poster={media.poster} />
          <LoaderBackdrop count={started ? count : -1} timecode={tc} />

          <div className="relative z-20 flex flex-col items-center gap-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: SMOOTH }}
              className="micro text-mist"
            >
              Picsodian / Gate
            </motion.p>

            <div className="relative grid h-[22vw] w-[min(72vw,22rem)] place-items-center md:h-48">
              <AnimatePresence>
                {label ? (
                  <motion.p
                    key={label}
                    initial={{ opacity: 0, y: 36, filter: "blur(10px)", scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, y: -32, filter: "blur(10px)", scale: 1.04 }}
                    transition={{ duration: 0.75, ease: SMOOTH }}
                    className="loader-num display-huge absolute inset-0 grid place-items-center text-[22vw] text-signal md:text-[12rem]"
                  >
                    {label}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={!started ? "hold" : count === 0 ? "action" : "count"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: SMOOTH }}
                className="micro text-paper/70"
              >
                {!started
                  ? "Stand by"
                  : count === 0
                    ? "Action"
                    : "24 fps · silence on set"}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function LoaderVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const embed = embedVideoSrc(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const kick = () => {
      if (cancelled) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const play = video.play();
      if (play) play.then(() => setLive(true)).catch(() => {});
    };

    const onReady = () => {
      setLive(true);
      kick();
    };

    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onReady);
    kick();

    return () => {
      cancelled = true;
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onReady);
      video.pause();
    };
  }, [src]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {embed ? (
        <iframe
          key={src}
          src={embed}
          title="Loader showreel"
          className="loader-video pointer-events-none absolute inset-0 h-full w-full scale-110 border-0"
          allow="autoplay; muted"
        />
      ) : (
        <video
          key={src}
          ref={videoRef}
          className="loader-video"
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          data-ready={live ? "1" : "0"}
        />
      )}
      <div className="loader-video-veil" />
    </div>
  );
}

function LoaderBackdrop({ count, timecode }: { count: number; timecode: string }) {
  const dust = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 41) % 100}%`,
        top: `${(i * 27 + 8) % 90}%`,
        size: 1 + (i % 3),
        delay: (i % 9) * 0.35,
        duration: 5.5 + (i % 6) * 0.8,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      <div className="loader-beam" />
      <div className="loader-reel" />
      <div className="loader-glow" />

      <motion.div
        key={`leader-${count}`}
        className="loader-leader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <svg className="loader-orbit" viewBox="0 0 400 400">
        <defs>
          <path
            id="ps-orbit"
            d="M200,200 m-148,0 a148,148 0 1,1 296,0 a148,148 0 1,1 -296,0"
          />
        </defs>
        <text className="loader-orbit-text">
          <textPath href="#ps-orbit">{ORBIT_COPY.repeat(2)}</textPath>
        </text>
      </svg>

      {dust.map((speck, i) => (
        <span
          key={i}
          className="loader-dust"
          style={{
            left: speck.left,
            top: speck.top,
            width: speck.size,
            height: speck.size,
            animationDelay: `${speck.delay}s`,
            animationDuration: `${speck.duration}s`,
          }}
        />
      ))}

      <div className="loader-flare" />
      {count === 0 ? <div className="loader-go-burst" /> : null}

      <div className="loader-grain" />
      <div className="loader-flicker" />

      <span className="finder finder-tl" />
      <span className="finder finder-tr" />
      <span className="finder finder-bl" />
      <span className="finder finder-br" />

      <p className="loader-tc">{timecode}</p>
      <p className="loader-rec">Rolling</p>
    </div>
  );
}
