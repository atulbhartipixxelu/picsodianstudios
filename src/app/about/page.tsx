import { prisma } from "@/lib/prisma";
import { serializeWork, stillSrc } from "@/lib/utils";
import { AboutExperience } from "@/components/about/AboutExperience";
import { PageReveal } from "@/components/ui/PageReveal";

export const dynamic = "force-dynamic";
export const metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, works] = await Promise.all([
    prisma.setting.findUnique({ where: { id: "studio" } }),
    prisma.work.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    }),
  ]);

  const paragraphs = (settings?.about || "").split("\n\n").filter(Boolean);
  const stills = works
    .map(serializeWork)
    .map((work) => stillSrc(work.heroImage || work.thumbnail))
    .filter(Boolean);

  return (
    <PageReveal>
      <AboutExperience paragraphs={paragraphs} stills={stills} />
    </PageReveal>
  );
}
