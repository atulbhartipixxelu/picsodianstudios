"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const warm = () => {
      LINKS.forEach((link) => router.prefetch(link.href));
    };
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(warm)
        : window.setTimeout(warm, 120);
    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idle as number);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, [router]);

  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 24), 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "pointer-events-auto z-[90]",
        isHome ? "absolute top-0 right-0 left-0" : "relative",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-7 md:py-3.5">
        <Link
          href="/"
          data-cursor="Home"
          className="relative z-[91] flex items-center gap-3"
        >
          <Logo
            variant="header"
            className={
              isHome
                ? "h-16 md:h-20 lg:h-[5.75rem]"
                : "h-12 md:h-14 lg:h-16"
            }
          />
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <nav className="relative z-[91] hidden items-center gap-1 md:flex">
            {LINKS.map((link, i) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <span key={link.href} className="flex items-center">
                  <Link
                    href={link.href}
                    prefetch
                    data-cursor={link.label}
                    className={cn(
                      "px-3 py-2 text-[13px] tracking-[0.18em] uppercase transition-colors drop-shadow-[0_1px_6px_rgba(51,51,51,0.85)]",
                      active ? "text-paper" : "text-paper/80 hover:text-blue",
                    )}
                  >
                    {link.label}
                  </Link>
                  {i < LINKS.length - 1 && (
                    <span className="pointer-events-none text-paper/40 drop-shadow-[0_1px_6px_rgba(51,51,51,0.85)]">
                      /
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
          <p className="nav-fps micro hidden text-paper/90 drop-shadow-[0_1px_6px_rgba(51,51,51,0.85)] sm:block">
            {String(frame).padStart(2, "0")}
            <span className="text-mist">/24 fps</span>
          </p>
          <button
            type="button"
            className="relative z-[91] micro text-paper drop-shadow-[0_1px_6px_rgba(51,51,51,0.85)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-4 py-8 md:hidden">
          <div className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                data-cursor={link.label}
                className={cn(
                  "display-huge py-2 text-5xl",
                  pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-paper"
                    : "text-paper/70 hover:text-blue",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
