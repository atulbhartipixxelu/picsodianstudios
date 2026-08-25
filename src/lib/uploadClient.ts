import { upload } from "@vercel/blob/client";

export type UploadProgress = {
  percent: number;
  loaded: number;
  total: number;
};

export function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function xhrUpload(
  file: File,
  onProgress: (info: UploadProgress) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.withCredentials = true;

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

    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

export async function uploadWithProgress(
  file: File,
  onProgress: (info: UploadProgress) => void,
): Promise<string> {
  const mode = await fetch("/api/admin/upload", { cache: "no-store" })
    .then((res) => res.json() as Promise<{ blob?: boolean }>)
    .catch(() => ({ blob: false }));

  if (mode.blob) {
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
      multipart: file.size > 4 * 1024 * 1024,
      onUploadProgress: (event) => {
        onProgress({
          percent: Math.round(event.percentage),
          loaded: event.loaded,
          total: event.total,
        });
      },
    });
    return blob.url;
  }

  return xhrUpload(file, onProgress);
}
