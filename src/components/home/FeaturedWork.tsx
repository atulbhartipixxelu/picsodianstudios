"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicWork } from "@/lib/utils";
import { FeaturedSmoke } from "@/components/home/FeaturedSmoke";
import { LineMask } from "@/components/ui/LineMask";
import { SafeImage } from "@/components/ui/SafeImage";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedWork({ work }: { work: PublicWork | null }) {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = root.current;
    const photo = img.current;
    if (!el || !photo) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        photo,
        { scale: 1.22 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [work?.id]);

  if (!work) return null;

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <SafeImage
        ref={img}
        src={work.heroImage || work.thumbnail}
        alt={work.title}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
      <FeaturedSmoke />

      <div className="relative z-10 grid min-h-[100svh] items-end gap-10 px-4 py-24 md:grid-cols-12 md:px-7">
        <div className="md:col-span-7">
          <p className="micro text-signal">Featured / 03</p>
          <LineMask
            lines={[work.title]}
            className="display-huge mt-4 text-[14vw] md:text-[8vw]"
          />
          <p className="featured-copy mt-6 max-w-xl">
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
        <div className="space-y-4 text-paper/70 md:col-span-4 md:col-start-9">
          <p className="micro">/ Overview</p>
          <p className="featured-copy featured-copy-sm">
            {work.overview}
          </p>
          <p className="micro pt-4 text-paper">
            {work.year} · {work.category} · {work.client}
          </p>
        </div>
      </div>
    </section>
  );
}
