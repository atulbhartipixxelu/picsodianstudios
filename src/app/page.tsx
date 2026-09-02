import { getPublishedWorks, getPublicStudio } from "@/lib/public-data";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { HomeClose } from "@/components/home/HomeClose";
import { HomeScrollExperience } from "@/components/home/HomeScrollExperience";
import { Manifesto } from "@/components/home/Manifesto";
import { ShowreelHero } from "@/components/home/ShowreelHero";
import { HomeShowreelStage } from "@/components/home/HomeShowreelStage";
import { HeroScrollWrap } from "@/components/layout/HeroScrollWrap";
import { FALLBACK_BACKDROP, FALLBACK_SHOWREEL } from "@/lib/video";

export const revalidate = 60;

export default async function HomePage() {
  const [publicWorks, settings] = await Promise.all([
    getPublishedWorks(),
    getPublicStudio(),
  ]);
  const featured = publicWorks.filter((w) => w.featured);
  const reel = (featured.length ? featured : publicWorks).slice(0, 3);
  const pinnedReel = reel.slice(0, 1);
  const restReel = reel.slice(1);
  const heroWork =
    publicWorks.find((w) => w.slug === "the-crew") ?? publicWorks[0] ?? null;

  const showreelUrl = settings.showreelUrl || FALLBACK_SHOWREEL;
  const showreelPoster =
    settings.showreelPoster ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80";

  return (
    <>
      <HomeShowreelStage videoUrl={FALLBACK_BACKDROP}>
        <HeroScrollWrap>
          <ShowreelHero videoUrl={showreelUrl} poster={showreelPoster} />
        </HeroScrollWrap>
        <HomeScrollExperience
          works={featured.length ? featured : publicWorks}
          reel={pinnedReel}
        />
      </HomeShowreelStage>

      <HomeScrollExperience
        works={featured.length ? featured : publicWorks}
        reel={restReel}
        showIntro={false}
        startIndex={1}
        solid
      />

      <Manifesto still={heroWork?.thumbnail} />
      <FeaturedWork work={heroWork} />
      <HomeClose
        stills={(featured.length ? featured : publicWorks)
          .slice(0, 3)
          .map((w) => w.thumbnail)}
      />
    </>
  );
}
