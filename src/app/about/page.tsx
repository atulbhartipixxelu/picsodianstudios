import { getPublishedWorks, getPublicStudio } from "@/lib/public-data";
import { stillSrc } from "@/lib/utils";
import { AboutExperience } from "@/components/about/AboutExperience";
import { PageReveal } from "@/components/ui/PageReveal";
import { FALLBACK_SHOWREEL } from "@/lib/video";

export const revalidate = 60;
export const metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, works] = await Promise.all([
    getPublicStudio(),
    getPublishedWorks(),
  ]);

  const paragraphs = (settings.about || "").split("\n\n").filter(Boolean);
  const stills = works
    .map((work) => stillSrc(work.heroImage || work.thumbnail))
    .filter(Boolean);

  return (
    <PageReveal>
      <AboutExperience
        paragraphs={paragraphs}
        stills={stills}
        showreelUrl={settings.showreelUrl || FALLBACK_SHOWREEL}
        showreelPoster={settings.showreelPoster || stills[0]}
      />
    </PageReveal>
  );
}
