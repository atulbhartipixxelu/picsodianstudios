"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "./Logo";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MARQUEE = [
  "Picsodian Studios",
  "Make it cool",
  "24 fps",
  "Motion",
  "Film",
  "Character",
];

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-foot]"),
        { y: "108%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 42%",
            scrub: 0.55,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      data-cursor-surface="paper"
      className="relative z-50 overflow-x-clip overflow-y-visible bg-paper text-ink"
    >
      <div className="px-4 pt-16 pb-6 md:px-7 md:pt-24">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="micro">Next / Make something that stays</p>
          <p className="micro hidden sm:block">Picsodian / 2026</p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Link
            href="/contact"
            data-cursor="Enquire"
            className="group lg:col-span-8"
          >
            <h2 className="display-huge foot-cta">
              <span className="block overflow-x-visible overflow-y-hidden pb-[0.08em] pr-[0.2em]">
                <span
                  data-foot
                  className="block text-[clamp(1.6rem,4.4vw,3.4rem)]"
                >
                  Let&apos;s make it
                </span>
              </span>
              <span className="block overflow-x-visible overflow-y-hidden pb-[0.12em] pr-[0.28em]">
                <span
                  data-foot
                  className="foot-stroke block whitespace-nowrap text-[clamp(2.1rem,7.4vw,7rem)] leading-[0.95]"
                >
                  undeniably
                </span>
              </span>
              <span className="block overflow-x-visible overflow-y-hidden pb-[0.08em] pr-[0.2em]">
                <span
                  data-foot
                  className="relative block text-[clamp(2.3rem,8vw,7.6rem)] leading-[0.9]"
                >
                  cool
                  <span className="inline-block origin-center transition-transform duration-500 group-hover:translate-x-3">
                    .
                  </span>
                </span>
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/75">
              Film, motion, character — if it belongs on a screen, we&apos;ll make
              it hit. Drop us a line.
            </p>
          </Link>

          <div className="relative mx-auto grid h-64 w-64 place-items-center sm:h-80 sm:w-80 lg:col-span-4 lg:h-[22rem] lg:w-[22rem]">
            <span className="absolute inset-12 rounded-full border border-dashed border-ink/25" />
            <svg
              viewBox="0 0 320 320"
              className="absolute inset-0 h-full w-full animate-[ps-orbit_20s_linear_infinite]"
            >
              <defs>
                <path
                  id="footer-orbit"
                  d="M 160,160 m -132,0 a 132,132 0 1,1 264,0 a 132,132 0 1,1 -264,0"
                />
              </defs>
              <circle
                cx="160"
                cy="160"
                r="132"
                fill="none"
                stroke="rgba(51,51,51,0.2)"
                strokeWidth="1"
              />
              <text
                fill="#333333"
                stroke="#F2F0F0"
                strokeWidth="9"
                strokeLinejoin="round"
                paintOrder="stroke fill"
                fontSize="12"
                letterSpacing="6"
              >
                <textPath href="#footer-orbit">
                  START A PROJECT — ENQUIRE NOW — PICSODIAN STUDIOS —
                </textPath>
              </text>
            </svg>
            <Link
              href="/contact"
              data-cursor="Go"
              className="relative z-10 grid h-36 w-36 place-items-center rounded-full bg-ink text-paper shadow-[0_20px_50px_rgba(51,51,51,0.25)] transition-transform duration-500 hover:scale-110 sm:h-44 sm:w-44"
            >
              <span className="text-center">
                <span className="font-display block text-2xl tracking-[1.5px] uppercase sm:text-3xl">
                  Go
                </span>
                <span className="micro mt-1 block">Enquire now</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-16 overflow-hidden border-y border-ink/20 py-4">
          <div className="animate-marquee flex w-max gap-10">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={item + i}
                className="display-huge flex items-center gap-10 text-4xl md:text-6xl"
              >
                {item}
                <span className="h-2.5 w-2.5 bg-ink" />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <Link
              href="/"
              data-cursor="Home"
              className="inline-block transition-transform duration-300 hover:scale-105"
            >
              <Logo className="h-14 md:h-16 brightness-0" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/80">
              Creative visual studio. Motion, film, character, and worlds built
              to hit the screen hard.
            </p>
          </div>
          <div className="micro space-y-4">
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {LINKS.map((link, i) => (
                <span key={link.href} className="flex items-center gap-3">
                  <Link
                    href={link.href}
                    data-cursor={link.label}
                    className="relative after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {link.label}
                  </Link>
                  {i < LINKS.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
            <p>
              <a
                href="mailto:creatives@picsodianstudios.com"
                data-cursor="Mail"
                className="hover:underline"
              >
                creatives@picsodianstudios.com
              </a>
            </p>
          </div>
          <p className="micro md:text-right">
            © {new Date().getFullYear()} Picsodian Studios.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
