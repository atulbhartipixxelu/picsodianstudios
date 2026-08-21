"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export type ChartSlice = { label: string; value: number };

const COLORS = ["#ff4444", "#ff6a3d", "#efeae2", "#9a958c", "#c45c5c", "#6b6560"];

export function DashboardCharts({
  byCategory,
  byYear,
}: {
  byCategory: ChartSlice[];
  byYear: ChartSlice[];
}) {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-2">
      <section className="dash-panel p-6 md:p-7">
        <p className="micro text-white/40">Library mix</p>
        <h2 className="font-display mt-2 text-2xl uppercase tracking-tight">
          Works by category
        </h2>
        <DonutChart data={byCategory} />
      </section>
      <section className="dash-panel p-6 md:p-7">
        <p className="micro text-white/40">Output</p>
        <h2 className="font-display mt-2 text-2xl uppercase tracking-tight">
          Works by year
        </h2>
        <BarChart data={byYear} />
      </section>
    </div>
  );
}

function DonutChart({ data }: { data: ChartSlice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;

  const slices = useMemo(() => {
    if (!total) return [];
    const gap = data.length > 1 ? 6 : 0;
    let offset = 0;
    return data.map((item, i) => {
      const raw = (item.value / total) * circumference;
      const length = Math.max(0, raw - gap);
      const slice = {
        ...item,
        color: COLORS[i % COLORS.length],
        length,
        offset,
        percent: Math.round((item.value / total) * 100),
      };
      offset += raw;
      return slice;
    });
  }, [data, total, circumference]);

  const focused = active !== null ? slices[active] : null;

  if (!total) {
    return <EmptyChart label="Add works to see the category split." />;
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
      <div className="relative w-52 shrink-0 sm:w-56">
        <svg viewBox="0 0 200 200" className="w-full">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="22"
          />
          {slices.map((slice, i) => (
            <motion.circle
              key={slice.label}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={active === i ? 26 : 22}
              transform="rotate(-90 100 100)"
              strokeLinecap="butt"
              className="cursor-pointer"
              initial={{
                strokeDasharray: `0 ${circumference}`,
                strokeDashoffset: -slice.offset,
              }}
              animate={{
                strokeDasharray: `${slice.length} ${circumference}`,
                strokeDashoffset: -slice.offset,
              }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-4xl tracking-tight">
            {focused ? String(focused.value).padStart(2, "0") : String(total).padStart(2, "0")}
          </p>
          <p className="micro mt-1 text-white/40">
            {focused ? focused.label : "Total"}
          </p>
        </div>
      </div>
      <ul className="w-full space-y-3">
        {slices.map((slice, i) => (
          <li
            key={slice.label}
            className="flex cursor-pointer items-center justify-between gap-3"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="flex items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0"
                style={{ background: slice.color }}
              />
              {slice.label}
            </span>
            <span className="micro text-white/40">
              {String(slice.value).padStart(2, "0")} · {slice.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarChart({ data }: { data: ChartSlice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((item) => item.value));

  if (!data.length) {
    return <EmptyChart label="Yearly output will appear here." />;
  }

  return (
    <div className="mt-8">
      <div className="flex h-52 items-end gap-3">
        {data.map((item, i) => {
          const height = (item.value / max) * 100;
          const on = active === i;
          return (
            <button
              key={item.label}
              type="button"
              className="group flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span
                className={`mb-2 text-sm tabular-nums ${on || item.value > 0 ? "text-white" : "text-white/20"}`}
              >
                {item.value}
              </span>
              <div className="relative flex h-[85%] w-full items-end">
                <div className="absolute inset-0 bg-white/[0.03]" />
                <motion.div
                  className="relative w-full origin-bottom"
                  style={{ background: on ? "#ff6a3d" : "#ff4444" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="micro mt-3 text-white/40">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="mt-8 border border-white/8 px-4 py-16 text-center">
      <p className="text-sm text-white/40">{label}</p>
    </div>
  );
}
