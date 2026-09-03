import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serializeWork, type PublicWork } from "@/lib/utils";

export type PublicStudio = {
  showreelUrl: string;
  showreelPoster: string;
  tagline: string;
  about: string;
  email: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  vimeo: string;
};

export const getPublishedWorks = unstable_cache(
  async (): Promise<PublicWork[]> => {
    const works = await prisma.work.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    });
    return works.map((work) => serializeWork(work));
  },
  ["published-works"],
  { revalidate: 60, tags: ["works"] },
);

export const getPublicStudio = unstable_cache(
  async (): Promise<PublicStudio> => {
    const settings = await prisma.setting.findUnique({ where: { id: "studio" } });
    return {
      showreelUrl: settings?.showreelUrl ?? "",
      showreelPoster: settings?.showreelPoster ?? "",
      tagline: settings?.tagline ?? "",
      about: settings?.about ?? "",
      email: settings?.email ?? "",
      instagram: settings?.instagram ?? "",
      twitter: settings?.twitter ?? "",
      linkedin: settings?.linkedin ?? "",
      vimeo: settings?.vimeo ?? "",
    };
  },
  ["public-studio"],
  { revalidate: 60, tags: ["studio"] },
);
