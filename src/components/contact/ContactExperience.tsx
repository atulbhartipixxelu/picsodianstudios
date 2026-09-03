"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SOCIAL_FALLBACK,
  STUDIO_EMAIL,
  STUDIO_LOCATION,
  STUDIO_PHONE,
  STUDIO_PHONE_HREF,
  hrefOr,
} from "@/lib/studio-contact";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  email?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  vimeo?: string;
};

export function ContactExperience({
  email: emailProp,
  instagram,
  twitter,
  linkedin,
  vimeo,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const email = emailProp?.trim() || STUDIO_EMAIL;
  const socials = [
    { href: hrefOr(instagram ?? "", SOCIAL_FALLBACK.instagram), label: "Instagram" },
    { href: hrefOr(twitter ?? "", SOCIAL_FALLBACK.twitter), label: "X" },
    { href: hrefOr(linkedin ?? "", SOCIAL_FALLBACK.linkedin), label: "LinkedIn" },
    { href: hrefOr(vimeo ?? "", SOCIAL_FALLBACK.vimeo), label: "Vimeo" },
  ];
  const mapHref = "https://maps.google.com/?q=Jamshedpur%20India";

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sticky = el.querySelector<HTMLElement>(".contact-hero__sticky");
      const details = el.querySelector<HTMLElement>(".contact-details");
      const bgImg = el.querySelector<HTMLElement>("[data-hero-bg-img]");

      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: reduced ? 0.01 : 1.2,
          stagger: 0.1,
          ease: "power4.out",
          delay: reduced ? 0 : 0.05,
        },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: reduced ? 0 : 28,
        opacity: 0,
        duration: reduced ? 0.01 : 0.9,
        stagger: 0.08,
        delay: reduced ? 0 : 0.28,
        ease: "power3.out",
      });

      if (reduced || !sticky || !details) return;

      const scrub = {
        trigger: details,
        start: "top bottom",
        end: "top top",
        scrub: 0.65,
        invalidateOnRefresh: true,
      } as const;

      if (bgImg) {
        gsap.fromTo(
          bgImg,
          { scale: 1.08, yPercent: 0 },
          { scale: 1, yPercent: -5, ease: "none", scrollTrigger: { ...scrub } },
        );
      }

      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((block) => {
        gsap.from(block, {
          y: 52,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  function scrollPastHero() {
    const details = root.current?.querySelector<HTMLElement>(".contact-details");
    if (!details) return;
    if (lenis) {
      lenis.scrollTo(details, { offset: 0, duration: 1.35 });
      return;
    }
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section ref={root} className="contact-page" data-cursor-surface="paper">
      {/*
        Line structure:
        .contact-hero (100svh)
          .contact-hero__scroller (absolute inset 0 0 -100lvh)
            .contact-hero__sticky (sticky 100svh)
        Then .contact-details slides over while sticky holds.
      */}
      <header className="contact-hero">
        <div className="contact-hero__scroller">
          <div className="contact-hero__sticky">
            <figure
              className="contact-hero__bg"
              aria-hidden
              data-cursor-surface="ink"
            >
              <div data-hero-bg-img className="contact-hero__bg-media">
                <Image
                  src="/contact-banner.jpg"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="contact-hero__img contact-hero__img--bg"
                />
              </div>
              <span className="contact-hero__bg-blue" />
            </figure>

            <div className="contact-hero__wrapper" data-cursor-surface="paper">
              <div className="contact-hero__inner">
                <div className="contact-hero__title-wrap">
                  <p data-in className="contact-hero__kicker">
                    <span>/ </span>Contact us
                  </p>
                  <h1 className="contact-hero__title">
                    <span className="contact-clip">
                      <span data-line>Let&apos;s talk</span>
                    </span>
                  </h1>
                </div>

                <div className="contact-hero__details">
                  <div data-in className="contact-hero__block">
                    <h2 className="contact-hero__label">
                      <em>/</em> General enquiries
                    </h2>
                    <div className="contact-hero__copy">
                      <p>
                        <a href={`mailto:${email}`} data-cursor="Mail">
                          {email}
                        </a>
                      </p>
                      <p>
                        <a href={STUDIO_PHONE_HREF} data-cursor="Call">
                          {STUDIO_PHONE}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div data-in className="contact-hero__block">
                    <h2 className="contact-hero__label">
                      <em>/</em> Address
                    </h2>
                    <div className="contact-hero__address">
                      <a href={mapHref} target="_blank" rel="noreferrer" data-cursor="Map">
                        Picsodian Studios
                      </a>
                      <br />
                      <a href={mapHref} target="_blank" rel="noreferrer" data-cursor="Map">
                        {STUDIO_LOCATION}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="contact-hero__btn"
                    aria-label="Scroll to content"
                    data-cursor="Down"
                    onClick={scrollPastHero}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 79 91"
                      aria-hidden
                    >
                      <path d="m7.233 44.216 32.196 32.52 32.196-32.662L79 51.205 39.43 91 0 51.348zM44.961 0v82.014H33.898V0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="contact-details" aria-labelledby="contact-reach-title">
        <div data-reveal className="contact-details__intro">
          <p className="contact-details__lede">
            If you&apos;re excited to collaborate with Picsodian, feel free to
            get in touch. We&apos;d love to chat about what you&apos;ve got
            cooking. Give us a call or shoot us an email — we&apos;ll be in
            touch as soon as we can.
          </p>
          <h2 id="contact-reach-title" className="contact-section-kicker">
            <span>/ </span>Reach Out
          </h2>
        </div>

        <div className="contact-details__list">
          <article data-reveal className="contact-details__item">
            <figure className="contact-details__fig">
              <Image
                src="/contact-col-people.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="contact-details__img contact-details__img--a"
              />
            </figure>
            <h3 className="contact-section-kicker">
              <span>/ </span>People
            </h3>
            <p className="contact-details__title">Contact</p>
            <div className="contact-list">
              <div>
                <p className="contact-list__sub">Business / Press</p>
                <div className="contact-list__copy">
                  <p>Picsodian Studios</p>
                  <a href={`mailto:${email}`} data-cursor="Mail">
                    {email}
                  </a>
                </div>
              </div>
              <div>
                <p className="contact-list__sub">Phone</p>
                <div className="contact-list__copy">
                  <a href={STUDIO_PHONE_HREF} data-cursor="Call">
                    {STUDIO_PHONE}
                  </a>
                </div>
              </div>
              <div>
                <p className="contact-list__sub">Studio</p>
                <div className="contact-list__copy">
                  <a href={mapHref} target="_blank" rel="noreferrer" data-cursor="Map">
                    {STUDIO_LOCATION}
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article data-reveal className="contact-details__item">
            <figure className="contact-details__fig">
              <Image
                src="/contact-col-reach.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="contact-details__img contact-details__img--b"
              />
            </figure>
            <h3 className="contact-section-kicker">
              <span>/ </span>Studio
            </h3>
            <p className="contact-details__title">Reach</p>
            <div className="contact-list">
              <div>
                <p className="contact-list__sub">New business</p>
                <div className="contact-list__copy">
                  <p>Commercials / Branded</p>
                  <a href={`mailto:${email}`} data-cursor="Mail">
                    {email}
                  </a>
                </div>
              </div>
              <div>
                <p className="contact-list__sub">Note</p>
                <div className="contact-list__copy">
                  <p>
                    We can&apos;t review unsolicited scripts or IP submissions.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article data-reveal className="contact-details__item">
            <figure className="contact-details__fig">
              <Image
                src="/contact-col-social.jpg"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="contact-details__img contact-details__img--c"
              />
            </figure>
            <h3 className="contact-section-kicker">
              <span>/ </span>Follow us
            </h3>
            <p className="contact-details__title">Socials</p>
            <div className="contact-list">
              <div>
                <p className="contact-list__sub">Networks</p>
                <ul className="contact-list__copy contact-list__socials">
                  {socials.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor={item.label}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
