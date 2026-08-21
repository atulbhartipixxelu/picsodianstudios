import Link from "next/link";
import type { PublicWork } from "@/lib/utils";

export function FeaturedWork({ work }: { work: PublicWork | null }) {
  if (!work) return null;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      <img
        src={work.heroImage || work.thumbnail}
        alt={work.title}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />

      <div className="relative z-10 grid min-h-[100svh] items-end gap-10 px-4 py-24 md:grid-cols-12 md:px-7">
        <div className="md:col-span-7">
          <p className="micro text-signal">Featured / 03</p>
          <h2 className="display-huge mt-4 text-[14vw] md:text-[8vw]">{work.title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            {work.synopsis}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/work/${work.slug}`}
              data-cursor="Play"
              className="border border-signal bg-signal px-6 py-3 text-ink micro"
            >
              Play case study
            </Link>
            <Link
              href="/work"
              className="border border-paper/30 px-6 py-3 micro"
              data-cursor="Index"
            >
              Full index
            </Link>
          </div>
        </div>
        <div className="micro space-y-4 text-paper/70 md:col-span-4 md:col-start-9">
          <p>/ Overview</p>
          <p className="font-body text-sm leading-relaxed tracking-normal normal-case">
            {work.overview}
          </p>
          <p className="pt-4 text-signal">
            {work.year} · {work.category} · {work.client}
          </p>
        </div>
      </div>
    </section>
  );
}
