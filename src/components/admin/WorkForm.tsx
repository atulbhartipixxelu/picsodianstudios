"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadWithProgress } from "@/lib/uploadClient";

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
  const [uploading, setUploading] = useState<"thumbnail" | "heroImage" | null>(
    null,
  );

  function set<K extends keyof WorkFormValues>(key: K, value: WorkFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function upload(field: "thumbnail" | "heroImage") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setError("");
      setUploading(field);
      try {
        const url = await uploadWithProgress(file, () => {});
        set(field, url);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Upload failed. Connect Vercel Blob to this project.",
        );
      } finally {
        setUploading(null);
      }
    };
    input.click();
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
        <Field label="Thumbnail URL">
          <div className="flex gap-2">
            <input
              value={values.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              required
              className="field"
            />
            <button
              type="button"
              onClick={() => upload("thumbnail")}
              disabled={uploading !== null}
              className="micro border border-line px-3"
            >
              {uploading === "thumbnail" ? "Uploading…" : "Upload"}
            </button>
          </div>
          {values.thumbnail.startsWith("http") ? (
            <img
              src={values.thumbnail}
              alt=""
              className="mt-2 h-20 w-32 object-cover border border-line"
            />
          ) : null}
        </Field>
        <Field label="Hero image URL">
          <div className="flex gap-2">
            <input
              value={values.heroImage}
              onChange={(e) => set("heroImage", e.target.value)}
              className="field"
            />
            <button
              type="button"
              onClick={() => upload("heroImage")}
              disabled={uploading !== null}
              className="micro border border-line px-3"
            >
              {uploading === "heroImage" ? "Uploading…" : "Upload"}
            </button>
          </div>
        </Field>
      </div>
      <Field label="Video URL (mp4 or YouTube/Vimeo embed)">
        <input
          value={values.videoUrl}
          onChange={(e) => set("videoUrl", e.target.value)}
          className="field"
        />
      </Field>
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
        <button disabled={saving} className="bg-signal px-5 py-3 text-ink micro">
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="micro text-mist">{label}</span>
      {children}
    </label>
  );
}
