"use client";

import { useCallback, useEffect, useRef } from "react";

/*
  Palabra "aragon" en 3D inflado (tubos): trazos SVG gruesos con puntas redondas
  + filtro de iluminación (volumen) + trama de puntos.
  Con `interactive`, cada letra se deshace en partículas al pasar el cursor y se recompone.
*/

const VB = { x: -50, y: 55, w: 1450, h: 430 };
const STROKE = 72;

const LETTERS = [
  "M -10 300 L 100 100 L 210 300 M 11 262 L 189 262",
  "M 290 300 L 290 168 M 290 238 C 290 186 330 154 396 160",
  "M 446 228 A 74 74 0 1 0 594 228 A 74 74 0 1 0 446 228 M 594 160 L 594 300",
  "M 700 228 A 74 74 0 1 0 848 228 A 74 74 0 1 0 700 228 M 848 160 L 848 334 C 848 410 786 438 716 410",
  "M 954 228 A 74 74 0 1 0 1102 228 A 74 74 0 1 0 954 228",
  "M 1208 300 L 1208 168 M 1208 300 L 1208 224 C 1208 178 1242 154 1280 154 C 1322 154 1352 182 1352 226 L 1352 300",
];

// Colores de las partículas: de azul eléctrico (arriba) a cian (abajo) + puntos oscuros de la trama
const PARTICLE_STOPS = ["#1424D6", "#2350FF", "#1FD3F6"];
const HALFTONE = "#06117A";

const SCATTER_MS = 850;
const RETURN_MS = 950;
const PAD = 160; // margen del canvas para que las partículas puedan salir de la palabra
const MAX_PARTICLES = 2200;

type Particle = { hx: number; hy: number; ox: number; oy: number; size: number; color: string; seed: number };
type Burst = { letter: number; start: number; parts: Particle[]; restored: boolean };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

function particleColor(yRatio: number) {
  if (Math.random() < 0.14) return HALFTONE;
  const t = Math.min(1, Math.max(0, yRatio + (Math.random() - 0.5) * 0.25));
  return t < 0.5 ? mix(PARTICLE_STOPS[0], PARTICLE_STOPS[1], t * 2) : mix(PARTICLE_STOPS[1], PARTICLE_STOPS[2], (t - 0.5) * 2);
}

