import { put } from "@vercel/blob/client";

export type UploadProgress = {
  percent: number;
  loaded: number;
  total: number;
};

/** Vercel serverless request body limit — larger files must go client → Blob. */
const SERVER_BODY_LIMIT = 3.5 * 1024 * 1024;
const IMAGE_TARGET_BYTES = 280 * 1024;
const UPLOAD_TIMEOUT_MS = 180_000;

export function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileExt(file: File) {
  const fromName = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  if (fromName) return fromName;
  if (file.type.startsWith("video/")) return ".mp4";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  return ".jpg";
}

function safePathname(file: File) {
  const ext = fileExt(file).toLowerCase();
  return `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

function isStillImage(file: File) {
  if (file.type === "image/gif") return false;
  return (
    file.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(file.name)
  );
}

function isPortableUrl(url: string) {
  return (
    /^https?:\/\//i.test(url) ||
    url.startsWith("data:image/") ||
    url.startsWith("blob:")
  );
}

async function compressOnce(
  file: File,
  maxEdge: number,
  quality: number,
): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read image."));
      el.src = url;
    });

    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressImage(file: File): Promise<File> {
  if (!isStillImage(file)) return file;

  let quality = 0.82;
  let maxEdge = 1400;
  let out = file;

  try {
    for (let i = 0; i < 6; i++) {
      out = await compressOnce(file, maxEdge, quality);
      if (out.size <= IMAGE_TARGET_BYTES) return out;
      quality = Math.max(0.55, quality - 0.08);
      maxEdge = Math.max(720, Math.round(maxEdge * 0.85));
    }
  } catch {
    return file;
  }

  return out;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not encode image."));
    };
    reader.onerror = () => reject(new Error("Could not encode image."));
    reader.readAsDataURL(file);
  });
}

function xhrUpload(
  file: File,
  onProgress: (info: UploadProgress) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.withCredentials = true;
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress({
        percent: Math.round((event.loaded / event.total) * 100),
        loaded: event.loaded,
        total: event.total,
      });
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText) as { url?: string; error?: string };
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          onProgress({ percent: 100, loaded: file.size, total: file.size });
          resolve(data.url);
          return;
        }
        reject(new Error(data.error || `Upload failed (${xhr.status}).`));
      } catch {
        reject(
          new Error(
            xhr.status === 413
              ? "File is too large for the server. Try a smaller image."
              : "Upload failed.",
          ),
        );
      }
    };

    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.ontimeout = () =>
      reject(new Error("Upload timed out. Try a smaller file."));

    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

async function blobDirectUpload(
  file: File,
  onProgress: (info: UploadProgress) => void,
): Promise<string> {
  const pathname = safePathname(file);
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    const tokenRes = await fetch("/api/blob/upload", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: {
          pathname,
          clientPayload: null,
          multipart: true,
        },
      }),
    });

    const data = (await tokenRes.json().catch(() => ({}))) as {
      clientToken?: string;
      error?: string;
    };

    if (!tokenRes.ok || !data.clientToken) {
      throw new Error(data.error || "Could not start cloud upload.");
    }

    const blob = await put(pathname, file, {
      access: "public",
      token: data.clientToken,
      multipart: true,
      abortSignal: controller.signal,
      onUploadProgress: (event) => {
        onProgress({
          percent: Math.round(event.percentage),
          loaded: event.loaded,
          total: event.total,
        });
      },
    });

    onProgress({ percent: 100, loaded: file.size, total: file.size });
    return blob.url;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Upload timed out. Check your connection and try again.");
    }
    throw error instanceof Error ? error : new Error("Cloud upload failed.");
  } finally {
    window.clearTimeout(timer);
  }
}

export async function uploadWithProgress(
  file: File,
  onProgress: (info: UploadProgress) => void,
): Promise<string> {
  onProgress({ percent: 0, loaded: 0, total: file.size });

  const prepared = await compressImage(file);
  onProgress({ percent: 8, loaded: 0, total: prepared.size });

  if (isStillImage(file) || prepared.type.startsWith("image/")) {
    try {
      const url = await xhrUpload(prepared, onProgress);
      if (isPortableUrl(url)) return url;
    } catch {
      // Blob / disk may fail on Vercel — keep the image in the database instead.
    }
    onProgress({
      percent: 92,
      loaded: prepared.size,
      total: prepared.size,
    });
    const dataUrl = await fileToDataUrl(prepared);
    onProgress({ percent: 100, loaded: prepared.size, total: prepared.size });
    return dataUrl;
  }

  const mode = await fetch("/api/admin/upload", {
    cache: "no-store",
    credentials: "include",
  })
    .then((res) => res.json() as Promise<{ blob?: boolean }>)
    .catch(() => ({ blob: false }));

  if (prepared.size > SERVER_BODY_LIMIT) {
    if (!mode.blob) {
      throw new Error("This video is too large to store without Vercel Blob.");
    }
    try {
      return await blobDirectUpload(prepared, onProgress);
    } catch {
      return xhrUpload(prepared, onProgress);
    }
  }

  return xhrUpload(prepared, onProgress);
}
