const AMG_PATH = "/works/advance-motion-graphics.mp4";

const SEED_STILLS: Record<string, { thumbnail: string; heroImage: string }> = {
  "2d-dj-girl": {
    thumbnail:
      "https://images.unsplash.com/photo-1571266028243-d220c6c2fc38?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=80",
  },
  "advance-motion-graphics": {
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2400&q=80",
  },
  "prop-animations": {
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1620121692029-d0884565381d?auto=format&fit=crop&w=2400&q=80",
  },
  loganster: {
    thumbnail:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1608889175250-c3b12b15b4d1?auto=format&fit=crop&w=2400&q=80",
  },
  chalaki: {
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2400&q=80",
  },
  "the-crew": {
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80",
  },
};

export function isLocalUploadPath(url: string) {
  return /^\/uploads\//i.test(url.trim());
}

export function onVercelHost() {
  return (
    Boolean(process.env.VERCEL) ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
  );
}

function amgRemote() {
  return process.env.NEXT_PUBLIC_AMG_VIDEO_URL?.trim() || "";
}

type MediaKind = "thumbnail" | "heroImage" | "video" | "gallery";

/** Map local / ephemeral paths to a URL that actually works in this environment. */
export function mediaUrl(
  url?: string | null,
  ctx?: { slug?: string; kind?: MediaKind },
) {
  const value = url?.trim() ?? "";
  const remote = amgRemote();
  if (
    remote &&
    (value === AMG_PATH || value.endsWith("/advance-motion-graphics.mp4"))
  ) {
    return remote;
  }

  if (value && isLocalUploadPath(value) && onVercelHost()) {
    if (ctx?.slug && (ctx.kind === "thumbnail" || ctx.kind === "heroImage")) {
      return SEED_STILLS[ctx.slug]?.[ctx.kind] || "";
    }
    return "";
  }

  return value;
}
