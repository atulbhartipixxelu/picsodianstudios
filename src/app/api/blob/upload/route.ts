import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth";
import { blobConfigured } from "@/lib/blob";

export const maxDuration = 60;
export const runtime = "nodejs";

const ALLOWED = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/octet-stream",
];

export async function POST(req: Request) {
  if (!blobConfigured() && !process.env.VERCEL) {
    return NextResponse.json(
      { error: "Cloud storage is not configured." },
      { status: 501 },
    );
  }

  try {
    const body = (await req.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        await requireAdmin();
        return {
          allowedContentTypes: ALLOWED,
          addRandomSuffix: true,
          allowOverwrite: true,
          maximumSizeInBytes: 100 * 1024 * 1024,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const status = (error as Error & { status?: number }).status === 401 ? 401 : 400;
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start cloud upload. Connect Blob to this project and keep BLOB_READ_WRITE_TOKEN for large files.",
      },
      { status },
    );
  }
}
