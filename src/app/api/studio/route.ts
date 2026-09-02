import { NextResponse } from "next/server";
import { getPublicStudio } from "@/lib/public-data";

export const revalidate = 60;

export async function GET() {
  const settings = await getPublicStudio();
  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
