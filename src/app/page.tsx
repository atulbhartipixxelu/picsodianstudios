import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { FilmStrip } from "@/components/home/FilmStrip";
import { HomeClose } from "@/components/home/HomeClose";
import { HomeScrollExperience } from "@/components/home/HomeScrollExperience";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { ShowreelHero } from "@/components/home/ShowreelHero";
import { HeroScrollWrap } from "@/components/layout/HeroScrollWrap";
import { FALLBACK_SHOWREEL } from "@/lib/video";

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
  const reel = (featured.length ? featured : publicWorks).slice(0, 3);
  const heroWork =
    publicWorks.find((w) => w.slug === "the-crew") ?? publicWorks[0] ?? null;

  const showreelUrl = settings?.showreelUrl || FALLBACK_SHOWREEL;
  const showreelPoster =
    settings?.showreelPoster ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80";

  return (
    <>
      {/* 1. Full banner — pehle jaisa, scroll effect se alag */}
      <HeroScrollWrap>
        <ShowreelHero videoUrl={showreelUrl} poster={showreelPoster} />
      </HeroScrollWrap>

      {/* 2. Scroll animation — banner ke baad shuru */}
      <HomeScrollExperience
        works={featured.length ? featured : publicWorks}
        reel={reel}
      />

      <Manifesto still={heroWork?.thumbnail} />
      <FilmStrip works={featured.length ? featured : publicWorks} />
      <FeaturedWork work={heroWork} />
      <ServicesMarquee
        stills={(featured.length ? featured : publicWorks)
          .slice(0, 8)
          .map((w) => w.thumbnail || w.heroImage)
          .filter(Boolean)}
      />
      <HomeClose
        stills={(featured.length ? featured : publicWorks)
          .slice(0, 3)
          .map((w) => w.thumbnail)}
      />
    </>
  );
}
