export const SHOWREEL_EVENT = "picsodian:showreel";
export const SHOWREEL_STORAGE_KEY = "picsodian:showreel";

export type ShowreelPayload = {
  showreelUrl: string;
  showreelPoster: string;
};

export function publishShowreel(next: ShowreelPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SHOWREEL_EVENT, { detail: next }));
  localStorage.setItem(
    SHOWREEL_STORAGE_KEY,
    JSON.stringify({ ...next, t: Date.now() }),
  );
}

export function applyShowreel(
  data: Partial<ShowreelPayload>,
  setSrc: (url: string) => void,
  setCover: (url: string) => void,
) {
  if (data.showreelUrl) setSrc(data.showreelUrl);
  if (data.showreelPoster) setCover(data.showreelPoster);
}
