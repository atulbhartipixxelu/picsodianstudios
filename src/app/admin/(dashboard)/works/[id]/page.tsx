import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkForm } from "@/components/admin/WorkForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { workIsSelected } from "@/lib/exclusiveSelect";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) notFound();
  const selected = await workIsSelected(work.id);

  return (
    <div>
      <AdminHeader
        kicker="Library"
        title="Edit work"
        description={work.title}
      />
      <div className="max-w-3xl">
        <WorkForm
          id={work.id}
          initial={{
            title: work.title,
            slug: work.slug,
            category: work.category,
            year: work.year,
            client: work.client,
            director: work.director,
            role: work.role,
            synopsis: work.synopsis,
            overview: work.overview,
            crew: work.crew,
            thumbnail: work.thumbnail,
            heroImage: work.heroImage,
            videoUrl: work.videoUrl,
            gallery: work.gallery,
            featured: work.featured,
            selected,
            published: work.published,
            sortOrder: work.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
