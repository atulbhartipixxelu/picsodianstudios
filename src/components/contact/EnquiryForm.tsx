"use client";

import { useState } from "react";

const TYPES = [
  "Film",
  "Music video",
  "Commercial",
  "Game cinematic",
  "Original",
  "Other",
];
const BUDGETS = ["Let's talk", "Under $10k", "$10k–$40k", "$40k–$100k", "$100k+"];

export function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus("err");
      setError("Could not send. Check the fields and try again.");
      return;
    }
    setStatus("ok");
    e.currentTarget.reset();
  }

  if (status === "ok") {
    return (
      <div className="contact-ok">
        <p className="micro text-paper/55">Received / 24 fps</p>
        <p className="contact-ok-title">We&apos;ll be in touch.</p>
        <p>
          Your enquiry is with the studio. If it&apos;s urgent, write
          creatives@picsodianstudios.com.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-form">
      <div className="contact-form-pair">
        <label className="contact-field">
          <span>01 / Name *</span>
          <input required name="name" autoComplete="name" />
        </label>
        <label className="contact-field">
          <span>02 / Email *</span>
          <input required type="email" name="email" autoComplete="email" />
        </label>
      </div>
      <label className="contact-field">
        <span>03 / Company</span>
        <input name="company" autoComplete="organization" />
      </label>

      <fieldset className="contact-field">
        <span>04 / Project type</span>
        <div className="contact-picks">
          {TYPES.map((type) => (
            <label key={type}>
              <input type="radio" name="projectType" value={type} />
              <em>{type}</em>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="contact-field">
        <span>05 / Budget</span>
        <div className="contact-picks">
          {BUDGETS.map((budget) => (
            <label key={budget}>
              <input type="radio" name="budget" value={budget} />
              <em>{budget}</em>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="contact-field">
        <span>06 / Message *</span>
        <textarea required name="message" rows={5} minLength={10} />
      </label>

      {error ? <p className="contact-error">{error}</p> : null}

      <button
        disabled={status === "sending"}
        data-cursor="Send"
        className="contact-send"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
