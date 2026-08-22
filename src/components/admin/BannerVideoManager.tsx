"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Upload, Film, ImageIcon, Link2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BannerSettings = {
  showreelUrl: string;
  showreelPoster: string;
};

type Props = {
  initial: BannerSettings;
  variant?: "full" | "compact";
};

function isEmbed(url: string) {
  return (
    url.includes("youtube") ||
    url.includes("youtu.be") ||
    url.includes("vimeo")
  );
}

export function BannerVideoManager({ initial, variant = "full" }: Props) {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState(initial);
  const [uploading, setUploading] = useState<"video" | "poster" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const persist = useCallback(
    async (next: BannerSettings) => {
      setError("");
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        setError("Save failed. Try again.");
        return false;
      }
      setSaved(true);
      router.refresh();
      window.setTimeout(() => setSaved(false), 4000);
      return true;
    },
    [router],
  );

  async function uploadFile(file: File, kind: "video" | "poster") {
    if (kind === "video" && !file.type.startsWith("video/") && !/\.(mp4|webm|mov)$/i.test(file.name)) {
      setError("Please choose an MP4, WebM, or MOV video.");
      return;
    }
    if (kind === "poster" && !file.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    setUploading(kind);
    setError("");
    setSaved(false);

    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    setUploading(null);

    if (!res.ok || !data.url) {
      setError(data.error || "Upload failed. Max 100MB for video.");
      return;
    }

    const field = kind === "video" ? "showreelUrl" : "showreelPoster";
    const next = { ...values, [field]: data.url as string };
    setValues(next);
    await persist(next);
  }

  function onVideoInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "video");
    e.target.value = "";
  }

  function onPosterInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, "poster");
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    uploadFile(file, file.type.startsWith("video/") ? "video" : "poster");
  }

  async function saveUrl() {
    await persist(values);
  }

  const compact = variant === "compact";

  return (
    <div className={cn(!compact && "mt-8 max-w-3xl")}>
      {/* Hidden file inputs */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        onChange={onVideoInput}
      />
      <input
        ref={posterInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onPosterInput}
      />

      <section className="dash-panel overflow-hidden p-0">
        <div className={cn("grid", compact ? "md:grid-cols-5" : "")}>
          <div
            className={cn(
              "relative bg-black",
              compact ? "aspect-video md:col-span-2 md:aspect-auto md:min-h-48" : "aspect-video",
            )}
          >
            {values.showreelUrl && isEmbed(values.showreelUrl) ? (
              <div className="grid h-full min-h-40 place-items-center px-6 text-center text-sm text-white/40">
                Embed URL saved — preview on homepage
              </div>
            ) : values.showreelUrl ? (
              <video
                key={values.showreelUrl}
                src={values.showreelUrl}
                poster={values.showreelPoster || undefined}
                className="h-full w-full object-cover"
                controls
                muted
                playsInline
              />
            ) : (
              <div className="grid h-full min-h-40 place-items-center text-sm text-white/35">
                No banner video yet
              </div>
            )}
            {uploading === "video" ? (
              <div className="absolute inset-0 grid place-items-center bg-black/70">
                <p className="micro animate-pulse text-signal">Uploading video…</p>
              </div>
            ) : null}
          </div>

          <div className={cn("p-6", compact && "md:col-span-3")}>
            {!compact ? (
              <>
                <p className="micro text-signal">Homepage banner</p>
                <h2 className="font-display mt-2 text-2xl uppercase tracking-tight">
                  Showreel video
                </h2>
              </>
            ) : (
              <>
                <p className="micro text-signal">Homepage</p>
                <h2 className="font-display mt-2 text-xl uppercase tracking-tight">
                  Banner video
                </h2>
              </>
            )}
            <p className="mt-2 text-sm text-white/45">
              Upload from your computer — homepage banner updates automatically.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "mt-5 rounded border-2 border-dashed px-5 py-8 text-center transition-colors",
                dragOver
                  ? "border-signal bg-signal/5"
                  : "border-white/15 hover:border-white/25",
              )}
            >
              <Upload className="mx-auto text-white/30" size={28} />
              <p className="mt-3 text-sm text-white/60">
                Drag & drop video here
              </p>
              <p className="micro mt-1 text-white/30">MP4, WebM, MOV — max 100MB</p>
              <button
                type="button"
                disabled={uploading !== null}
                onClick={() => videoInputRef.current?.click()}
                className="mt-4 inline-flex items-center gap-2 bg-signal px-5 py-2.5 text-ink micro disabled:opacity-50"
              >
                <Film size={14} />
                {uploading === "video" ? "Uploading…" : "Upload from computer"}
              </button>
            </div>

            {saved ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 size={16} />
                Banner updated — homepage will show this video
              </p>
            ) : null}
            {error ? <p className="mt-4 text-sm text-signal">{error}</p> : null}
          </div>
        </div>
      </section>

      {!compact ? (
        <section className="dash-panel mt-6 grid gap-5 p-6 md:p-8">
          <p className="micro text-white/40">Or paste a link</p>

          <label className="grid gap-2">
            <span className="micro flex items-center gap-2 text-mist">
              <Link2 size={12} />
              Video URL
            </span>
            <input
              value={values.showreelUrl}
              onChange={(e) => {
                setValues((v) => ({ ...v, showreelUrl: e.target.value }));
                setSaved(false);
              }}
              placeholder="https://…/showreel.mp4 or YouTube / Vimeo link"
              className="field"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="micro flex items-center gap-2 text-mist">
                <ImageIcon size={12} />
                Poster image URL
              </span>
              <input
                value={values.showreelPoster}
                onChange={(e) => {
                  setValues((v) => ({ ...v, showreelPoster: e.target.value }));
                  setSaved(false);
                }}
                placeholder="Optional cover image while video loads"
                className="field"
              />
            </label>
            <div className="flex items-end gap-3">
              <button
                type="button"
                disabled={uploading !== null}
                onClick={() => posterInputRef.current?.click()}
                className="border border-white/15 px-4 py-2.5 micro hover:border-signal hover:text-signal disabled:opacity-50"
              >
                {uploading === "poster" ? "Uploading…" : "Upload poster"}
              </button>
              <button
                type="button"
                onClick={saveUrl}
                className="border border-white/15 px-4 py-2.5 micro hover:border-signal hover:text-signal"
              >
                Save URL
              </button>
            </div>
          </div>

          {values.showreelPoster ? (
            <img
              src={values.showreelPoster}
              alt="Poster preview"
              className="h-24 w-40 border border-white/10 object-cover"
            />
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
