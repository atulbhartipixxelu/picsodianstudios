"use client";

import { useEffect, useRef } from "react";

type Puff = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  life: number;
  max: number;
};

function makeSprite() {
  const sheet = document.createElement("canvas");
  sheet.width = 160;
  sheet.height = 160;
  const c = sheet.getContext("2d");
  if (!c) return sheet;

  const blobs: [number, number, number, number][] = [
    [80, 82, 58, 0.55],
    [62, 78, 42, 0.38],
    [98, 70, 40, 0.34],
    [74, 98, 36, 0.28],
    [92, 96, 30, 0.22],
    [70, 62, 28, 0.2],
  ];

  for (const [x, y, r, a] of blobs) {
    const g = c.createRadialGradient(x, y, r * 0.08, x, y, r);
    g.addColorStop(0, `rgba(242,240,240,${a})`);
    g.addColorStop(0.45, `rgba(242,240,240,${a * 0.35})`);
    g.addColorStop(1, "rgba(242,240,240,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  return sheet;
}

export function FeaturedSmoke() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const sprite = makeSprite();
    const puffs: Puff[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let visible = true;

    const spawn = (count = 1) => {
      for (let i = 0; i < count; i++) {
        puffs.push({
          x: w * (0.48 + Math.random() * 0.42),
          y: h * (0.42 + Math.random() * 0.38),
          size: 90 + Math.random() * 170,
          vx: -0.18 - Math.random() * 0.32,
          vy: -0.22 - Math.random() * 0.38,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.006,
          life: 0,
          max: 220 + Math.random() * 260,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = () => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible || w < 8) return;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      if (puffs.length < 42) spawn(2);

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += 1;
        const t = p.life / p.max;
        p.x += p.vx + Math.sin(p.life * 0.018 + p.rot) * 0.42;
        p.y += p.vy;
        p.size += 0.28;
        p.rot += p.spin;

        const fadeIn = Math.min(1, t / 0.12);
        const fadeOut = t > 0.55 ? Math.max(0, (1 - t) / 0.45) : 1;
        const alpha = fadeIn * fadeOut;
        if (t >= 1 || p.y < -p.size) {
          puffs.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha * 0.22;
        const s = p.size;
        ctx.drawImage(sprite, -s / 2, -s / 2, s, s * 1.15);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    spawn(18);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="featured-smoke-canvas"
      aria-hidden
    />
  );
}
