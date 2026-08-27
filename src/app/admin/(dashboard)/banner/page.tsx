import { prisma } from "@/lib/prisma";
import { BannerVideoManager } from "@/components/admin/BannerVideoManager";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function BannerPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });

  return (
    <div>
      <AdminHeader
        kicker="Homepage"
        title="Banner video"
        description="Upload a showreel from your computer. It appears on the homepage banner and login screen."
      />
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
