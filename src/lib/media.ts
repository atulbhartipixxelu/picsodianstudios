const AMG_PATH = "/works/advance-motion-graphics.mp4";

function amgRemote() {
  return process.env.NEXT_PUBLIC_AMG_VIDEO_URL?.trim() || "";
}

/** Map local / gitignored media to the public URL used in production. */
export function mediaUrl(url?: string | null) {
  const value = url?.trim() ?? "";
  if (!value) return "";
  const remote = amgRemote();
  if (
    remote &&
    (value === AMG_PATH || value.endsWith("/advance-motion-graphics.mp4"))
  ) {
    return remote;
  }
  return value;
}
