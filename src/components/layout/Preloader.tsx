"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCountSound, unlockLoaderAudio } from "@/lib/loaderSound";
import { FALLBACK_SHOWREEL } from "@/lib/video";

type Props = {
  onComplete: () => void;
};

const ORBIT_COPY = "PICSODIAN STUDIOS  ·  24 FPS  ·  GATE  ·  SILENCE ON SET  ·  ";
const SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BEAT = 900;

export function Preloader({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [armed, setArmed] = useState(false);
  const [count, setCount] = useState(3);
  const [tc, setTc] = useState("00:00:00:00");
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

  useLayoutEffect(() => {
    document.documentElement.classList.add("is-booting");
    document.body.style.overflow = "hidden";
    void document.fonts.load('80px "BrunsonRough"');
    void document.fonts.load('16px "BrunsonRegular"');
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timers: number[] = [];
    let raf = 0;

    const arm = () => {
      if (cancelled) return;
      setArmed(true);
    };

    const fontReady = document.fonts.check('80px "BrunsonRough"')
      ? Promise.resolve()
      : document.fonts.load('80px "BrunsonRough"');

    const wait = Promise.race([
      fontReady,
      new Promise<void>((resolve) => window.setTimeout(resolve, 700)),
    ]);

    wait.then(() => {
      if (cancelled) return;
      arm();
      timers = [
        window.setTimeout(() => setCount(2), BEAT),
        window.setTimeout(() => setCount(1), BEAT * 2),
        window.setTimeout(() => setCount(0), BEAT * 3),
        window.setTimeout(revealSite, BEAT * 3 + 520),
        window.setTimeout(() => setVisible(false), BEAT * 3 + 880),
      ];
    });

    const origin = performance.now();
    const tick = (now: number) => {
      const frames = Math.floor(((now - origin) / 1000) * 24);
      const ff = frames % 24;
      const ss = Math.floor(frames / 24) % 60;
      const mm = Math.floor(frames / 24 / 60) % 60;
      const hh = Math.floor(frames / 24 / 60 / 60);
      const pad = (n: number) => String(n).padStart(2, "0");
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const unlock = () => unlockLoaderAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!armed) return;
    playCountSound(count === 0 ? "go" : "tick");
  }, [count, armed]);

  const label = count === 0 ? "GO" : String(count);

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <LoaderVideo />
          <LoaderBackdrop count={count} timecode={tc} />

          <div className="relative z-20 flex flex-col items-center gap-6">
            <p className="micro text-mist">Picsodian / Gate</p>

            <div className="relative grid h-[22vw] w-[min(72vw,22rem)] place-items-center md:h-48">
              <span
                aria-hidden
                className="pointer-events-none absolute h-0 w-0 overflow-hidden font-display"
              >
                321GO
              </span>
              <AnimatePresence initial={false}>
                {armed ? (
                <motion.p
                  key={label}
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)", scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -26, filter: "blur(8px)", scale: 1.03 }}
                  transition={{ duration: 0.42, ease: SMOOTH }}
                  className="loader-num display-huge absolute inset-0 grid place-items-center text-[22vw] text-signal md:text-[12rem]"
                >
                  {label}
                </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <p className="micro text-paper/70">
              {count === 0 ? "Action" : "24 fps · silence on set"}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function LoaderVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    const mark = () => setLive(true);
    const kick = () => {
      const play = video.play();
      if (play) play.then(mark).catch(() => {});
    };

    video.addEventListener("loadeddata", mark);
    video.addEventListener("canplay", kick);
    video.addEventListener("playing", mark);
    kick();

    return () => {
      video.removeEventListener("loadeddata", mark);
      video.removeEventListener("canplay", kick);
      video.removeEventListener("playing", mark);
      video.pause();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="loader-video"
        src={`${FALLBACK_SHOWREEL}#t=0.001`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        data-ready={live ? "1" : "0"}
      />
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
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
