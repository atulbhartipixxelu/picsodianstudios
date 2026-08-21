import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const work = await prisma.work.findUnique({ where: { slug } });
  if (!work || !work.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(serializeWork(work));
}
