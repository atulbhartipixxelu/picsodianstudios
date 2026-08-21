import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { FilmStrip } from "@/components/home/FilmStrip";
import { HomeClose } from "@/components/home/HomeClose";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { ShowreelHero } from "@/components/home/ShowreelHero";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [works, settings] = await Promise.all([
    prisma.work.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    }),
    prisma.setting.findUnique({ where: { id: "studio" } }),
  ]);

  const publicWorks = works.map(serializeWork);
  const featured = publicWorks.filter((w) => w.featured);
  const heroWork =
    publicWorks.find((w) => w.slug === "the-crew") ?? publicWorks[0] ?? null;

  return (
    <>
      <ShowreelHero
        videoUrl={
          settings?.showreelUrl ||
          "https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4"
        }
        poster={
          settings?.showreelPoster ||
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80"
        }
        tagline={
          settings?.tagline ||
          "Creative visual studio. Motion, film, and worlds that stay with you."
        }
      />
      <Manifesto still={heroWork?.thumbnail} />
      <FilmStrip works={featured.length ? featured : publicWorks} />
      <FeaturedWork work={heroWork} />
      <ServicesMarquee />
      <HomeClose
        stills={(featured.length ? featured : publicWorks)
          .slice(0, 3)
          .map((w) => w.thumbnail)}
      />
    </>
  );
}
