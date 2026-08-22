"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PublicWork } from "@/lib/utils";
import { FilmFrame } from "@/components/ui/FilmFrame";
import { PageReveal } from "@/components/ui/PageReveal";
import { ScrollWords } from "@/components/ui/ScrollWords";

const FILTERS = ["All", "2D", "Motion", "Film", "Character", "3D"];

export function WorkIndex({ works }: { works: PublicWork[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [mode, setMode] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<PublicWork | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const visible = useMemo(() => {
    if (filter === "All") return works;
    return works.filter((w) => w.category === filter);
  }, [filter, works]);

  const names = works.map((w) => w.title).join("  ·  ") + "  ·  ";
  const marquee = names + names;

  return (
    <PageReveal>
      <div className="relative z-10 min-h-screen bg-ink text-paper">
        <section className="px-4 pt-28 pb-6 md:px-7 md:pt-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="micro text-signal"
              >
                Index / Work
              </motion.p>
              <ScrollWords
                as="h1"
                className="display-huge mt-3 text-[16vw] md:text-[8vw]"
                lines={[`The work [${String(visible.length).padStart(2, "0")}]`]}
                accent={(word) => word.startsWith("[")}
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="micro flex items-center gap-4 text-mist"
            >
              <button
                onClick={() => setMode("grid")}
                className={cn(mode === "grid" ? "text-signal" : "hover:text-paper")}
              >
                Grid
              </button>
              <span>/</span>
              <button
                onClick={() => setMode("list")}
                className={cn(mode === "list" ? "text-signal" : "hover:text-paper")}
              >
                List
              </button>
              <span>/</span>
              <button onClick={() => setFilter("All")} className="hover:text-signal">
                Reset
              </button>
            </motion.div>
          </div>
        </section>

        <div className="work-marquee mb-4 border-y border-white/8 py-2">
          <p className="work-marquee-track micro text-white/25">{marquee}</p>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2 px-4 py-4 md:px-7">
          {FILTERS.map((item, i) => (
            <motion.span
              key={item}
              className="flex items-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <button
                onClick={() => setFilter(item)}
                data-cursor="Filter"
                className={cn(
                  "relative px-2 py-1 micro transition-colors",
                  filter === item ? "text-signal" : "text-mist hover:text-paper",
                )}
              >
                {filter === item && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-x-1 -bottom-0.5 h-px bg-signal"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {item} [
                {item === "All"
                  ? works.length
                  : works.filter((w) => w.category === item).length}
                ]
              </button>
              {i < FILTERS.length - 1 && <span className="text-line">/</span>}
            </motion.span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === "grid" ? (
            <motion.section
              key={`grid-${filter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 px-4 pb-28 sm:grid-cols-2 lg:grid-cols-3 md:px-7"
            >
              {visible.map((work, i) => (
                <FilmFrame
                  key={work.id}
                  work={work}
                  index={i}
                  href={`/work/${work.slug}`}
                />
              ))}
            </motion.section>
          ) : (
            <motion.section
              key={`list-${filter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative px-4 pb-28 md:px-7"
              onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setPreview(null)}
            >
              <div className="micro hidden grid-cols-12 border-b border-line py-3 text-mist md:grid">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Title</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2">Director</span>
                <span className="col-span-2 text-right">Year</span>
              </div>
              {visible.map((work, i) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <Link
                    href={`/work/${work.slug}`}
                    data-cursor="Open"
                    onMouseEnter={() => setPreview(work)}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/work/${work.slug}`);
                    }}
                    className="group relative z-10 flex items-baseline justify-between gap-4 border-b border-line py-5 md:grid md:grid-cols-12 md:items-center"
                  >
                    <span className="micro hidden text-mist md:col-span-1 md:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-2 group-hover:text-signal md:col-span-5 md:text-3xl">
                      {work.title}
                    </span>
                    <span className="micro hidden text-mist md:col-span-2 md:block">
                      {work.category}
                    </span>
                    <span className="micro hidden text-mist md:col-span-2 md:block">
                      {work.director || "—"}
                    </span>
                    <span className="micro shrink-0 text-signal md:col-span-2 md:text-right">
                      {work.year}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="pointer-events-none fixed top-0 left-0 z-40 hidden w-72 overflow-hidden border border-signal/70 md:block"
                animate={{
                  x: cursor.x + 28,
                  y: cursor.y - 90,
                  opacity: preview ? 1 : 0,
                  scale: preview ? 1 : 0.86,
                  rotate: preview ? -4 : 8,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.6 }}
              >
                {preview ? (
                  <img
                    src={preview.thumbnail}
                    alt={preview.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : null}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </PageReveal>
  );
}
