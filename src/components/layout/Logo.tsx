import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  compact = false,
  invert = false,
  className,
}: {
  compact?: boolean;
  invert?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Picsodian Studios"
      width={150}
      height={150}
      priority
      className={cn(
        "w-auto object-contain",
        compact ? "h-8" : "h-11 md:h-12",
        invert && "brightness-0",
        className,
      )}
    />
  );
}
