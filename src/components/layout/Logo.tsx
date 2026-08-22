import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "default" | "white" | "header";

const SOURCES: Record<
  LogoVariant,
  { src: string; width: number; height: number; blend?: boolean }
> = {
  default: { src: "/logo.png", width: 150, height: 150 },
  white: { src: "/logo-white.png", width: 1200, height: 280, blend: true },
  header: { src: "/header-logo.png", width: 320, height: 480, blend: true },
};

export function Logo({
  compact = false,
  invert = false,
  variant = "default",
  /** @deprecated use variant="white" */
  white = false,
  className,
}: {
  compact?: boolean;
  invert?: boolean;
  variant?: LogoVariant;
  white?: boolean;
  className?: string;
}) {
  const resolved = white && variant === "default" ? "white" : variant;
  const { src, width, height, blend } = SOURCES[resolved];

  return (
    <Image
      src={src}
      alt="Picsodian Studios"
      width={width}
      height={height}
      priority
      className={cn(
        "w-auto object-contain",
        compact ? "h-8" : "h-11 md:h-12",
        blend && "mix-blend-screen",
        invert && "brightness-0",
        className,
      )}
    />
  );
}
