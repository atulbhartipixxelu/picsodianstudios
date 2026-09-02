"use client";

import { useState } from "react";

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
        <p className="contact-ok-kicker">Received</p>
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
          <span>Name *</span>
          <input required name="name" autoComplete="name" placeholder="Your name" />
        </label>
        <label className="contact-field">
          <span>Email *</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@studio.com"
          />
        </label>
      </div>
      <label className="contact-field">
        <span>Company</span>
        <input name="company" autoComplete="organization" placeholder="Studio or brand" />
      </label>
      <label className="contact-field contact-field-message">
        <span>Message *</span>
        <textarea
          required
          name="message"
          rows={6}
          minLength={10}
          placeholder="Tell us what you want to make."
        />
      </label>

      {error ? <p className="contact-error">{error}</p> : null}

      <div className="contact-form-foot">
        <p className="contact-form-meta">No brief is too early.</p>
        <button
          disabled={status === "sending"}
          data-cursor="Send"
          className="contact-send"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
