"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playCountSound, unlockLoaderAudio } from "@/lib/loaderSound";

type Props = {
  onComplete: () => void;
};

const ORBIT_COPY = "PICSODIAN STUDIOS  ·  24 FPS  ·  GATE  ·  SILENCE ON SET  ·  ";

export function Preloader({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(3);
  const [tc, setTc] = useState("00:00:00:00");
  const done = useRef(false);

  function finish() {
    if (done.current) return;
    done.current = true;
    document.body.style.overflow = "";
    document.documentElement.classList.remove("is-booting");
    onComplete();
  }

  useEffect(() => {
    document.documentElement.classList.add("is-booting");
    document.body.style.overflow = "hidden";

    const timers = [
      window.setTimeout(() => setCount(2), 800),
      window.setTimeout(() => setCount(1), 1600),
      window.setTimeout(() => setCount(0), 2400),
      window.setTimeout(() => setVisible(false), 3400),
      window.setTimeout(finish, 4300),
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
    playCountSound(count === 0 ? "go" : "tick");
  }, [count]);

  const ghost = count === 3 ? null : count === 0 ? "1" : String(count + 1);

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
        >
          <LoaderBackdrop count={count} timecode={tc} />

          <div className="relative z-20 flex flex-col items-center gap-6">
            <p className="micro text-mist">Picsodian / Gate</p>
            <div className="relative">
              {ghost ? (
                <motion.p
                  key={`ghost-${ghost}`}
                  initial={{ opacity: 0.5, scale: 1, x: 0, filter: "blur(0px)" }}
                  animate={{ opacity: 0, scale: 1.45, x: 48, filter: "blur(16px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="display-huge pointer-events-none absolute inset-0 text-center text-[22vw] text-[#4ec8ff]/40 md:text-[12rem]"
                >
                  {ghost}
                </motion.p>
              ) : null}
              <motion.p
                key={count}
                initial={{ opacity: 0, scale: 1.2, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                className="loader-num display-huge text-[22vw] text-signal md:text-[12rem]"
              >
                {count === 0 ? "GO" : count}
              </motion.p>
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

function LoaderBackdrop({ count, timecode }: { count: number; timecode: string }) {
  const dust = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${(i * 41) % 100}%`,
        top: `${(i * 27 + 8) % 90}%`,
        size: 1 + (i % 3),
        delay: (i % 9) * 0.35,
        duration: 5.5 + (i % 6) * 0.8,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="loader-beam" />
      <div className="loader-reel" />
      <div className="loader-glow" />

      <motion.div
        key={`leader-${count}`}
        className="loader-leader"
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 0.35 }}
      />

      <div className="loader-blades">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={`${count}-blade-${i}`}
            className="loader-blade"
            style={{ transformOrigin: "0 0" }}
            initial={{ rotate: i * 45 - 22 }}
            animate={{ rotate: [i * 45 - 22, i * 45 + 10, i * 45 - 14] }}
            transition={{ duration: 0.72, ease: [0.65, 0, 0.2, 1] }}
          />
        ))}
      </div>

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
