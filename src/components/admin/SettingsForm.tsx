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
  const [uploading, setUploading] = useState<"video" | "poster" | null>(null);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function upload(kind: "video" | "poster") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = kind === "video" ? "video/mp4,video/webm" : "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(kind);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      setUploading(null);
      if (data.url) {
        set(kind === "video" ? "showreelUrl" : "showreelPoster", data.url);
      }
    };
    input.click();
  }

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

  const isEmbed =
    values.showreelUrl.includes("youtube") ||
    values.showreelUrl.includes("youtu.be") ||
    values.showreelUrl.includes("vimeo");

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-3xl gap-8">
      <section className="dash-panel p-6 md:p-8">
        <p className="micro text-signal">Homepage banner</p>
        <h2 className="font-display mt-2 text-2xl uppercase tracking-tight">
          Showreel video
        </h2>
        <p className="mt-2 text-sm text-white/45">
          This plays full-screen on the homepage. Upload an MP4 or paste a video / YouTube / Vimeo URL.
        </p>

        <div className="mt-6 overflow-hidden border border-white/10 bg-black">
          {values.showreelUrl && isEmbed ? (
            <div className="aspect-video bg-black text-center text-sm leading-[12rem] text-white/40">
              Embed URL saved — preview on the homepage.
            </div>
          ) : values.showreelUrl ? (
            <video
              key={values.showreelUrl}
              src={values.showreelUrl}
              poster={values.showreelPoster || undefined}
              className="aspect-video w-full object-cover"
              controls
              muted
              playsInline
            />
          ) : (
            <div className="aspect-video grid place-items-center text-sm text-white/35">
              No banner video yet
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="micro text-mist">Video URL</span>
            <input
              value={values.showreelUrl}
              onChange={(e) => set("showreelUrl", e.target.value)}
              placeholder="https://…/showreel.mp4 or YouTube link"
              className="field"
            />
          </label>
          <button
            type="button"
            onClick={() => upload("video")}
            className="w-fit border border-white/15 px-4 py-2 micro hover:border-signal hover:text-signal"
          >
            {uploading === "video" ? "Uploading…" : "Upload MP4"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="micro text-mist">Poster image URL</span>
            <input
              value={values.showreelPoster}
              onChange={(e) => set("showreelPoster", e.target.value)}
              className="field"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => upload("poster")}
              className="border border-white/15 px-4 py-2 micro hover:border-signal hover:text-signal"
            >
              {uploading === "poster" ? "Uploading…" : "Upload poster"}
            </button>
          </div>
        </div>

        {values.showreelPoster ? (
          <img
            src={values.showreelPoster}
            alt="Poster"
            className="mt-4 h-24 w-40 object-cover border border-white/10"
          />
        ) : null}

        <label className="mt-6 grid gap-2">
          <span className="micro text-mist">Tagline</span>
          <input
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className="field"
          />
        </label>
      </section>

      <section className="dash-panel grid gap-5 p-6 md:p-8">
        <p className="micro text-signal">Studio</p>
        <label className="grid gap-2">
          <span className="micro text-mist">Studio email</span>
          <input
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">Instagram</span>
          <input
            value={values.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            className="field"
          />
        </label>
        <label className="grid gap-2">
          <span className="micro text-mist">About copy</span>
          <textarea
            rows={10}
            value={values.about}
            onChange={(e) => set("about", e.target.value)}
            className="field"
          />
        </label>
      </section>

      <button className="w-fit bg-signal px-5 py-3 text-ink micro">
        {saved ? "Saved — homepage updated" : "Save banner & settings"}
      </button>
    </form>
  );
}
