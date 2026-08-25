import { createReadStream, existsSync, readFileSync } from "node:fs";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

async function main() {
  loadEnv();

  const file = "public/works/advance-motion-graphics.mp4";
  if (!existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN missing. In Vercel: Storage → picsodianstudios-blob → connect to this project, then `vercel env pull`.",
    );
  }

  console.log("Uploading Advance Motion Graphics (this can take a few minutes)...");

  const blob = await put("works/advance-motion-graphics.mp4", createReadStream(file), {
    access: "public",
    multipart: true,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "video/mp4",
  });

  const prisma = new PrismaClient();
  try {
    await prisma.work.updateMany({
      where: { slug: "advance-motion-graphics" },
      data: { videoUrl: blob.url },
    });
  } finally {
    await prisma.$disconnect();
  }

  console.log("\nPublic URL:\n", blob.url);
  console.log("\nSaved on the Advance Motion Graphics work.");
  console.log("Also set NEXT_PUBLIC_AMG_VIDEO_URL to this URL on Vercel, then redeploy.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
