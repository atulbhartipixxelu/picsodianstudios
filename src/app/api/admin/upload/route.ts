import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function allowedFile(file: File) {
  if (ALLOWED.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return [".mp4", ".webm", ".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) =>
    name.endsWith(ext),
  );
}

export async function POST(req: Request) {
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

  const ext = path.extname(file.name) || (file.type.startsWith("video") ? ".mp4" : ".jpg");
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`.replace(/\s+/g, "-");
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safe), buffer);

  return NextResponse.json({ url: `/uploads/${safe}` });
}
