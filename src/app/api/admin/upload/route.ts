import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { blobConfigured, putPublicFile } from "@/lib/blob";

export const maxDuration = 60;
export const runtime = "nodejs";

function allowedFile(file: File) {
  if (
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    file.type === "application/octet-stream"
  ) {
    return true;
  }
  const name = file.name.toLowerCase();
  return [".mp4", ".webm", ".mov", ".jpg", ".jpeg", ".png", ".webp", ".gif"].some(
    (ext) => name.endsWith(ext),
  );
}

function useBlob() {
  return blobConfigured() || Boolean(process.env.VERCEL);
}

export async function GET() {
  return NextResponse.json({ blob: useBlob() });
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

  const ext = (
    path.extname(file.name) || (file.type.startsWith("video") ? ".mp4" : ".jpg")
  ).toLowerCase();
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`.replace(
    /\s+/g,
    "-",
  );

  if (useBlob()) {
    try {
      const blob = await putPublicFile(`uploads/${safe}`, file);
      return NextResponse.json({ url: blob.url });
    } catch {
      // Fall through — images can still be stored as a data URL in the database.
    }
  }

  const isImage =
    file.type.startsWith("image/") ||
    [".jpg", ".jpeg", ".png", ".webp", ".gif"].some((item) =>
      file.name.toLowerCase().endsWith(item),
    );

  if (isImage) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 900 * 1024) {
      return NextResponse.json(
        { error: "Image is still too large. Try a smaller JPG or PNG." },
        { status: 400 },
      );
    }
    const mime = file.type.startsWith("image/") ? file.type : "image/jpeg";
    return NextResponse.json({
      url: `data:${mime};base64,${buffer.toString("base64")}`,
    });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "Video needs Vercel Blob. Connect Storage → picsodianstudios-blob to this project, then redeploy.",
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
