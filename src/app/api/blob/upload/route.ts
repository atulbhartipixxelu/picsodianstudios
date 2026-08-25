import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth";

export const maxDuration = 60;

const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
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
          maximumSizeInBytes: 100 * 1024 * 1024,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const status = (error as Error & { status?: number }).status === 401 ? 401 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload token failed." },
      { status },
    );
  }
}
