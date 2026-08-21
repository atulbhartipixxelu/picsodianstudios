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
        Showreel, studio copy, and contact email. Homepage banner video lives here.
      </p>
      <SettingsForm
        initial={{
          showreelUrl: settings?.showreelUrl ?? "",
          showreelPoster: settings?.showreelPoster ?? "",
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
