import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SafeImage } from "@/components/ui/SafeImage";

export default async function AdminWorksPage() {
  const works = await prisma.work.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
            Works
          </h1>
          <p className="mt-2 text-sm text-white/45">{works.length} projects in the library</p>
        </div>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center gap-2 bg-signal px-5 py-3 text-ink micro"
        >
          <Plus size={14} />
          Add work
        </Link>
      </div>

      <div className="dash-panel mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-white/8">
              <th className="micro px-4 py-4 text-white/40">Work</th>
              <th className="micro px-4 py-4 text-white/40">Category</th>
              <th className="micro px-4 py-4 text-white/40">Year</th>
              <th className="micro px-4 py-4 text-white/40">Status</th>
              <th className="micro px-4 py-4 text-right text-white/40">Action</th>
            </tr>
          </thead>
          <tbody>
            {works.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-white/40">
                  No works yet. Add your first project.
                </td>
              </tr>
            )}
            {works.map((work) => (
              <tr
                key={work.id}
                className="border-b border-white/8 last:border-b-0 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <SafeImage
                      src={work.thumbnail || work.heroImage}
                      alt={work.title}
                      className="h-14 w-20 shrink-0 object-cover"
                    />
                    <span className="font-display text-lg uppercase tracking-tight">
                      {work.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white/55">{work.category}</td>
                <td className="px-4 py-3 text-sm text-white/55">{work.year}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {work.published ? (
                      <span className="bg-signal px-2 py-1 micro text-ink">Live</span>
                    ) : (
                      <span className="border border-white/15 px-2 py-1 micro text-white/50">
                        Draft
                      </span>
                    )}
                    {work.featured && (
                      <span className="border border-white/15 px-2 py-1 micro text-white/70">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/works/${work.id}`}
                    className="inline-flex items-center gap-2 bg-signal px-4 py-2 text-ink micro"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
