"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PublicWork } from "@/lib/utils";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";

export function FilmFrame({
  work,
  index,
  href,
}: {
  work: PublicWork;
  index: number;
  href?: string;
}) {
  const router = useRouter();

  const inner = (
    <>
      <div className="relative overflow-hidden border border-paper/10 bg-ink-2">
        <div className="absolute top-0 right-0 left-0 z-10 flex justify-between px-3 py-2">
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
        </div>
        <SafeImage
          src={work.thumbnail || work.heroImage}
          alt={work.title}
          className="aspect-[16/10] w-full object-cover transition duration-700 ease-out group-hover:scale-110"
        />
        <div className="work-scan" />
        <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/40" />
        <div className="absolute inset-0 grid place-items-center opacity-0 transition duration-500 group-hover:opacity-100">
          <span className="micro border border-signal bg-ink/70 px-4 py-2 text-signal">
            View
          </span>
        </div>
        <div className="absolute right-0 bottom-0 left-0 z-10 flex justify-between px-3 py-2">
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
          <span className="h-2 w-3 bg-ink/85" />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="micro text-mist">
            {String(index + 1).padStart(2, "0")} / {work.category}
          </p>
          <h2 className="font-display mt-1 text-2xl tracking-tight uppercase transition-colors group-hover:text-blue">
            {work.title}
          </h2>
        </div>
        <p className="micro text-signal">{work.year}</p>
      </div>
    </>
  );

  if (!href) return <div className="group">{inner}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        data-cursor="View"
        className="group relative z-10 block"
        onClick={(e) => {
          e.preventDefault();
          router.push(href);
        }}
      >
        {inner}
      </Link>
    </motion.div>
  );
}
