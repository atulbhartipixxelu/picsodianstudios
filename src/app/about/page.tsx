import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageReveal } from "@/components/ui/PageReveal";
import { ScrollWords } from "@/components/ui/ScrollWords";

export const dynamic = "force-dynamic";
export const metadata = { title: "About" };

const CAPABILITIES = [
  "2D Animation",
  "Motion Graphics",
  "Character & Creature",
  "Prop Animation",
  "Film Production",
  "Lookdev / Compositing",
];

const VALUES = [
  {
    n: "01",
    t: "Feel it",
    d: "We don't just perform. We connect — energy first, polish always. Every frame should make you part of the experience.",
  },
  {
    n: "02",
    t: "Chase the next",
    d: "We explore, evolve, and refuse to repeat yesterday's trick. The intent is simple: be better than yesterday.",
  },
  {
    n: "03",
    t: "Stay fearless",
    d: "Work that shakes systems, breaks patterns, and stays with you. Mind-blowing, fresh, and undeniably cool.",
  },
];

export default async function AboutPage() {
  const settings = await prisma.setting.findUnique({ where: { id: "studio" } });
  const paragraphs = (settings?.about || "").split("\n\n").filter(Boolean);

  return (
    <PageReveal>
      <div className="relative bg-ink text-paper">
        <section className="px-4 pt-28 pb-16 md:px-7 md:pt-32 md:pb-24">
          <p className="micro text-signal">Studio / About</p>
          <ScrollWords
            as="h1"
            className="display-huge mt-4 max-w-5xl text-[12vw] md:text-[7vw]"
            lines={["Built around ideas,", "motion, and people", "who care."]}
          />
        </section>

        <section className="grid gap-12 px-4 pb-24 md:grid-cols-12 md:px-7">
          <div className="space-y-6 text-lg leading-relaxed text-paper/75 md:col-span-7">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <p className="micro text-mist">Inquiries</p>
            <a
              href="mailto:creatives@picsodianstudios.com"
              className="mt-3 block text-signal"
              data-cursor="Mail"
            >
              creatives@picsodianstudios.com
            </a>
            <p className="micro mt-10 text-mist">Collective</p>
            <p className="mt-3 text-paper/70">
              Artists from around the world, united by one vision: tell powerful
              stories and create visuals that are undeniably cool.
            </p>
          </aside>
        </section>

        <section className="border-t border-line px-4 py-20 md:px-7">
          <p className="micro text-signal">Capabilities / 02</p>
          <ScrollWords
            lines={["What we make"]}
            className="display-huge mt-3 text-5xl md:text-7xl"
          />
          <ul className="mt-12 grid gap-px border border-line md:grid-cols-3">
            {CAPABILITIES.map((item, i) => (
              <li
                key={item}
                className="flex items-center justify-between bg-ink-2 px-5 py-6"
              >
                <span className="font-display text-xl uppercase tracking-tight">
                  {item}
                </span>
                <span className="micro text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid border-t border-line md:grid-cols-3">
          {VALUES.map((item) => (
            <div
              key={item.n}
              className="border-b border-line px-4 py-14 md:border-r md:border-b-0 md:px-8 last:md:border-r-0"
            >
              <p className="micro text-signal">{item.n}</p>
              <h3 className="font-display mt-4 text-3xl uppercase tracking-tight">
                {item.t}
              </h3>
              <p className="mt-4 max-w-sm text-paper/65">{item.d}</p>
            </div>
          ))}
        </section>

        <section className="px-4 py-24 md:px-7">
          <p className="micro text-signal">Next / 03</p>
          <ScrollWords
            className="display-huge mt-4 max-w-4xl text-[10vw] md:text-[6vw]"
            lines={["Let's make something", "that stays."]}
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/work"
              data-cursor="Work"
              className="border border-paper/30 px-6 py-3 micro"
            >
              See the work
            </Link>
            <Link
              href="/contact"
              data-cursor="Enquire"
              className="border border-signal bg-signal px-6 py-3 text-ink micro"
            >
              Start a project
            </Link>
          </div>
        </section>
      </div>
    </PageReveal>
  );
}
