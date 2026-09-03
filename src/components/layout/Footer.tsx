"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_LINKS } from "@/lib/nav-links";
import { SOCIAL_FALLBACK, hrefOr } from "@/lib/studio-contact";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE = [
  "Picsodian Studios",
  "Make it cool",
  "24 fps",
  "Motion",
  "Film",
  "Character",
];

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

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
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
      .then(
        (data: {
          instagram?: string;
          twitter?: string;
          linkedin?: string;
          vimeo?: string;
        }) => {
          setSocials({
            instagram: hrefOr(data.instagram ?? "", SOCIAL_FALLBACK.instagram),
            twitter: hrefOr(data.twitter ?? "", SOCIAL_FALLBACK.twitter),
            linkedin: hrefOr(data.linkedin ?? "", SOCIAL_FALLBACK.linkedin),
            vimeo: hrefOr(data.vimeo ?? "", SOCIAL_FALLBACK.vimeo),
          });
        },
      )
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

  const socialItems = [
    {
      href: socials.instagram,
      label: "Instagram",
      icon: <InstagramIcon />,
    },
    { href: socials.twitter, label: "X", icon: <XIcon /> },
    { href: socials.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
    { href: socials.vimeo, label: "Vimeo", icon: <VimeoIcon /> },
  ] as const;

  return (
    <footer
      ref={root}
      data-cursor-surface="paper"
      data-nav-surface="paper"
      className="relative z-50 overflow-x-clip overflow-y-visible bg-paper text-ink"
    >
      <div className="px-4 pt-16 pb-6 md:px-7 md:pt-24">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="micro">Next / Make something that stays</p>
          <p className="micro hidden sm:block">Picsodian / 2026</p>
        </div>

        <Link href="/contact" data-cursor="Enquire" className="group block max-w-4xl">
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

        <div className="foot-bottom">
          <nav className="foot-bottom__links" aria-label="Quick links">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="foot-bottom__item">
                {i > 0 ? <span className="foot-bottom__slash">/</span> : null}
                <Link href={link.href} data-cursor={link.label} data-no-magnet>
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="foot-bottom__copy">
            <a
              href="mailto:creatives@picsodianstudios.com"
              data-cursor="Mail"
              className="foot-bottom__mail"
            >
              creatives@picsodianstudios.com
            </a>
            <p>
              © {new Date().getFullYear()} Picsodian Studios.
              <br />
              All rights reserved.
            </p>
          </div>

          <nav className="foot-bottom__social" aria-label="Social">
            {socialItems.map((item, i) => (
              <span key={item.label} className="foot-bottom__item">
                {i > 0 ? <span className="foot-bottom__slash">/</span> : null}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor={item.label}
                  data-no-magnet
                  className="foot-bottom__social-link"
                >
                  <span className="foot-bottom__ico">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
