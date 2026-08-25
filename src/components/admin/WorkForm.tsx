"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatBytes,
  uploadWithProgress,
  type UploadProgress,
} from "@/lib/uploadClient";

export type WorkFormValues = {
  title: string;
  slug: string;
  category: string;
  year: number;
  client: string;
  director: string;
  role: string;
  synopsis: string;
  overview: string;
  crew: string;
  thumbnail: string;
  heroImage: string;
  videoUrl: string;
  gallery: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const EMPTY: WorkFormValues = {
  title: "",
  slug: "",
  category: "Film",
  year: new Date().getFullYear(),
  client: "",
  director: "",
  role: "",
  synopsis: "",
  overview: "",
  crew: "[]",
  thumbnail: "",
  heroImage: "",
  videoUrl: "",
  gallery: "[]",
  featured: false,
  published: true,
  sortOrder: 0,
};

type MediaField = "thumbnail" | "heroImage" | "videoUrl";

export function WorkForm({
  id,
  initial,
}: {
  id?: string;
  initial?: Partial<WorkFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<WorkFormValues>({ ...EMPTY, ...initial });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<MediaField | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const thumbInput = useRef<HTMLInputElement>(null);
  const heroInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof WorkFormValues>(key: K, value: WorkFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function persistField(field: MediaField, url: string) {
    set(field, url);
    if (!id) return;
    const res = await fetch(`/api/admin/works/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: url }),
    });
    if (!res.ok) {
      throw new Error("Uploaded, but could not save the work. Click Save work.");
    }
    router.refresh();
  }

  async function upload(field: MediaField, file: File) {
    setError("");
    setUploading(field);
    setProgress({ percent: 0, loaded: 0, total: file.size });
    try {
      const url = await uploadWithProgress(file, setProgress);
      await persistField(field, url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Connect Vercel Blob to this project, then redeploy.",
      );
    } finally {
      setUploading(null);
      setProgress(null);
    }
  }

  function onPick(
    field: MediaField,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void upload(field, file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(id ? `/api/admin/works/${id}` : "/api/admin/works", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save.");
      setSaving(false);
      return;
    }
    router.push("/admin/works");
    router.refresh();
  }

  async function onDelete() {
    if (!id || !confirm("Delete this work?")) return;
    await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
    router.push("/admin/works");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="dash-panel grid gap-5 p-6 md:p-8">
      {error ? <p className="micro border border-heat px-3 py-2 text-heat">{error}</p> : null}
      <input
        ref={thumbInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPick("thumbnail", e)}
      />
      <input
        ref={heroInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => onPick("heroImage", e)}
      />
      <input
        ref={videoInput}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        onChange={(e) => onPick("videoUrl", e)}
      />

      <Field label="Title">
        <input
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
          className="field"
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Slug">
          <input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto from title"
            className="field"
          />
        </Field>
        <Field label="Category">
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            className="field"
          >
            {["2D", "3D", "Motion", "Film", "Character"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Year">
          <input
            type="number"
            value={values.year}
            onChange={(e) => set("year", Number(e.target.value))}
            className="field"
          />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Client">
          <input value={values.client} onChange={(e) => set("client", e.target.value)} className="field" />
        </Field>
        <Field label="Director">
          <input value={values.director} onChange={(e) => set("director", e.target.value)} className="field" />
        </Field>
        <Field label="Role">
          <input value={values.role} onChange={(e) => set("role", e.target.value)} className="field" />
        </Field>
      </div>
      <Field label="Synopsis">
        <textarea
          rows={4}
          value={values.synopsis}
          onChange={(e) => set("synopsis", e.target.value)}
          className="field"
        />
      </Field>
      <Field label="Overview">
        <textarea
          rows={4}
          value={values.overview}
          onChange={(e) => set("overview", e.target.value)}
          className="field"
        />
      </Field>
      <Field label='Crew JSON — [{"role":"Direction","name":"Name"}]'>
        <textarea
          rows={4}
          value={values.crew}
          onChange={(e) => set("crew", e.target.value)}
          className="field font-mono text-xs"
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <MediaUrlField
          label="Thumbnail URL"
          value={values.thumbnail}
          required
          uploading={uploading === "thumbnail"}
          progress={uploading === "thumbnail" ? progress : null}
          onChange={(v) => set("thumbnail", v)}
          onUpload={() => thumbInput.current?.click()}
          preview
        />
        <MediaUrlField
          label="Hero image URL"
          value={values.heroImage}
          uploading={uploading === "heroImage"}
          progress={uploading === "heroImage" ? progress : null}
          onChange={(v) => set("heroImage", v)}
          onUpload={() => heroInput.current?.click()}
          preview
        />
      </div>
      <MediaUrlField
        label="Video URL (mp4 or YouTube/Vimeo embed)"
        value={values.videoUrl}
        uploading={uploading === "videoUrl"}
        progress={uploading === "videoUrl" ? progress : null}
        onChange={(v) => set("videoUrl", v)}
        onUpload={() => videoInput.current?.click()}
        uploadLabel="Upload video"
      />
      <Field label="Gallery JSON — array of image URLs">
        <textarea
          rows={3}
          value={values.gallery}
          onChange={(e) => set("gallery", e.target.value)}
          className="field font-mono text-xs"
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Sort order">
          <input
            type="number"
            value={values.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="field"
          />
        </Field>
        <label className="micro flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="micro flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Published
        </label>
      </div>
      {error && <p className="micro text-heat">{error}</p>}
      <div className="flex gap-3">
        <button disabled={saving || uploading !== null} className="bg-signal px-5 py-3 text-ink micro">
          {saving ? "Saving…" : "Save work"}
        </button>
        {id && (
          <button type="button" onClick={onDelete} className="border border-heat px-5 py-3 text-heat micro">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

function MediaUrlField({
  label,
  value,
  required,
  uploading,
  progress,
  onChange,
  onUpload,
  preview,
  uploadLabel = "Upload",
}: {
  label: string;
  value: string;
  required?: boolean;
  uploading: boolean;
  progress: UploadProgress | null;
  onChange: (value: string) => void;
  onUpload: () => void;
  preview?: boolean;
  uploadLabel?: string;
}) {
  const isRemote = /^https?:\/\//i.test(value);
  const isLocalDisk = /^\/uploads\//i.test(value);

  return (
    <div className="grid gap-2">
      <span className="micro text-mist">{label}</span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="field"
        />
        <button
          type="button"
          onClick={onUpload}
          disabled={uploading}
          className="micro shrink-0 border border-line px-3"
        >
          {uploading
            ? progress
              ? `${progress.percent}%`
              : "Uploading…"
            : uploadLabel}
        </button>
      </div>
      {uploading && progress ? (
        <p className="micro text-mist">
          {formatBytes(progress.loaded)} / {formatBytes(progress.total)}
        </p>
      ) : null}
      {preview && isRemote ? (
        <img src={value} alt="" className="mt-1 h-20 w-32 object-cover border border-line" />
      ) : null}
      {preview && isLocalDisk ? (
        <p className="micro text-heat">
          This file is only on the local computer. Upload again so Vercel can store it.
        </p>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="micro text-mist">{label}</span>
      {children}
    </label>
  );
}
