import { prisma } from "@/lib/prisma";
import { BannerVideoManager } from "@/components/admin/BannerVideoManager";

export default async function BannerPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
        Banner video
      </h1>
      <p className="mt-2 text-sm text-white/45">
        Upload a showreel from your computer. It appears on the homepage banner and login screen.
      </p>
      <BannerVideoManager
        variant="full"
        initial={{
          showreelUrl: settings?.showreelUrl ?? "",
          showreelPoster: settings?.showreelPoster ?? "",
        }}
      />
    </div>
  );
}
