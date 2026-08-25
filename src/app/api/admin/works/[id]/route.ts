import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidateSite } from "@/lib/revalidateSite";

const workSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().optional(),
  category: z.string().min(1).optional(),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  client: z.string().optional(),
  director: z.string().optional(),
  role: z.string().optional(),
  synopsis: z.string().optional(),
  overview: z.string().optional(),
  crew: z.string().optional(),
  thumbnail: z.string().optional(),
  heroImage: z.string().optional(),
  videoUrl: z.string().optional(),
  gallery: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(work);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  try {
    const body = workSchema.parse(await req.json());
    const data = {
      ...body,
      ...(body.slug || body.title
        ? { slug: slugify(body.slug || body.title || "") }
        : {}),
    };
    const work = await prisma.work.update({ where: { id }, data });
    revalidateSite();
    return NextResponse.json(work);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid work data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update work." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  await prisma.work.delete({ where: { id } });
  revalidateSite();
  return NextResponse.json({ ok: true });
}
