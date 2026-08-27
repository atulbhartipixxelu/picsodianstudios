"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PublicWork } from "@/lib/utils";
import { PageReveal } from "@/components/ui/PageReveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { SelectedWork } from "@/components/work/SelectedWork";

const FILTERS = ["All", "2D", "Motion", "Film", "Character", "3D"];
const TITLE = "THE WORK";

function useReelCount(target: number) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }

    setN(0);
    if (target <= 0) return;

    let current = 0;
    const id = window.setInterval(() => {
      current += 1;
      setN(current);
      if (current >= target) window.clearInterval(id);
    }, 55);

    return () => window.clearInterval(id);
  }, [target]);

  return n;
}

export function WorkIndex({
  works,
  selected,
}: {
  works: PublicWork[];
  selected: PublicWork | null;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [activeId, setActiveId] = useState<string | null>(selected?.id ?? null);

  const visible = useMemo(() => {
    if (filter === "All") return works;
    return works.filter((w) => w.category === filter);
  }, [filter, works]);

  const active = visible.find((w) => w.id === activeId) ?? visible[0] ?? null;
  const reel = useReelCount(visible.length);

  useEffect(() => {
    const pick =
      visible.find((w) => w.id === selected?.id) ?? visible[0] ?? null;
    setActiveId(pick?.id ?? null);
  }, [filter, selected?.id]);

  const names = works.map((w) => w.title).join("  ·  ") + "  ·  ";
  const marquee = names + names;

  return (
    <PageReveal>
      <div className="relative z-10 min-h-screen bg-ink text-paper">
        <section className="work-hero">
          <div className="work-fx" aria-hidden>
            <div className="work-fx-wash" />
            <span className="work-fx-scan" />
            <span className="work-fx-bar" />
            <span className="work-fx-dust" />
            <span className="work-fx-dust work-fx-dust-2" />
            <span className="work-fx-dust work-fx-dust-3" />
            <span className="work-fx-dust work-fx-dust-4" />
          </div>

          <div className="work-hero-top">
            <p className="micro text-signal">Index / Work</p>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
              onClick={() => setFilter("All")}
              className="micro text-mist hover:text-signal"
            >
              Reset
            </motion.button>
          </div>

          <div className="work-hero-row">
            <h1 className="work-hero-title">
              {TITLE.split("").map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  className="work-gate"
                  style={{ animationDelay: `${0.08 + i * 0.06}s` }}
                >
                  <span>{ch === " " ? "\u00A0" : ch}</span>
                </span>
              ))}
              <span
                className="work-gate work-hero-count"
                style={{ animationDelay: "0.72s" }}
              >
                <span> [{String(reel).padStart(2, "0")}]</span>
              </span>
            </h1>
            <motion.p
              className="work-hero-lede"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
            >
              Pictures with a pulse. Hover a title, open the cut.
            </motion.p>
          </div>
        </section>

        {selected ? <SelectedWork work={selected} /> : null}

        <div className="work-marquee border-y border-white/8 py-2.5">
          <p className="work-marquee-track micro text-white/25">{marquee}</p>
        </div>

        <div className="work-trays">
          <p className="micro text-mist">Filter / Tray</p>
          <div className="work-trays-row">
            {FILTERS.map((item, i) => {
              const count =
                item === "All"
                  ? works.length
                  : works.filter((w) => w.category === item).length;
              const on = filter === item;

              return (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  data-cursor="Filter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className={cn("work-tray", on && "is-on")}
                >
                  {on ? (
                    <motion.span
                      layoutId="work-tray-fill"
                      className="work-tray-fill"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  ) : null}
                  <span className="work-tray-name">{item}</span>
                  <span className="work-tray-count">
                    {String(count).padStart(2, "0")}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={`board-${filter}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="work-board"
          >
            {visible.length === 0 || !active ? (
              <p className="px-4 py-24 text-center text-sm text-mist md:px-7">
                No cuts in this tray.
              </p>
            ) : (
              <>
                <div className="work-board-stage">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="work-board-frame"
                    >
                      <SafeImage
                        src={active.thumbnail || active.heroImage}
                        alt={active.title}
                        className="work-board-still"
                      />
                      <span className="work-scan" />
                      <div className="work-board-meta">
                        <p className="micro text-paper/80">
                          {active.category} / {active.year}
                        </p>
                        <p className="work-board-name">{active.title}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <ol className="work-board-list">
                  {visible.map((work, i) => {
                    const on = work.id === active.id;
                    return (
                      <li key={work.id}>
                        <Link
                          href={`/work/${work.slug}`}
                          data-cursor="View"
                          className={cn("work-board-row", on && "is-on")}
                          onMouseEnter={() => setActiveId(work.id)}
                          onFocus={() => setActiveId(work.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/work/${work.slug}`);
                          }}
                        >
                          <span className="work-board-idx">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="work-board-title">{work.title}</span>
                          <span className="work-board-cat">{work.category}</span>
                          <span className="work-board-year">{work.year}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </PageReveal>
  );
}
