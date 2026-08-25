"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  playing: boolean;
  onToggle: () => void;
};

const CORNERS = ["tl", "tr", "bl", "br"] as const;

/** Pre-rounded so SSR and the browser emit identical style strings. */
const RING_DOTS = [
  { left: "50.00%", top: "2.00%" },
  { left: "74.00%", top: "8.43%" },
  { left: "91.57%", top: "26.00%" },
  { left: "98.00%", top: "50.00%" },
  { left: "91.57%", top: "74.00%" },
  { left: "74.00%", top: "91.57%" },
  { left: "50.00%", top: "98.00%" },
  { left: "26.00%", top: "91.57%" },
  { left: "8.43%", top: "74.00%" },
  { left: "2.00%", top: "50.00%" },
  { left: "8.43%", top: "26.00%" },
  { left: "26.00%", top: "8.43%" },
] as const;

/** Minimal HUD play/pause — hex, reticle, glow pulse, energy bar */
export function PlayPauseControl({ playing, onToggle }: Props) {
  return (
    <button
      type="button"
      data-cursor="Play"
      data-no-magnet
      onClick={onToggle}
      aria-label={playing ? "Pause" : "Play"}
      className="group relative flex flex-col items-center gap-2 outline-none"
    >
      <div className="relative h-[4.75rem] w-[4.75rem] md:h-[5.25rem] md:w-[5.25rem]">
        {/* Soft ambient glow */}
        <motion.span
          className="pointer-events-none absolute inset-2 rounded-full bg-paper/30 blur-xl"
          animate={{
            scale: playing ? [1, 1.35, 1] : [0.9, 1.05, 0.9],
            opacity: playing ? [0.35, 0.6, 0.35] : 0.2,
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dotted ring — slow spin while playing */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          animate={{ rotate: playing ? 360 : 0 }}
          transition={
            playing
              ? { duration: 8, repeat: Infinity, ease: "linear" }
              : { duration: 0.4 }
          }
        >
          <span className="absolute inset-0 rounded-full border border-paper/35" />
          {RING_DOTS.map((dot, i) => (
            <span
              key={i}
              className="absolute h-[3px] w-[3px] rounded-full bg-paper/70"
              style={{
                left: dot.left,
                top: dot.top,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 4px #F2F0F0",
              }}
            />
          ))}
        </motion.span>

        {/* Corner brackets */}
        {CORNERS.map((c) => (
          <span
            key={c}
            className={`pointer-events-none absolute h-3 w-3 border-paper/80 transition-opacity duration-300 group-hover:opacity-100 ${
              c === "tl"
                ? "top-0 left-0 border-t border-l"
                : c === "tr"
                  ? "top-0 right-0 border-t border-r"
                  : c === "bl"
                    ? "bottom-0 left-0 border-b border-l"
                    : "bottom-0 right-0 border-b border-r"
            } ${playing ? "opacity-90" : "opacity-60"}`}
          />
        ))}

        {/* Hex core */}
        <motion.span
          className="absolute inset-[0.55rem] flex flex-col items-center justify-center gap-1 bg-ink/95 md:inset-2"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
          animate={
            playing
              ? {
                  boxShadow: [
                    "0 0 10px rgba(242,240,240,0.25)",
                    "0 0 22px rgba(242,240,240,0.45)",
                    "0 0 10px rgba(242,240,240,0.25)",
                  ],
                }
              : { boxShadow: "0 0 8px rgba(242,240,240,0.15)" }
          }
          transition={{ duration: 1.8, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span
                key="pause-icon"
                className="flex items-center gap-[5px]"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <span className="h-3.5 w-[3px] rounded-full bg-paper shadow-[0_0_8px_#F2F0F0]" />
                <span className="h-3.5 w-[3px] rounded-full bg-paper shadow-[0_0_8px_#F2F0F0]" />
              </motion.span>
            ) : (
              <motion.span
                key="play-icon"
                className="ml-0.5"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.15 }}
              >
                <span className="block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-paper drop-shadow-[0_0_8px_#F2F0F0]" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Glowing underline inside hex */}
          <motion.span
            className="h-px w-5 rounded-full bg-gradient-to-r from-transparent via-paper to-transparent"
            animate={{
              opacity: playing ? [0.5, 1, 0.5] : 0.35,
              scaleX: playing ? [0.8, 1.1, 0.8] : 0.7,
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.span>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? "pause" : "start"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="font-display text-[10px] tracking-[0.32em] text-paper uppercase md:text-[11px]"
          style={{ textShadow: "0 0 12px rgba(242,240,240,0.6)" }}
        >
          {playing ? "Pause" : "Start"}
        </motion.span>
      </AnimatePresence>

      {/* Energy bar */}
      <div className="w-[4.25rem] md:w-[4.75rem]">
        <div className="flex justify-between px-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-px bg-paper/50 ${playing ? "opacity-80" : "opacity-35"}`}
            />
          ))}
        </div>
        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-paper/15">
          <motion.div
            className="h-full rounded-full bg-paper"
            animate={{
              width: playing ? ["20%", "100%", "20%"] : "20%",
              opacity: playing ? 1 : 0.4,
            }}
            transition={
              playing
                ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.25 }
            }
          />
        </div>
      </div>
    </button>
  );
}
