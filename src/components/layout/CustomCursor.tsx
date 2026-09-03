"use client";

import { useEffect, useRef } from "react";

const HOVER_SEL = "a, button, [data-cursor], [role='button']";
const TEXT_SEL = "input, textarea, select, [contenteditable='true']";
const TRAIL = 10;
/** Skip magnetic pull on huge hit targets (e.g. full-width sections) */
const MAX_MAGNET_AREA = 72_000;

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const rootEl = root.current;
    const coreEl = core.current;
    const ringEl = ring.current;
    const labelEl = label.current;
    const trailEl = trail.current;
    if (!fine || !rootEl || !coreEl || !ringEl || !labelEl || !trailEl) return;

    document.documentElement.classList.add("has-ps-cursor");
    rootEl.classList.add("is-on");

    const dots = Array.from(trailEl.querySelectorAll<HTMLElement>(".ps-trail-dot"));
    const history = Array.from({ length: TRAIL }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let magnet: DOMRect | null = null;

    const loop = () => {
      let tx = mx;
      let ty = my;
      if (magnet) {
        tx += (magnet.left + magnet.width / 2 - mx) * 0.18;
        ty += (magnet.top + magnet.height / 2 - my) * 0.18;
      }

      cx += (tx - cx) * 0.55;
      cy += (ty - cy) * 0.55;
      rx += (tx - rx) * 0.13;
      ry += (ty - ry) * 0.13;

      coreEl.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;

      history.pop();
      history.unshift({ x: cx, y: cy });
      dots.forEach((dot, i) => {
        const p = history[Math.min(i + 1, history.length - 1)];
        const t = 1 - i / dots.length;
        dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${t})`;
        dot.style.opacity = String(t * 0.45);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const node = e.target as HTMLElement | null;
      const html = document.documentElement;
      const surfaceEl = node?.closest("[data-cursor-surface]");
      const surface = surfaceEl?.getAttribute("data-cursor-surface");
      const onBlueOverlay = html.classList.contains("is-filters-lock");
      const onLight =
        !onBlueOverlay &&
        (surface === "paper" ||
          surface === "sheet" ||
          (!surface &&
            (html.classList.contains("is-work") ||
              html.classList.contains("is-contact") ||
              Boolean(node?.closest(".bg-paper")))));

      if (onBlueOverlay || surface === "ink") {
        rootEl.dataset.surface = "ink";
      } else if (onLight) {
        rootEl.dataset.surface = "paper";
      } else {
        rootEl.dataset.surface = "ink";
      }

      if (node?.closest(TEXT_SEL)) {
        magnet = null;
        rootEl.dataset.state = "text";
        labelEl.textContent = "";
        return;
      }

      const hover = node?.closest(HOVER_SEL) as HTMLElement | null;
      if (hover) {
        const noMagnet = hover.hasAttribute("data-no-magnet");
        const rect = hover.getBoundingClientRect();
        const tooLarge = rect.width * rect.height > MAX_MAGNET_AREA;
        const text = hover.getAttribute("data-cursor") || "Open";

        magnet = noMagnet || tooLarge ? null : rect;
        const words = text.trim().split(/\s+/);
        labelEl.textContent =
          words.length >= 3 ? `${words[0]}\n${words.slice(1).join(" ")}` : text;
        rootEl.dataset.state = "hover";
        rootEl.dataset.long = text.length > 10 ? "1" : "0";
        return;
      }

      magnet = null;
      rootEl.dataset.state = "default";
      rootEl.dataset.long = "0";
      labelEl.textContent = "";
    };

    const onDown = () => {
      rootEl.dataset.click = "1";
    };
    const onUp = () => {
      rootEl.dataset.click = "0";
    };
    const onLeave = () => {
      rootEl.classList.remove("is-on");
    };
    const onEnter = () => {
      rootEl.classList.add("is-on");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-ps-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div ref={root} className="ps-cursor" aria-hidden data-state="default">
      <div ref={trail} className="ps-cursor-trail">
        {Array.from({ length: TRAIL }).map((_, i) => (
          <span key={i} className="ps-trail-dot" />
        ))}
      </div>
      <div ref={ring} className="ps-cursor-ring">
        <span ref={label} className="ps-cursor-label" />
      </div>
      <div ref={core} className="ps-cursor-core" />
    </div>
  );
}
