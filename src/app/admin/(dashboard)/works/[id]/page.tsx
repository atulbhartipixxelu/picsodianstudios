import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WorkForm } from "@/components/admin/WorkForm";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) notFound();

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
        Edit work
      </h1>
      <p className="mt-2 text-sm text-white/45">{work.title}</p>
      <div className="mt-8 max-w-3xl">
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
            published: work.published,
            sortOrder: work.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
