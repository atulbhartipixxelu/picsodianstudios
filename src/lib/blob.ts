import { put } from "@vercel/blob";

export function blobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

export async function putPublicFile(pathname: string, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  return put(pathname, bytes, {
    access: "public",
    addRandomSuffix: true,
    allowOverwrite: true,
    contentType: file.type || "application/octet-stream",
  });
}
