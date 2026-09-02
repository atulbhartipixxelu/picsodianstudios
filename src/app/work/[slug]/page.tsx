import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeWork } from "@/lib/utils";
import { PageReveal } from "@/components/ui/PageReveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { ScrollWords } from "@/components/ui/ScrollWords";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });
  return { title: work?.title ?? "Work" };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await prisma.work.findUnique({ where: { slug } });
  if (!work || !work.published) notFound();

  const parsed = serializeWork(work);
  const others = await prisma.work.findMany({
    where: { published: true, NOT: { id: work.id } },
    orderBy: { sortOrder: "asc" },
    take: 1,
  });
  const next = others[0];

  const isEmbed =
    parsed.videoUrl.includes("youtube.com") ||
    parsed.videoUrl.includes("vimeo.com") ||
    parsed.videoUrl.includes("youtu.be");

  return (
    <PageReveal>
      <article className="relative bg-ink text-paper">
        <header className="relative min-h-[80svh] overflow-hidden">
          <SafeImage
            src={parsed.heroImage || parsed.thumbnail}
            alt={parsed.title}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/25" />
          <div className="relative z-10 flex min-h-[80svh] flex-col justify-end px-4 pb-14 pt-32 md:px-7">
            <p className="micro text-signal">
              {parsed.category} / {parsed.year}
            </p>
            <ScrollWords
              as="h1"
              className="display-huge mt-3 text-[14vw] md:text-[8vw]"
              lines={[parsed.title]}
            />
          </div>
        </header>

        <section className="grid gap-10 px-4 py-16 md:grid-cols-12 md:px-7 md:py-24">
          <div className="md:col-span-7">
            <p className="micro text-signal">/ Synopsis</p>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-paper/85">
              {parsed.synopsis}
            </p>
          </div>
          <dl className="grid content-start gap-6 border-t border-line pt-6 md:col-span-4 md:col-start-9 md:border-t-0 md:pt-0">
            {[
              ["Client", parsed.client],
              ["Director", parsed.director],
              ["Role", parsed.role],
              ["Year", String(parsed.year)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="micro text-mist">{label}</dt>
                <dd className="mt-1 text-paper">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>

        {parsed.videoUrl && (
          <section className="px-4 pb-16 md:px-7">
            <div className="aspect-video overflow-hidden border border-line bg-ink-2">
              {isEmbed ? (
                <iframe
                  src={parsed.videoUrl}
                  title={parsed.title}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={parsed.videoUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </section>
        )}

        {parsed.overview && (
          <section className="border-t border-line px-4 py-16 md:grid md:grid-cols-12 md:px-7 md:py-24">
            <p className="micro text-signal md:col-span-3">/ Overview</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-paper/80 md:col-span-7 md:mt-0">
              {parsed.overview}
            </p>
          </section>
        )}

        {parsed.crew.length > 0 && (
          <section className="border-t border-line px-4 py-16 md:px-7 md:py-24">
            <p className="micro text-signal">/ Behind the curtain</p>
            <ScrollWords
              lines={["The Crew"]}
              className="display-huge mt-3 text-5xl md:text-7xl"
            />
            <ul className="mt-12 grid gap-0 md:grid-cols-2">
              {parsed.crew.map((credit) => (
                <li
                  key={credit.role + credit.name}
                  className="flex justify-between gap-4 border-b border-line py-4"
                >
                  <span className="micro text-mist">{credit.role}</span>
                  <span className="text-right text-paper">{credit.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {parsed.gallery.length > 0 && (
          <section className="grid gap-4 px-4 pb-20 md:grid-cols-2 md:px-7">
            {parsed.gallery.map((src) => (
              <div key={src} className="overflow-hidden border border-paper/10">
                <SafeImage src={src} alt="" className="w-full object-cover" />
              </div>
            ))}
          </section>
        )}

        {next && (
          <Link
            href={`/work/${next.slug}`}
            data-cursor="Next"
            className="group relative flex min-h-[50vh] items-end overflow-hidden border-t border-line"
          >
            <SafeImage
              src={next.thumbnail || next.heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-700 group-hover:scale-105 group-hover:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
            <div className="relative z-10 flex w-full items-end justify-between px-4 py-16 md:px-7">
              <div>
                <p className="micro text-signal">Next project</p>
                <p className="display-huge mt-2 text-5xl md:text-7xl">{next.title}</p>
              </div>
              <span className="micro text-paper transition-colors group-hover:text-blue">
                Open →
              </span>
            </div>
          </Link>
        )}
      </article>
    </PageReveal>
  );
}
