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
  const done = useRef(false);
  const tcRef = useRef<HTMLParagraphElement>(null);

  function finish() {
    if (done.current) return;
    done.current = true;
    document.body.style.overflow = "";
    document.documentElement.classList.remove("is-booting");
    onComplete();
  }

  useLayoutEffect(() => {
    document.documentElement.classList.add("is-booting");
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    const pauseOthers = () => {
      if (done.current) return;
      document.querySelectorAll("video").forEach((node) => {
        if (node.classList.contains("loader-video")) return;
        node.pause();
        node.preload = "none";
      });
    };
    pauseOthers();
    const id = window.setInterval(() => {
      if (done.current) {
        window.clearInterval(id);
        return;
      }
      pauseOthers();
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timers: number[] = [];
    let raf = 0;

    const fontReady = document.fonts.check('80px "BrunsonRough"')
      ? Promise.resolve()
      : document.fonts.load('80px "BrunsonRough"');

    Promise.race([
      fontReady,
      new Promise<void>((resolve) => window.setTimeout(resolve, 400)),
    ]).then(() => {
      if (cancelled) return;
      setArmed(true);
      timers = [
        window.setTimeout(() => setCount(2), BEAT),
        window.setTimeout(() => setCount(1), BEAT * 2),
        window.setTimeout(() => setCount(0), BEAT * 3),
        window.setTimeout(() => setVisible(false), BEAT * 3 + 720),
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
      if (tcRef.current) {
        tcRef.current.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
      }
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
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <LoaderVideo />
          <LoaderBackdrop count={count} timecodeRef={tcRef} />

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
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 1.02 }}
                    transition={{ duration: 0.28, ease: SMOOTH }}
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

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    const kick = () => {
      void video.play().catch(() => {});
    };

    video.addEventListener("canplay", kick);
    kick();

    return () => {
      video.removeEventListener("canplay", kick);
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
        disablePictureInPicture
      />
      <div className="loader-video-veil" />
    </div>
  );
}

function LoaderBackdrop({
  count,
  timecodeRef,
}: {
  count: number;
  timecodeRef: React.RefObject<HTMLParagraphElement | null>;
}) {
  const dust = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
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
      <div className="loader-glow" />

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

      {count === 0 ? <div className="loader-go-burst" /> : null}

      <p ref={timecodeRef} className="loader-tc">
        00:00:00:00
      </p>
      <p className="loader-rec">Rolling</p>
    </div>
  );
}
