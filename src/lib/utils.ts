export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const FALLBACK_STILL = "/cartoon-backdrop.png";

export function stillSrc(url?: string | null) {
  const value = url?.trim();
  if (!value) return FALLBACK_STILL;
  // Vercel disk is ephemeral — these 404 on production after upload.
  if (value.startsWith("/uploads/")) return FALLBACK_STILL;
  return value;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
}

export function parseCrew(value: string | null | undefined): Array<{ role: string; name: string }> {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        typeof item === "string"
          ? { role: "Credit", name: item }
          : { role: String(item.role ?? "Credit"), name: String(item.name ?? "") },
      );
    }
  } catch {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [role, ...rest] = line.split("/");
        return rest.length
          ? { role: role.trim(), name: rest.join("/").trim() }
          : { role: "Credit", name: line };
      });
  }
  return [];
}

export function serializeWork(work: {
  id: string;
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
}) {
  return {
    ...work,
    crew: parseCrew(work.crew),
    gallery: parseJsonArray(work.gallery),
  };
}

export type PublicWork = ReturnType<typeof serializeWork>;
