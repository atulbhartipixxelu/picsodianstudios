"use client";

import { useState } from "react";

const TYPES = ["Film", "Music video", "Commercial", "Game cinematic", "Original", "Other"];
const BUDGETS = ["Let's talk", "Under $10k", "$10k–$40k", "$40k–$100k", "$100k+"];

const fieldClass =
  "border-b border-line bg-transparent py-3 text-paper outline-none transition-colors focus:border-signal";

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
      <div className="border border-signal/40 bg-ink-2 px-6 py-12">
        <p className="micro text-signal">Received / 24 fps</p>
        <h2 className="display-huge mt-3 text-5xl">We&apos;ll be in touch.</h2>
        <p className="mt-4 max-w-md text-paper/70">
          Your enquiry is with the studio. If it&apos;s urgent, write us at
          creatives@picsodianstudios.com.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <label className="grid gap-2">
        <span className="micro text-mist">Name *</span>
        <input required name="name" className={fieldClass} />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Email *</span>
        <input required type="email" name="email" className={fieldClass} />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Company</span>
        <input name="company" className={fieldClass} />
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="micro text-mist">Project type</span>
          <select name="projectType" className={fieldClass} defaultValue="">
            <option value="">Select</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">Budget</span>
          <select name="budget" className={fieldClass} defaultValue="">
            <option value="">Select</option>
            {BUDGETS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className="micro text-mist">Message *</span>
        <textarea
          required
          name="message"
          rows={5}
          minLength={10}
          className={fieldClass}
        />
      </label>
      {error && <p className="micro text-heat">{error}</p>}
      <button
        disabled={status === "sending"}
        data-cursor="Send"
        className="mt-2 border border-signal bg-signal px-6 py-4 text-ink micro disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
