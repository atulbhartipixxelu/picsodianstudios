import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const workSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  category: z.string().min(1),
  year: z.coerce.number().int().min(1990).max(2100),
  client: z.string().optional().default(""),
  director: z.string().optional().default(""),
  role: z.string().optional().default(""),
  synopsis: z.string().optional().default(""),
  overview: z.string().optional().default(""),
  crew: z.string().optional().default("[]"),
  thumbnail: z.string().min(1),
  heroImage: z.string().optional().default(""),
  videoUrl: z.string().optional().default(""),
  gallery: z.string().optional().default("[]"),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

export async function GET() {
  const works = await prisma.work.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(works);
}

export async function POST(req: Request) {
  try {
    const body = workSchema.parse(await req.json());
    const slug = slugify(body.slug || body.title);
    const existing = await prisma.work.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    }
    const work = await prisma.work.create({ data: { ...body, slug } });
    return NextResponse.json(work);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid work data.", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not create work." }, { status: 500 });
  }
}
