export const FALLBACK_SHOWREEL = "/homepagevideo.mp4";
export const FALLBACK_BACKDROP = "/home-backdrop.mp4";

export function embedVideoSrc(url: string) {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (yt?.[1]) {
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&rel=0&playsinline=1`;
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=1&loop=1&background=1`;
  }
  return null;
}

export function isDirectVideo(url: string) {
  if (!url) return false;
  if (/^data:video\//i.test(url)) return true;
  if (/^blob:/i.test(url)) return true;
  if (/blob\.vercel-storage\.com/i.test(url)) return true;
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}
