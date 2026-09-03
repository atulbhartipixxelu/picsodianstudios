"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PublicWork } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { PageReveal } from "@/components/ui/PageReveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { isDirectVideo } from "@/lib/video";

const FILTER_EASE = [0.14, 1, 0.34, 1] as const;
const SPAN_CYCLE = [5, 4, 3, 3, 3, 9, 4, 5, 3, 3, 3, 9] as const;

function WorkTile({
  work,
  index,
  span,
}: {
  work: PublicWork;
  index: number;
  span: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip =
    work.videoUrl && isDirectVideo(work.videoUrl) ? work.videoUrl : null;
  const still = work.heroImage || work.thumbnail;
  const credit = work.director || work.client || "Studio";
  const blurb = work.synopsis || work.overview || "";

  function play() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
  }

  function stop() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  return (
    <li className={cn("work-tile", `work-tile--${span}`)}>
      <Link
        href={`/work/${work.slug}`}
        data-cursor="View case study"
        className="work-tile-link"
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
      >
        <div className="work-tile-top">
          <p>
            <span className="work-tile-dot" />
            <em>Type</em>
            <i>/</i>
            <strong>
              {work.selected ? "Selected / " : ""}
              {work.category || "Work"}
            </strong>
          </p>
          <p>
            <span className="work-tile-dot" />
            <em>{work.director ? "Director" : "Client"}</em>
            <i>/</i>
            <strong>{credit}</strong>
          </p>
        </div>

        <figure className="work-tile-fig">
          <SafeImage src={still} alt={work.title} className="work-tile-still" />
          {clip ? (
            <video
              ref={videoRef}
              className="work-tile-clip"
              src={clip}
              poster={still}
              muted
              loop
              playsInline
              preload="none"
            />
          ) : null}
        </figure>

        <div className="work-tile-bot">
          <p className="work-tile-title">{work.title}</p>
          {blurb ? <p className="work-tile-lede">{blurb}</p> : null}
          <p className="work-tile-no">
            {String(index + 1).padStart(2, "0")}
            <em>/</em>
            {String(work.year).slice(-2)}
          </p>
        </div>
      </Link>
    </li>
  );
}

function FilterShot({
  work,
  index,
}: {
  work: PublicWork;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const clip =
    work.videoUrl && isDirectVideo(work.videoUrl) ? work.videoUrl : null;
  const still = work.heroImage || work.thumbnail;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => {});
    return () => {
      video.pause();
    };
  }, [clip]);

  return (
    <figure className={cn("work-filter-shot", `is-${index}`)}>
      <div className="work-filter-shot-media">
        <SafeImage src={still} alt="" className="work-filter-shot-img" />
        {clip ? (
          <video
            ref={videoRef}
            className="work-filter-shot-clip"
            src={clip}
            poster={still}
            muted
            loop
            playsInline
            autoPlay
          />
        ) : null}
      </div>
      <figcaption>{work.title}</figcaption>
    </figure>
  );
}

export function WorkIndex({
  works,
  selected,
}: {
  works: PublicWork[];
  selected: PublicWork | null;
}) {
  const filters = useMemo(() => {
    const cats = [...new Set(works.map((work) => work.category).filter(Boolean))];
    return ["All", ...cats];
  }, [works]);

  const [filter, setFilter] = useState("All");
  const [tray, setTray] = useState(false);
  const lenis = useLenis();

  const ordered = useMemo(() => {
    if (!selected) return works;
    return [selected, ...works.filter((work) => work.id !== selected.id)];
  }, [works, selected]);

  const visible = useMemo(() => {
    if (filter === "All") return ordered;
    return ordered.filter((work) => work.category === filter);
  }, [filter, ordered]);

  const filterCount = (item: string) =>
    item === "All"
      ? works.length
      : works.filter((work) => work.category === item).length;

  const panelFilters = useMemo(
    () => [filter, ...filters.filter((item) => item !== filter)],
    [filter, filters],
  );

  const previewWorks = ordered.slice(0, 2);

  function closeTray() {
    setTray(false);
  }

  function pickFilter(item: string) {
    setFilter(item);
    setTray(false);
  }

  useEffect(() => {
    const html = document.documentElement;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setTray(false);
    }

    if (tray) {
      lenis?.stop();
      html.classList.add("is-filters-lock");
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
      return () => {
        lenis?.start();
        html.classList.remove("is-filters-lock");
        html.style.overflow = "";
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }

    lenis?.start();
    html.classList.remove("is-filters-lock");
    html.style.overflow = "";
    document.body.style.overflow = "";
  }, [tray, lenis]);

  return (
    <PageReveal>
      <div
        className={cn("work-page", tray && "is-filters-open")}
        data-cursor-surface="paper"
      >
        <div className="work-filters">
          <button
            type="button"
            data-cursor="Filter"
            className="work-filters-toggle"
            onClick={() => setTray((open) => !open)}
            aria-expanded={tray}
            aria-controls="work-filter-panel"
          >
            {filter}
            <small>[{String(filterCount(filter)).padStart(2, "0")}]</small>
            <svg
              className="work-filters-arrow"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 75 87"
              aria-hidden
            >
              <path d="M74.25 43.5 0 86.366V.631z" />
            </svg>
          </button>

          <AnimatePresence>
            {tray ? (
              <motion.div
                key="work-filter-panel"
                id="work-filter-panel"
                className="work-filters-panel"
                initial={{ x: "-10%", y: "115%", rotate: 8 }}
                animate={{ x: 0, y: 0, rotate: 0 }}
                exit={{ x: "-10%", y: "115%", rotate: 8 }}
                transition={{ duration: 0.8, ease: FILTER_EASE }}
              >
                <ul className="work-filters-list">
                  {panelFilters.map((item, i) => {
                    const count = filterCount(item);
                    return (
                      <li
                        key={item}
                        className={cn("work-filters-item", i === 0 && "is-ghost")}
                      >
                        <button
                          type="button"
                          data-cursor="Filter"
                          className="work-filters-name"
                          onClick={() => pickFilter(item)}
                          tabIndex={i === 0 ? -1 : 0}
                        >
                          {item}
                          <small>[{String(count).padStart(2, "0")}]</small>
                        </button>
                        {i < panelFilters.length - 1 ? (
                          <span className="work-filters-slash">/</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {tray ? (
            <button
              type="button"
              data-cursor="Close"
              className="work-filters-close"
              onClick={closeTray}
            >
              <span />
              Close
            </button>
          ) : null}
        </div>

        <div className="work-filters-acetate" aria-hidden />

        {tray && previewWorks.length > 0 ? (
          <div className="work-filter-back" aria-hidden>
            <div className="work-filter-row">
              {previewWorks.map((work, i) => (
                <FilterShot key={work.id} work={work} index={i} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="work-stage">
          {visible.length === 0 ? (
            <p className="work-empty">No cuts in this tray.</p>
          ) : (
            <ul className="work-grid">
              {visible.map((work, i) => (
                <WorkTile
                  key={work.id}
                  work={work}
                  index={i}
                  span={SPAN_CYCLE[i % SPAN_CYCLE.length]}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageReveal>
  );
}
