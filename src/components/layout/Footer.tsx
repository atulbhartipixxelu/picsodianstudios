"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const SOCIAL_FALLBACK = {
  instagram: "https://www.instagram.com/picsodianstudios",
  twitter: "https://x.com/picsodianstudios",
  vimeo: "https://vimeo.com/picsodianstudios",
};

function hrefOr(value: string, fallback: string) {
  const next = value.trim();
  if (!next) return fallback;
  if (/^https?:\/\//i.test(next)) return next;
  return `https://${next.replace(/^\/+/, "")}`;
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[16px] w-[16px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M18.9 2H22l-6.8 7.8L22.7 22h-6.4l-5-6.6L5.7 22H2.5l7.3-8.3L1.6 2h6.6l4.5 6L18.9 2Zm-1.1 18.1h1.8L6.4 3.8H4.5l13.3 16.3Z" />
    </svg>
  );
}

function VimeoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[16px] w-[16px]" fill="currentColor">
      <path d="M22.2 8.4c-.1 2.3-1.7 5.5-4.8 9.4-3.2 4.1-5.9 6.2-8.1 6.2-1.4 0-2.5-1.3-3.5-3.8L4 13.3C3.2 10.8 2.4 9.6 1.5 9.6c-.2 0-.9.4-2.1 1.2L0 9.2C2.1 7.4 4.2 5.5 5.8 5.4c1.8-.2 2.9 1 3.3 3.5.5 2.7.8 4.4 1 5 .6 2.6 1.2 3.9 1.9 3.9.8 0 2.1-1.3 3.7-4 1.6-2.6 2.5-4.6 2.6-5.9.2-2.1-.6-3.2-2.4-3.2-.8 0-1.7.2-2.6.6 1.7-5.6 5-8.3 9.8-8.1 3.6.2 5.3 2.4 5.1 6.7Z" />
    </svg>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [socials, setSocials] = useState(SOCIAL_FALLBACK);

  useEffect(() => {
    fetch("/api/studio")
      .then((res) => res.json())
      .then((data: { instagram?: string; twitter?: string; vimeo?: string }) => {
        setSocials({
          instagram: hrefOr(data.instagram ?? "", SOCIAL_FALLBACK.instagram),
          twitter: hrefOr(data.twitter ?? "", SOCIAL_FALLBACK.twitter),
          vimeo: hrefOr(data.vimeo ?? "", SOCIAL_FALLBACK.vimeo),
        });
      })
      .catch(() => {});
  }, []);

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

        <div className="grid items-start gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <Link
            href="/contact"
            data-cursor="Enquire"
            className="group sm:col-span-2 lg:col-span-6"
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

          <div className="foot-dir-block lg:col-span-3">
            <p className="foot-dir-title">Quick links</p>
            <ul>
              {LINKS.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor={link.label}
                    data-no-magnet
                    className="foot-dir-row"
                  >
                    <span className="foot-dir-idx">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="foot-dir-name">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-dir-block lg:col-span-3">
            <p className="foot-dir-title">Social</p>
            <ul>
              {(
                [
                  {
                    href: socials.instagram,
                    label: "Instagram",
                    icon: <InstagramIcon />,
                  },
                  { href: socials.twitter, label: "X", icon: <XIcon /> },
                  { href: socials.vimeo, label: "Vimeo", icon: <VimeoIcon /> },
                ] as const
              ).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor={item.label}
                    data-no-magnet
                    className="foot-dir-row"
                  >
                    <span className="foot-dir-ico">{item.icon}</span>
                    <span className="foot-dir-name">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
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

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              data-cursor="Home"
              className="inline-block transition-transform duration-300 hover:scale-105"
            >
              <Logo variant="wordmark" className="h-16 w-auto md:h-20" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/80">
              Creative visual studio. Motion, film, character, and worlds built
              to hit the screen hard.
            </p>
          </div>
          <div className="micro space-y-2 md:text-right">
            <a
              href="mailto:creatives@picsodianstudios.com"
              data-cursor="Mail"
              className="hover:underline"
            >
              creatives@picsodianstudios.com
            </a>
            <p>
              © {new Date().getFullYear()} Picsodian Studios.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
