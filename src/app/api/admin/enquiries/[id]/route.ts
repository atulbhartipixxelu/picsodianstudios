import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  try {
    const body = schema.parse(await req.json());
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(enquiry);
  } catch {
    return NextResponse.json({ error: "Could not update enquiry." }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  await prisma.enquiry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
