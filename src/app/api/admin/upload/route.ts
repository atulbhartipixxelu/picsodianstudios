import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

export const maxDuration = 60;
export const runtime = "nodejs";

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

const ALLOWED_SET = new Set<string>(ALLOWED);

function allowedFile(file: File) {
  if (ALLOWED_SET.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return [".mp4", ".webm", ".mov", ".jpg", ".jpeg", ".png", ".webp", ".gif"].some(
    (ext) => name.endsWith(ext),
  );
}

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function GET() {
  return NextResponse.json({ blob: blobEnabled() });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!allowedFile(file)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }
  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (100MB max)." }, { status: 400 });
  }

  const ext =
    path.extname(file.name) || (file.type.startsWith("video") ? ".mp4" : ".jpg");
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`.replace(
    /\s+/g,
    "-",
  );

  if (blobEnabled()) {
    try {
      const blob = await put(`uploads/${safe}`, file, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: file.type || undefined,
        multipart: file.size > 4 * 1024 * 1024,
      });
      return NextResponse.json({ url: blob.url });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Cloud upload failed. Check the Blob store is connected to this project.",
        },
        { status: 500 },
      );
    }
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob is not connected. Open Vercel → Storage → connect picsodianstudios-blob to this project, then redeploy.",
      },
      { status: 503 },
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safe), buffer);

  return NextResponse.json({ url: `/uploads/${safe}` });
}
