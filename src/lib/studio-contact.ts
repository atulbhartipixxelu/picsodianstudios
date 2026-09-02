export const STUDIO_EMAIL = "creatives@picsodianstudios.com";
export const STUDIO_LOCATION = "Jamshedpur, India";
export const STUDIO_PHONE = "On request";
export const STUDIO_PHONE_HREF = `mailto:${STUDIO_EMAIL}?subject=Call%20request`;

export const SOCIAL_FALLBACK = {
  instagram: "https://www.instagram.com/picsodianstudios",
  twitter: "https://x.com/picsodianstudios",
  vimeo: "https://vimeo.com/picsodianstudios",
};

export function hrefOr(value: string, fallback: string) {
  const next = value.trim();
  if (!next) return fallback;
  if (/^https?:\/\//i.test(next)) return next;
  return `https://${next.replace(/^\/+/, "")}`;
}
