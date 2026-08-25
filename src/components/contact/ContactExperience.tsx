"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = [
  { text: "Get in", accent: false },
  { text: "touch.", accent: false },
  { text: "Open gate.", accent: true },
];

export function ContactExperience() {
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState("00:00:00:00");

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 1) % 24;
      const total = Math.floor(Date.now() / 1000) % 3600;
      const m = String(Math.floor(total / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      setTime(`05:${m}:${s}:${String(frame).padStart(2, "0")}`);
    }, 1000 / 24);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
        },
      );

      gsap.from(el.querySelectorAll("[data-in]"), {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.18,
        ease: "power3.out",
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="contact-page">
      <div className="contact-fx" aria-hidden>
        <div className="contact-hatch" />
        <span className="contact-mark">Enquire</span>
      </div>

      <div className="contact-hud" data-in>
        <div className="flex items-center gap-3">
          <span className="crosshair" aria-hidden />
          <p className="micro text-paper/80">Contact / 05</p>
        </div>
        <p className="micro hidden items-center gap-2 text-paper/55 sm:flex">
          <span className="studio-rec-dot" />
          {time}
        </p>
      </div>

      <div className="contact-split">
        <div className="contact-copy">
          <h1 className="contact-title">
            {LINES.map((line) => (
              <span key={line.text} className="contact-clip">
                <span
                  data-line
                  className={line.accent ? "contact-accent" : undefined}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>
          <p data-in className="contact-lede">
            For business and press. Film, motion, character, or something that
            doesn&apos;t have a name yet — send the brief.
          </p>

          <aside data-in className="contact-slate">
            <p className="micro text-paper/45">Call sheet</p>
            <ul>
              <li>
                <span>01</span>
                <div>
                  <p className="micro text-paper/45">Studio</p>
                  <a
                    href="mailto:creatives@picsodianstudios.com"
                    data-cursor="Mail"
                  >
                    creatives@picsodianstudios.com
                  </a>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <p className="micro text-paper/45">Channel</p>
                  <p>Press · Business · Originals</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <p className="micro text-paper/45">Formats</p>
                  <p>Films · Music videos · Commercials · Game cinematics</p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <p className="micro text-paper/45">Turnaround</p>
                  <p>We reply within a few working days.</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>

        <div data-in className="contact-form-wrap">
          <span className="contact-brief-spine" aria-hidden>
            Brief
          </span>
          <div className="contact-ticks" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="contact-form-top">
            <div>
              <p className="micro text-paper/55">Enquiry / 01</p>
              <p className="contact-form-kicker">Send the brief</p>
            </div>
            <p className="micro text-paper/40">Scene 05 · Gate open</p>
          </div>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
