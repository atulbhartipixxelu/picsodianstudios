import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function SettingsPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });

  return (
    <div>
      <AdminHeader
        kicker="Studio"
        title="Settings"
        description="Studio copy, contact email, and social links. Banner video is on the Banner page."
      />
      <SettingsForm
        initial={{
          tagline: settings?.tagline ?? "",
          email: settings?.email ?? "",
          instagram: settings?.instagram ?? "",
          twitter: settings?.twitter ?? "",
          vimeo: settings?.vimeo ?? "",
          about: settings?.about ?? "",
        }}
      />
    </div>
  );
}