export function PuffyWord({ id, interactive = false, className = "" }: { id: string; interactive?: boolean; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRefs = useRef<(SVGGElement | null)[]>([]);
  const bursts = useRef<Burst[]>([]);
  const raf = useRef<number | null>(null);

  // Ajusta el canvas al tamaño de la palabra (+ margen) y a la densidad de píxeles
  const fitCanvas = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round((rect.width + PAD * 2) * dpr);
    canvas.height = Math.round((rect.height + PAD * 2) * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    fitCanvas();
    const ro = new ResizeObserver(fitCanvas);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [interactive, fitCanvas]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const now = performance.now();
    const total = SCATTER_MS + RETURN_MS;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bursts.current = bursts.current.filter((burst) => {
      const t = now - burst.start;
      const f = t < SCATTER_MS ? easeOutCubic(t / SCATTER_MS) : 1 - easeInOutCubic(Math.min(1, (t - SCATTER_MS) / RETURN_MS));
      const fadeStart = SCATTER_MS + RETURN_MS * 0.7;
      const alpha = t < fadeStart ? 1 : Math.max(0, 1 - (t - fadeStart) / (total - fadeStart));

      // La letra vuelve a aparecer mientras las partículas llegan a su sitio
      if (!burst.restored && t > SCATTER_MS + RETURN_MS * 0.6) {
        const g = letterRefs.current[burst.letter];
        if (g) {
          g.style.transition = "opacity 0.4s ease, filter 0.4s ease";
          g.style.opacity = "1";
        }
        burst.restored = true;
      }

      ctx.globalAlpha = alpha;
      for (const p of burst.parts) {
        const wobble = Math.sin(t * 0.004 + p.seed) * 8 * f;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.hx + p.ox * f + wobble, p.hy + p.oy * f + Math.cos(t * 0.003 + p.seed) * 6 * f, p.size, p.size);
      }
      return t < total;
    });
    ctx.globalAlpha = 1;

    raf.current = bursts.current.length ? requestAnimationFrame(tick) : null;
  }, []);

  const shatter = useCallback(
    (index: number, clientX: number, clientY: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (bursts.current.some((b) => b.letter === index)) return;
      const wrap = wrapRef.current;
      const g = letterRefs.current[index];
      if (!wrap || !g) return;

      const rect = wrap.getBoundingClientRect();
      const scale = rect.width / VB.w;

      // Muestrea la forma real de la letra dibujando su trazo en un canvas fuera de pantalla
      const off = document.createElement("canvas");
      off.width = Math.ceil(VB.w * scale);
      off.height = Math.ceil(VB.h * scale);
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.setTransform(scale, 0, 0, scale, -VB.x * scale, -VB.y * scale);
      octx.lineWidth = STROKE;
      octx.lineCap = "round";
      octx.lineJoin = "round";
      octx.stroke(new Path2D(LETTERS[index]));
      const data = octx.getImageData(0, 0, off.width, off.height).data;

      const step = Math.max(2, Math.round(3 * scale * 1.4));
      const candidates: [number, number][] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) candidates.push([x, y]);
        }
      }
      const keep = Math.min(1, MAX_PARTICLES / candidates.length);
      const px = clientX - rect.left + PAD;
      const py = clientY - rect.top + PAD;

      const parts: Particle[] = [];
      for (const [x, y] of candidates) {
        if (Math.random() > keep) continue;
        const hx = x + PAD + (Math.random() - 0.5) * step;
        const hy = y + PAD + (Math.random() - 0.5) * step;
        const dx = hx - px;
        const dy = hy - py;
        const len = Math.hypot(dx, dy) || 1;
        const mag = 50 + Math.random() * 190;
        const yRatio = (y / scale + VB.y - 100) / 235;
        parts.push({
          hx, hy,
          ox: (dx / len) * mag + (Math.random() - 0.5) * 90,
          oy: (dy / len) * mag - Math.random() * 70,
          size: 1 + Math.random() * 2.2,
          color: particleColor(yRatio),
          seed: Math.random() * Math.PI * 2,
        });
      }

      g.style.transition = "opacity 0.18s ease, filter 0.18s ease";
      g.style.opacity = "0";
      bursts.current.push({ letter: index, start: performance.now(), parts, restored: false });
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const ids = { grad: `${id}-grad`, dots: `${id}-dots`, puff: `${id}-puff` };

  return (
    <div className={`puff-wrap ${className}`} ref={wrapRef}>
      <svg
        className="puff-word"
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        role="img"
        aria-label="Aragon"
      >
        <defs>
          <linearGradient id={ids.grad} gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="335">
            <stop offset="0%" stopColor="#1424D6" />
            <stop offset="50%" stopColor="#2350FF" />
            <stop offset="100%" stopColor="#1FD3F6" />
          </linearGradient>
          <pattern id={ids.dots} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx="3" cy="3" r="1.25" fill="#06117A" />
          </pattern>
          {/* Volumen: relieve a partir del alfa desenfocado + luz difusa + brillo blanco + luz cian desde abajo + sombra */}
          <filter
            id={ids.puff}
            filterUnits="userSpaceOnUse"
            x={VB.x - 60}
            y={VB.y - 40}
            width={VB.w + 120}
            height={VB.h + 120}
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="17" result="blur" />
            <feDiffuseLighting in="blur" surfaceScale="9" diffuseConstant="1.2" lightingColor="#ffffff" result="diff">
              <feDistantLight azimuth={235} elevation={40} />
            </feDiffuseLighting>
            <feComposite in="diff" in2="SourceAlpha" operator="in" result="diffIn" />
            <feBlend in="SourceGraphic" in2="diffIn" mode="multiply" result="shaded" />
            <feSpecularLighting in="blur" surfaceScale="9" specularConstant="0.6" specularExponent="22" lightingColor="#d6f6ff" result="spec">
              <feDistantLight azimuth={240} elevation={55} />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feSpecularLighting in="blur" surfaceScale="9" specularConstant="1" specularExponent="8" lightingColor="#1ee8ff" result="rim">
              <feDistantLight azimuth={110} elevation={18} />
            </feSpecularLighting>
            <feComposite in="rim" in2="SourceAlpha" operator="in" result="rimIn" />
            <feComposite in="shaded" in2="specIn" operator="arithmetic" k2="1" k3="0.5" result="lit" />
            <feComposite in="lit" in2="rimIn" operator="arithmetic" k2="1" k3="0.7" result="final" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="sh" />
            <feOffset in="sh" dy="18" result="shOff" />
            <feFlood floodColor="#0B1FA8" floodOpacity="0.2" />
            <feComposite in2="shOff" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="final" />
            </feMerge>
          </filter>
        </defs>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={STROKE}>
          {LETTERS.map((d, i) => (
            <g
              key={i}
              className="puff-letter"
              filter={`url(#${ids.puff})`}
              ref={(el) => { letterRefs.current[i] = el; }}
              onPointerEnter={interactive ? (e) => shatter(i, e.clientX, e.clientY) : undefined}
              onPointerDown={interactive ? (e) => shatter(i, e.clientX, e.clientY) : undefined}
            >
              <path d={d} stroke={`url(#${ids.grad})`} />
              <path d={d} stroke={`url(#${ids.dots})`} opacity={0.4} />
            </g>
          ))}
        </g>
      </svg>
      {interactive && <canvas className="puff-particles" ref={canvasRef} aria-hidden="true" />}
    </div>
  );
}
