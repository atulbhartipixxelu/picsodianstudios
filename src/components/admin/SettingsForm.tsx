"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Settings = {
  showreelUrl: string;
  showreelPoster: string;
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="dash-panel mt-8 grid max-w-3xl gap-5 p-6 md:p-8">
      <label className="grid gap-2">
        <span className="micro text-mist">Showreel video URL</span>
        <input
          value={values.showreelUrl}
          onChange={(e) => setValues({ ...values, showreelUrl: e.target.value })}
          className="field"
        />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Showreel poster URL</span>
        <input
          value={values.showreelPoster}
          onChange={(e) => setValues({ ...values, showreelPoster: e.target.value })}
          className="field"
        />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Tagline</span>
        <input
          value={values.tagline}
          onChange={(e) => setValues({ ...values, tagline: e.target.value })}
          className="field"
        />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Studio email</span>
        <input
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className="field"
        />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">Instagram</span>
        <input
          value={values.instagram}
          onChange={(e) => setValues({ ...values, instagram: e.target.value })}
          className="field"
        />
      </label>
      <label className="grid gap-2">
        <span className="micro text-mist">About copy</span>
        <textarea
          rows={10}
          value={values.about}
          onChange={(e) => setValues({ ...values, about: e.target.value })}
          className="field"
        />
      </label>
      <button className="w-fit bg-signal px-5 py-3 text-ink micro">
        {saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}
