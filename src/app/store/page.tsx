import { ComingSoon } from "@/components/ui/ComingSoon";
import { PageReveal } from "@/components/ui/PageReveal";
import { getPublicStudio } from "@/lib/public-data";
import { FALLBACK_BACKDROP, FALLBACK_SHOWREEL } from "@/lib/video";

export const revalidate = 60;
export const metadata = { title: "Store" };

export default async function StorePage() {
  const studio = await getPublicStudio();

  return (
    <PageReveal>
      <ComingSoon
        kind="store"
        videoUrl={studio.showreelUrl || FALLBACK_BACKDROP || FALLBACK_SHOWREEL}
      />
    </PageReveal>
  );
}
