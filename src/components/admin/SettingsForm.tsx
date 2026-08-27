"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Settings = {
  tagline: string;
  email: string;
  instagram: string;
  twitter: string;
  vimeo: string;
  about: string;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function patch<K extends keyof Settings>(key: K, value: Settings[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function persist(next: Settings) {
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) {
      setError("Could not save. Check the fields and try again.");
      return false;
    }
    setSaved(true);
    router.refresh();
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await persist(values);
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-8">
      <section className="dash-panel p-6 md:p-8">
        <p className="micro text-signal">Homepage banner</p>
        <h2 className="dash-section-title mt-2">
          Showreel video
        </h2>
        <p className="mt-2 text-sm text-white/45">
          Upload or change the banner video from the Banner page.
        </p>
        <Link
          href="/admin/banner"
          className="mt-5 inline-block border border-white/15 px-4 py-2 micro hover:border-signal hover:text-signal"
        >
          Manage banner video →
        </Link>
      </section>

      <section className="dash-panel grid gap-5 p-6 md:p-8">
        <p className="micro text-signal">Studio</p>
        <label className="grid gap-2">
          <span className="micro text-mist">Tagline</span>
          <input
            value={values.tagline}
            onChange={(e) => patch("tagline", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">Studio email</span>
          <input
            value={values.email}
            onChange={(e) => patch("email", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">Instagram</span>
          <input
            value={values.instagram}
            onChange={(e) => patch("instagram", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">X / Twitter</span>
          <input
            value={values.twitter}
            onChange={(e) => patch("twitter", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">Vimeo</span>
          <input
            value={values.vimeo}
            onChange={(e) => patch("vimeo", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">About copy</span>
          <textarea
            rows={10}
            value={values.about}
            onChange={(e) => patch("about", e.target.value)}
            className="field"
          />
        </label>
      </section>

      {error ? <p className="text-sm text-signal">{error}</p> : null}

      <button className="dash-btn w-fit">
        {saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
