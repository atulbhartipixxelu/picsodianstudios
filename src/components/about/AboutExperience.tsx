"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/ui/SafeImage";
import { STUDIO_EMAIL } from "@/lib/studio-contact";
import { FALLBACK_SHOWREEL, isDirectVideo } from "@/lib/video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VALUES = [
  {
    title: ["Together", "for the best"],
    copy: "We’ve got each other’s backs — and our audience’s too.",
  },
  {
    title: ["Feel it,", "live it"],
    copy: "We don’t just perform. We connect.",
  },
  {
    title: ["Chase the next", "planet"],
    copy: "Taking risks is in our DNA.",
  },
  {
    title: ["Cherish", "creativity"],
    copy: "Stuck in the same groove? Not our style.",
  },
];

type Props = {
  paragraphs: string[];
  stills?: string[];
  showreelUrl?: string;
  showreelPoster?: string;
};

export function AboutExperience({
  paragraphs,
  stills = [],
  showreelUrl,
  showreelPoster,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  const reelSrc =
    showreelUrl && isDirectVideo(showreelUrl) ? showreelUrl : FALLBACK_SHOWREEL;
  const poster = showreelPoster || stills[0] || "/contact-banner.jpg";
  const frames = (
    stills.length >= 4
      ? stills
      : [
          ...stills,
          "/contact-col-people.jpg",
          "/contact-col-reach.jpg",
          "/contact-col-social.jpg",
          "/home-close-bg.jpg",
          "/highlights-city.jpg",
          "/contact-banner.jpg",
        ]
  ).slice(0, 6);
  const diveArt = frames[1] || "/contact-col-people.jpg";

  const story =
    paragraphs.length > 0
      ? paragraphs
      : [
          "We aim to create mind-blowing entertainment that flips the script, defies expectations, and ignites the pulse of pop culture. We love pushing boundaries to stories that stick with you — the kind you can’t help but share.",
          "Our style breaks the mold with a bold mix of artistry and tech. Motion, film, and painted worlds create impactful scenes with depth. Rooted in craft, we’ve shaped a visual identity built to win hearts.",
        ];

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(el.querySelectorAll("[data-hero-line]"), {
        yPercent: 115,
        duration: 1.05,
        stagger: 0.06,
        ease: "power4.out",
      });

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.07,
        delay: 0.2,
        ease: "power3.out",
      });

      el.querySelectorAll<HTMLElement>("[data-parallax-x]").forEach((node) => {
        const speed = Number(node.dataset.parallaxX || 0.4);
        gsap.to(node, {
          xPercent: speed * 18,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((node) => {
        gsap.from(node, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });

      el.querySelectorAll<HTMLElement>("[data-fire-cell]").forEach((cell, i) => {
        gsap.from(cell, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: cell, start: "top 90%", once: true },
        });
      });

      const storyBg = el.querySelector<HTMLElement>("[data-story-bg]");
      if (storyBg) {
        gsap.fromTo(
          storyBg,
          { yPercent: -12, scale: 1.18 },
          {
            yPercent: 12,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: "#about-story",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      const philoBg = el.querySelector<HTMLElement>("[data-philo-bg]");
      if (philoBg) {
        gsap.fromTo(
          philoBg,
          { yPercent: -10, scale: 1.16 },
          {
            yPercent: 10,
            scale: 1.04,
            ease: "none",
            scrollTrigger: {
              trigger: "#about-philo",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: root },
  );

  useEffect(() => {
    const section = root.current?.querySelector<HTMLElement>(".fx-reel");
    const video = previewRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reelSrc]);

  return (
    <div ref={root} className="fx-about" data-nav-surface="paper">
      {/* 1. Light identity hero — Fortiche structure */}
      <section className="fx-hero">
        <div className="fx-hero__mark" aria-hidden />
        <div className="fx-hero__row fx-hero__row--top" data-parallax-x="0.35">
          <h1 className="fx-hero__brand">
            <span className="fx-clip">
              <span data-hero-line>Picsodian</span>
            </span>
          </h1>
          <p className="fx-hero__n" data-in>
            [N]
          </p>
          <p className="fx-hero__ipa" data-in>
            /pikˈsoʊ.di.ən/
          </p>
        </div>

        <div className="fx-hero__row fx-hero__row--mid" data-parallax-x="-0.25">
          <h2 className="fx-hero__line">
            <span className="fx-clip">
              <span data-hero-line>
                A <em>creative</em> animation
              </span>
            </span>
          </h2>
          <h2 className="fx-hero__line">
            <span className="fx-clip">
              <span data-hero-line>and production studio</span>
            </span>
          </h2>
        </div>

        <div className="fx-hero__row fx-hero__row--bot" data-parallax-x="0.5">
          <h2 className="fx-hero__line">
            <span className="fx-clip">
              <span data-hero-line>that makes cool</span>
            </span>
          </h2>
          <h2 className="fx-hero__line">
            <span className="fx-clip">
              <span data-hero-line>and memorable content.</span>
            </span>
          </h2>
        </div>
        <div className="fx-hero__frame" aria-hidden />
      </section>

      {/* 2–3. Manifesto + showreel on animated BG */}
      <div className="fx-story" id="about-story" data-nav-surface="ink">
        <div className="fx-story__media" aria-hidden>
          <img
            data-story-bg
            className="fx-story__bg"
            src="/about-touch-bg.jpg"
            alt=""
          />
        </div>
        <div className="fx-story__veil" aria-hidden />

        <section className="fx-touch" id="about-touch">
          <div className="fx-touch__inner" data-in>
            <p className="fx-touch__body">{story[0]}</p>
            <p className="fx-touch__quote">
              No buzzwords, no fluff — just raw, unfiltered creativity that
              speaks for itself.
            </p>
          </div>
        </section>

        <section className="fx-reel">
          <div className="fx-reel__stage">
            <video
              ref={previewRef}
              className="fx-reel__video"
              src={reelSrc}
              poster={poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            />
            <div className="fx-reel__cadre" aria-hidden />
          </div>
        </section>
      </div>

      {/* 4. Philosophy */}
      <section className="fx-philo" id="about-philo" data-nav-surface="ink">
        <div className="fx-story__media" aria-hidden>
          <img
            data-philo-bg
            className="fx-story__bg"
            src="/about-touch-bg.jpg"
            alt=""
          />
        </div>
        <div className="fx-story__veil" aria-hidden />
        <div className="fx-philo__copy" data-rise>
          <p className="fx-touch__body">{story[1] ?? story[0]}</p>
          <p className="fx-touch__quote">
            It&apos;s filmmaking with an edge — built to last.
          </p>
        </div>
      </section>

      {/* 5. What fires us up */}
      <section className="fx-fire" id="about-fire" data-nav-surface="paper">
        <div className="fx-fire__head" data-rise>
          <h2 className="fx-fire__title">
            What fires
            <br />
            us up ?
          </h2>
          <p className="fx-fire__spoiler">
            Spoiler alert — it&apos;s not just coffee!
          </p>
        </div>

        <div className="fx-fire__grid">
          {VALUES.map((item, i) => (
            <article
              key={item.title[0]}
              className="fx-cell"
              data-fire-cell
            >
              <div className="fx-cell__media">
                <SafeImage
                  src={frames[i] || poster}
                  alt=""
                  className="fx-cell__img"
                />
              </div>
              <h3 className="fx-cell__title">
                {item.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className="fx-cell__copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Ready to dive */}
      <section className="fx-dive" data-nav-surface="ink">
        <Link href="/work" className="fx-dive__link" data-cursor="Work" data-rise>
          Ready to dive into it?
        </Link>
        <Link href="/work" className="fx-dive__banner" data-cursor="Work" data-rise>
          <SafeImage src={diveArt} alt="Picsodian work" className="fx-dive__banner-img" />
        </Link>
        <div className="fx-dive__actions" data-rise>
          <Link href="/contact" className="ps-cta ps-cta--paper" data-cursor="Enquire">
            Start a project
          </Link>
          <a
            href={`mailto:${STUDIO_EMAIL}`}
            className="ps-cta ps-cta--paper"
            data-cursor="Mail"
          >
            {STUDIO_EMAIL}
          </a>
        </div>
      </section>
    </div>
  );
}
