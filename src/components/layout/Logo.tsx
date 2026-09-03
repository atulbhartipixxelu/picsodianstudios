import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "default" | "white" | "header" | "sticky" | "wordmark";

const SOURCES: Record<
  LogoVariant,
  { src: string; width: number; height: number; blend?: boolean }
> = {
  default: { src: "/logo-white.png", width: 150, height: 150 },
  white: { src: "/logo-white.png", width: 1200, height: 280, blend: true },
  header: { src: "/header-logo.png", width: 320, height: 480, blend: true },
  sticky: { src: "/header-logo-sticky-clear.png", width: 640, height: 220 },
  wordmark: { src: "/logo-type.png", width: 924, height: 331 },
};

export function Logo({
  compact = false,
  invert = false,
  variant = "default",
  /** @deprecated use variant="white" */
  white = false,
  className,
  priority = true,
}: {
  compact?: boolean;
  invert?: boolean;
  variant?: LogoVariant;
  white?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const resolved = white && variant === "default" ? "white" : variant;
  const { src, width, height, blend } = SOURCES[resolved];

  return (
    <Image
      src={src}
      alt="Picsodian Studios"
      width={width}
      height={height}
      priority={priority}
      className={cn(
        "w-auto object-contain",
        compact
          ? "h-8"
          : variant === "wordmark" || variant === "sticky"
            ? ""
            : "h-11 md:h-12",
        blend && "mix-blend-screen",
        invert && "brightness-0 invert",
        className,
      )}
    />
  );
}
