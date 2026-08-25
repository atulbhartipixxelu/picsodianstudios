import { put } from "@vercel/blob/client";

export type UploadProgress = {
  percent: number;
  loaded: number;
  total: number;
};

/** Vercel serverless request body limit — larger files must go client → Blob. */
const SERVER_BODY_LIMIT = 4 * 1024 * 1024;
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
        reject(new Error(data.error || "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.ontimeout = () =>
      reject(new Error("Upload timed out. Try a smaller file, or connect Vercel Blob."));

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
      throw new Error(
        data.error ||
          "Could not start cloud upload. Connect Vercel Blob to this project and redeploy.",
      );
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

  const mode = await fetch("/api/admin/upload", {
    cache: "no-store",
    credentials: "include",
  })
    .then((res) => res.json() as Promise<{ blob?: boolean }>)
    .catch(() => ({ blob: false }));

  if (file.size > SERVER_BODY_LIMIT) {
    if (!mode.blob) {
      throw new Error(
        "This file is larger than 4MB. On Vercel it must go to Blob storage — connect picsodianstudios-blob to this project, then redeploy.",
      );
    }
    return blobDirectUpload(file, onProgress);
  }

  return xhrUpload(file, onProgress);
}
