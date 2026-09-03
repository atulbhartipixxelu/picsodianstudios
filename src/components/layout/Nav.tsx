"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/nav-links";
import { Logo } from "./Logo";

function surfaceIsLight(node: Element | null, pathname: string) {
  if (document.documentElement.classList.contains("is-filters-lock")) {
    return false;
  }

  if (!node) {
    return pathname === "/work" || pathname === "/contact";
  }

  const ink = node.closest(
    '[data-nav-surface="ink"], [data-cursor-surface="ink"]',
  );
  if (ink) return false;

  const paper = node.closest(
    '[data-nav-surface="paper"], [data-cursor-surface="paper"], .bg-paper, .studio-block',
  );
  if (paper) return true;

  return pathname === "/work" || pathname === "/contact";
}

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isLightNav, setIsLightNav] = useState(
    () => pathname === "/work" || pathname === "/contact",
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      NAV_LINKS.forEach((link) => router.prefetch(link.href));
    }, 120);
    return () => window.clearTimeout(id);
  }, [router]);

  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 24), 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setOpen(false);
    setScrolled(false);
    setIsLightNav(pathname === "/work" || pathname === "/contact");
  }, [pathname]);

  useEffect(() => {
    function readScroll(y?: number) {
      const value =
        typeof y === "number"
          ? y
          : window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(value > 24);
    }

    function readSurface() {
      const nav = headerRef.current;
      if (!nav) return;

      const prev = nav.style.pointerEvents;
      nav.style.pointerEvents = "none";
      const y = Math.min(
        Math.max(nav.getBoundingClientRect().bottom + 6, 8),
        window.innerHeight - 2,
      );
      const el = document.elementFromPoint(window.innerWidth / 2, y);
      nav.style.pointerEvents = prev;

      setIsLightNav(surfaceIsLight(el, pathname));
    }

    function onFrame(y?: number) {
      readScroll(y);
      readSurface();
    }

    function onWindowScroll() {
      onFrame();
    }

    onFrame(lenis?.scroll);
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", onWindowScroll);

    const mo = new MutationObserver(readSurface);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (!lenis) {
      return () => {
        window.removeEventListener("scroll", onWindowScroll);
        window.removeEventListener("resize", onWindowScroll);
        mo.disconnect();
      };
    }

    const onLenis = (e: { scroll: number }) => onFrame(e.scroll);
    lenis.on("scroll", onLenis);
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", onWindowScroll);
      mo.disconnect();
      lenis.off("scroll", onLenis);
    };
  }, [lenis, pathname]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("is-nav-open", open);
    html.classList.toggle("is-nav-light", isLightNav && !open);
    html.classList.toggle("is-nav-scrolled", scrolled);
    if (open) {
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else if (!html.classList.contains("is-filters-lock")) {
      html.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      html.classList.remove("is-nav-open");
      html.classList.remove("is-nav-light");
      html.classList.remove("is-nav-scrolled");
      if (!html.classList.contains("is-filters-lock")) {
        html.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
  }, [open, isLightNav, scrolled]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "site-nav pointer-events-auto z-[90]",
        scrolled && "is-scrolled",
        isLightNav && "is-light",
        open && "is-open",
      )}
    >
      <div
        className={cn(
          "site-nav__bar flex items-center justify-between gap-4 px-4 md:px-7",
          scrolled ? "py-0" : "py-3 md:py-3.5",
        )}
      >
        <Link
          href="/"
          data-cursor="Home"
          className="site-nav__brand relative z-[91]"
        >
          <span
            className={cn(
              "site-nav__logo site-nav__logo--primary",
              scrolled && "is-hidden",
            )}
            aria-hidden={scrolled}
          >
            <Logo
              variant="header"
              className={cn(
                "h-12 md:h-14 lg:h-16",
                isLightNav && "!mix-blend-normal brightness-0",
              )}
            />
          </span>
          <span
            className={cn(
              "site-nav__logo site-nav__logo--sticky",
              scrolled ? "is-on" : "is-hidden",
            )}
            aria-hidden={!scrolled}
          >
            <Logo
              variant="sticky"
              priority={false}
              className={cn(
                "site-nav__sticky-img h-9 w-auto !mix-blend-normal md:h-10",
                isLightNav ? "brightness-0" : "brightness-0 invert",
              )}
            />
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="relative z-[91] hidden items-center gap-0 lg:flex">
            {NAV_LINKS.map((link, i) => {
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
                      "px-2.5 py-2 text-[13px] tracking-[0.16em] uppercase transition-colors duration-300 md:text-[14px]",
                      isLightNav
                        ? active
                          ? "text-ink"
                          : "text-ink/70 hover:text-blue"
                        : active
                          ? "text-paper"
                          : "text-paper/80 hover:text-blue",
                    )}
                  >
                    {link.label}
                  </Link>
                  {i < NAV_LINKS.length - 1 && (
                    <span
                      className={cn(
                        "pointer-events-none transition-colors duration-300",
                        isLightNav ? "text-ink/35" : "text-paper/40",
                      )}
                    >
                      /
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
          <p
            className={cn(
              "nav-fps micro hidden transition-colors duration-300 sm:block",
              isLightNav ? "text-ink/90" : "text-paper/90",
            )}
          >
            {String(frame).padStart(2, "0")}
            <span className={isLightNav ? "text-ink/45" : "text-mist"}>
              /24 fps
            </span>
          </p>
          <button
            type="button"
            className={cn(
              "relative z-[91] micro transition-colors duration-300 lg:hidden",
              isLightNav ? "text-ink" : "text-paper",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-4 py-8 lg:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
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
