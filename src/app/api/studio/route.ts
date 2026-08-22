import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });
  return NextResponse.json(
    {
      showreelUrl: settings?.showreelUrl ?? "",
      showreelPoster: settings?.showreelPoster ?? "",
      tagline: settings?.tagline ?? "",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
