import type { ReactNode } from "react";
import Link from "next/link";
import { Clapperboard, Inbox, Plus, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default async function AdminHomePage() {
  const [works, enquiries, unread, recentWorks, allWorks] = await Promise.all([
    prisma.work.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.work.findMany({
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.work.findMany({
      select: { category: true, year: true },
    }),
  ]);

  const categoryMap = new Map<string, number>();
  const yearMap = new Map<number, number>();
  for (const work of allWorks) {
    categoryMap.set(work.category, (categoryMap.get(work.category) ?? 0) + 1);
    yearMap.set(work.year, (yearMap.get(work.year) ?? 0) + 1);
  }

  const byCategory = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const currentYear = new Date().getFullYear();
  const years = [...yearMap.keys()];
  const startYear = Math.max(
    years.length ? Math.min(...years) : currentYear - 4,
    currentYear - 5,
  );
  const endYear = Math.max(currentYear, ...years, startYear);
  const byYear = [];
  for (let year = startYear; year <= endYear; year++) {
    byYear.push({ label: String(year), value: yearMap.get(year) ?? 0 });
  }

  const recent = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
            Overview
          </h1>
          <p className="mt-2 text-sm text-white/45">
            Studio pulse — work, enquiries, and what&apos;s live.
          </p>
        </div>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center gap-2 bg-signal px-5 py-3 text-ink micro"
        >
          <Plus size={14} />
          Add work
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Works"
          value={works}
          href="/admin/works"
          icon={<Clapperboard size={18} />}
          note="Published + drafts"
        />
        <Stat
          label="Enquiries"
          value={enquiries}
          href="/admin/enquiries"
          icon={<Inbox size={18} />}
          note="All time"
        />
        <Stat
          label="New"
          value={unread}
          href="/admin/enquiries"
          icon={<Sparkles size={18} />}
          note="Unread messages"
          accent
        />
      </div>

      <DashboardCharts byCategory={byCategory} byYear={byYear} />

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Latest enquiries
          </h2>
          <div className="mt-4 overflow-hidden border border-white/10 bg-[#101014]">
            {recent.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-white/40">No enquiries yet.</p>
                <p className="micro mt-2 text-white/25">
                  Contact form submissions will land here.
                </p>
              </div>
            ) : (
              <ul>
                {recent.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="mt-0.5 text-sm text-white/40">
                        {item.email}
                        {item.projectType ? ` · ${item.projectType}` : ""}
                      </p>
                    </div>
                    <span
                      className={
                        item.status === "new"
                          ? "micro bg-signal px-2 py-1 text-ink"
                          : "micro text-white/40"
                      }
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            Recent work
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recentWorks.map((work) => (
              <Link
                key={work.id}
                href={`/admin/works/${work.id}`}
                className="group overflow-hidden border border-white/10 bg-[#101014]"
              >
                <img
                  src={work.thumbnail}
                  alt={work.title}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="px-3 py-3">
                  <p className="truncate text-sm">{work.title}</p>
                  <p className="micro mt-1 text-white/35">
                    {work.category} · {work.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  icon,
  note,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  icon: ReactNode;
  note: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="dash-card group block p-6"
    >
      <div className="flex items-center justify-between">
        <p className="micro text-white/40">{label}</p>
        <span className={accent ? "text-signal" : "text-white/30"}>{icon}</span>
      </div>
      <p className="font-display mt-4 text-5xl tracking-tight md:text-6xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-3 text-sm text-white/35">{note}</p>
    </Link>
  );
}
