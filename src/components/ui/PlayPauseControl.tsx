"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type Props = {
  playing: boolean;
  muted: boolean;
  onToggle: () => void;
  onMuteToggle: () => void;
};

function ControlBtn({
  label,
  cursor,
  onClick,
  children,
}: {
  label: string;
  cursor: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-cursor={cursor}
      data-no-magnet
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1.5 outline-none"
    >
      <motion.span
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="grid h-12 w-12 place-items-center rounded-full border border-paper/45 bg-ink/55 text-paper backdrop-blur-sm md:h-14 md:w-14"
      >
        {children}
      </motion.span>
      <span className="micro text-paper/75">{label}</span>
    </button>
  );
}

const iconMotion = {
  initial: { opacity: 0, scale: 0.75 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.75 },
  transition: { duration: 0.15 },
};

export function PlayPauseControl({
  playing,
  muted,
  onToggle,
  onMuteToggle,
}: Props) {
  return (
    <div className="flex items-end gap-3 md:gap-4">
      <ControlBtn
        label={playing ? "Pause" : "Play"}
        cursor={playing ? "Pause" : "Play"}
        onClick={onToggle}
      >
        <AnimatePresence mode="wait" initial={false}>
          {playing ? (
            <motion.span key="pause" {...iconMotion}>
              <Pause className="h-5 w-5 fill-paper" strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span key="play" className="ml-0.5" {...iconMotion}>
              <Play className="h-5 w-5 fill-paper" strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </ControlBtn>

      <ControlBtn
        label={muted ? "Unmute" : "Mute"}
        cursor={muted ? "Unmute" : "Mute"}
        onClick={onMuteToggle}
      >
        <AnimatePresence mode="wait" initial={false}>
          {muted ? (
            <motion.span key="muted" {...iconMotion}>
              <VolumeX className="h-5 w-5" strokeWidth={1.75} />
            </motion.span>
          ) : (
            <motion.span key="vol" {...iconMotion}>
              <Volume2 className="h-5 w-5" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </ControlBtn>
    </div>
  );
}
