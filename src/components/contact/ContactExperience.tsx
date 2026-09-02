"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import {
  SOCIAL_FALLBACK,
  STUDIO_EMAIL,
  STUDIO_LOCATION,
  STUDIO_PHONE,
  STUDIO_PHONE_HREF,
  hrefOr,
} from "@/lib/studio-contact";

gsap.registerPlugin(useGSAP);

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="contact-ico"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function PinIcon() {
  return (
    <Icon>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </Icon>
  );
}

function PhoneIcon() {
  return (
    <Icon>
      <path d="M6.7 3.8h3.2l1.4 3.4-2 1.2a12.4 12.4 0 0 0 6.3 6.3l1.2-2 3.4 1.4v3.2c0 .9-.7 1.7-1.6 1.8C9.4 20.3 3.7 14.6 2.9 5.4c-.1-.9.7-1.6 1.8-1.6Z" />
    </Icon>
  );
}

function MailIcon() {
  return (
    <Icon>
      <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="contact-ico"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
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
    <svg viewBox="0 0 24 24" aria-hidden className="contact-ico" fill="currentColor">
      <path d="M18.9 2H22l-6.8 7.8L22.7 22h-6.4l-5-6.6L5.7 22H2.5l7.3-8.3L1.6 2h6.6l4.5 6L18.9 2Zm-1.1 18.1h1.8L6.4 3.8H4.5l13.3 16.3Z" />
    </svg>
  );
}

function VimeoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="contact-ico" fill="currentColor">
      <path d="M22.2 8.4c-.1 2.3-1.7 5.5-4.8 9.4-3.2 4.1-5.9 6.2-8.1 6.2-1.4 0-2.5-1.3-3.5-3.8L4 13.3C3.2 10.8 2.4 9.6 1.5 9.6c-.2 0-.9.4-2.1 1.2L0 9.2C2.1 7.4 4.2 5.5 5.8 5.4c1.8-.2 2.9 1 3.3 3.5.5 2.7.8 4.4 1 5 .6 2.6 1.2 3.9 1.9 3.9.8 0 2.1-1.3 3.7-4 1.6-2.6 2.5-4.6 2.6-5.9.2-2.1-.6-3.2-2.4-3.2-.8 0-1.7.2-2.6.6 1.7-5.6 5-8.3 9.8-8.1 3.6.2 5.3 2.4 5.1 6.7Z" />
    </svg>
  );
}

type Props = {
  email?: string;
  instagram?: string;
  twitter?: string;
  vimeo?: string;
};

export function ContactExperience({
  email: emailProp,
  instagram,
  twitter,
  vimeo,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const email = emailProp?.trim() || STUDIO_EMAIL;
  const socials = {
    instagram: hrefOr(instagram ?? "", SOCIAL_FALLBACK.instagram),
    twitter: hrefOr(twitter ?? "", SOCIAL_FALLBACK.twitter),
    vimeo: hrefOr(vimeo ?? "", SOCIAL_FALLBACK.vimeo),
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
        },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="contact-page">
      <div className="contact-wash" aria-hidden />

      <div className="contact-shell">
        <div className="contact-hero">
          <div className="contact-hero-copy">
            <div className="contact-kicker">
              <p className="micro text-paper/55">Contact</p>
              <span className="contact-kicker-rule" aria-hidden />
              <p className="micro text-paper/40">Open gate</p>
            </div>

            <h1 className="contact-title">
              <span className="contact-clip">
                <span data-line>Get in</span>
              </span>
              <span className="contact-clip">
                <span data-line className="contact-mark">
                  touch.
                </span>
              </span>
            </h1>

            <p data-in className="contact-lede">
              For business and press. Film, motion, character, or something that
              doesn&apos;t have a name yet — send the brief.
            </p>

            <ul className="contact-rail" data-in>
              <li>
                <a
                  href="https://maps.google.com/?q=Jamshedpur%20India"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Map"
                >
                  <span className="contact-rail-ico">
                    <PinIcon />
                  </span>
                  <span>
                    <em>Location</em>
                    <strong>{STUDIO_LOCATION}</strong>
                  </span>
                </a>
              </li>
              <li>
                <a href={STUDIO_PHONE_HREF} data-cursor="Call">
                  <span className="contact-rail-ico">
                    <PhoneIcon />
                  </span>
                  <span>
                    <em>Phone</em>
                    <strong>{STUDIO_PHONE}</strong>
                  </span>
                </a>
              </li>
              <li className="contact-rail-mail">
                <a href={`mailto:${email}`} data-cursor="Mail">
                  <span className="contact-rail-ico">
                    <MailIcon />
                  </span>
                  <span>
                    <em>Email</em>
                    <strong>{email}</strong>
                  </span>
                </a>
              </li>
              <li className="contact-rail-social-item">
                <div className="contact-rail-social">
                  <span>
                    <em>Social</em>
                    <span className="contact-socials">
                      <a
                        href={socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="Instagram"
                        aria-label="Instagram"
                      >
                        <InstagramIcon />
                      </a>
                      <a
                        href={socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="X"
                        aria-label="X"
                      >
                        <XIcon />
                      </a>
                      <a
                        href={socials.vimeo}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="Vimeo"
                        aria-label="Vimeo"
                      >
                        <VimeoIcon />
                      </a>
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div data-in className="contact-form-wrap">
            <div className="contact-form-top">
              <div>
                <p className="micro text-paper/45">01 / Enquire</p>
                <p className="contact-form-kicker">Send the brief</p>
              </div>
              <p className="contact-form-note">Replies in a few working days.</p>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
