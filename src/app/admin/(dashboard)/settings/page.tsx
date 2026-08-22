import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
        Settings
      </h1>
      <p className="mt-2 text-sm text-white/45">
        Studio copy and contact email. Banner video is on the Banner page.
      </p>
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
