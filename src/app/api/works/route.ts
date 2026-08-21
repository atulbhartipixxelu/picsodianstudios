import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const works = await prisma.work.findMany({
    where: {
      published: true,
      ...(category && category !== "All" ? { category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
  });

  return NextResponse.json(works.map(serializeWork));
}
