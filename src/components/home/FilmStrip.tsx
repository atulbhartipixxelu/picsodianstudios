"use client";

import Link from "next/link";
import { useState } from "react";
import { cn, type PublicWork } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";

export function FilmStrip({ works }: { works: PublicWork[] }) {
  const items = works.slice(0, 6);
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  if (!items.length || !current) return null;

  return (
    <section className="strip-root">
      <div className="strip-inner">
        <div className="strip-head">
          <p className="micro text-signal">Latest works / 02</p>
          <Link
            href="/work"
            className="micro text-paper/70 hover:text-paper"
            data-cursor="Index"
          >
            All work →
          </Link>
        </div>

        <div className="strip-layout">
          <h2 className="strip-title">
            <span>On the</span>
            <span>strip</span>
          </h2>

          <ol className="strip-index">
            {items.map((work, i) => (
              <li key={work.id}>
                <Link
                  href={`/work/${work.slug}`}
                  data-cursor="View"
                  data-no-magnet
                  className={cn("strip-row", i === active && "is-on")}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="strip-row-idx">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="strip-row-name">{work.title}</span>
                  <span className="strip-row-year">{work.year}</span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href={`/work/${current.slug}`}
            data-cursor="View"
            data-no-magnet
            className="strip-frame"
          >
            <span className="strip-corner strip-corner-tl" />
            <span className="strip-corner strip-corner-tr" />
            <span className="strip-corner strip-corner-bl" />
            <span className="strip-corner strip-corner-br" />

            <div className="strip-plates">
              {items.map((work, i) => (
                <div
                  key={work.id}
                  className={cn("strip-plate", i === active && "is-on")}
                >
                  <SafeImage
                    src={work.thumbnail || work.heroImage}
                    alt={work.title}
                    className="strip-photo"
                  />
                </div>
              ))}
            </div>

            <div className="strip-frame-meta">
              <p className="micro text-paper/80">
                {String(active + 1).padStart(2, "0")} / {current.category}
              </p>
              <p className="micro text-paper/80">View cut →</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
