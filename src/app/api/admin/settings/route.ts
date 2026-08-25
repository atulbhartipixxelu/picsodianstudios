import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  showreelUrl: z.string().optional(),
  showreelPoster: z.string().optional(),
  tagline: z.string().optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  vimeo: z.string().optional(),
  about: z.string().optional(),
});

export async function GET() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const settings = await prisma.setting.upsert({
      where: { id: "studio" },
      update: body,
      create: { id: "studio", ...body },
    });
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/banner");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/login");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Could not save settings." }, { status: 400 });
  }
}
