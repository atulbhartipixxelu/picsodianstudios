import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SafeImage } from "@/components/ui/SafeImage";
import { SelectWorkButton } from "@/components/admin/SelectWorkButton";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { selectedByWorkId } from "@/lib/exclusiveSelect";

export default async function AdminWorksPage() {
  const [works, selectedMap] = await Promise.all([
    prisma.work.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    selectedByWorkId(),
  ]);

  return (
    <div>
      <AdminHeader
        kicker="Library"
        title="Works"
        description={`${works.length} project${works.length === 1 ? "" : "s"} in the library`}
        action={
          <Link href="/admin/works/new" className="dash-btn">
            <Plus size={14} />
            Add work
          </Link>
        }
      />

      <div className="dash-panel overflow-x-auto">
        <table className="dash-table">
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
            {works.map((work) => {
              const selected = selectedMap.get(work.id) ?? false;
              return (
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
                      <span className="dash-work-name">{work.title}</span>
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
                      {selected && (
                        <span className="bg-signal px-2 py-1 micro text-ink">
                          Work page
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <SelectWorkButton id={work.id} selected={selected} />
                      <Link
                        href={`/admin/works/${work.id}`}
                        className="dash-btn dash-btn-ghost"
                      >
                        <Pencil size={12} />
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
