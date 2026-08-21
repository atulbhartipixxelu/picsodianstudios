import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  company: z.string().max(120).optional().default(""),
  projectType: z.string().max(80).optional().default(""),
  budget: z.string().max(80).optional().default(""),
  message: z.string().min(10).max(4000),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const enquiry = await prisma.enquiry.create({ data: body });
    return NextResponse.json({ ok: true, id: enquiry.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not send enquiry." }, { status: 500 });
  }
}
