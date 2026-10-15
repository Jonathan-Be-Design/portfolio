'use client';

import { useEffect, useId, useRef } from 'react';
import { EYE } from './eye-mark-geometry';

const CREAM = '#fef7ef';
const INK = '#020203';
const VIEWBOX = '109 113 1773 1773';

// Borda de baixo da pálpebra: b = 0 aberta, b = 1 fechada.
const lidEdge = (b: number) => EYE.rest.map((y, i) => [EYE.x0 + i * EYE.dx, y + b * (EYE.closed[i] - y)] as const);
const line = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
const LID_TOP = line(EYE.rest.map((y, i) => [EYE.x0 + i * EYE.dx, y - 8] as const));
const lidPath = (edge: ReturnType<typeof lidEdge>) => `M${LID_TOP}L${line([...edge].reverse())}Z`;
// A pupila vai um pouco por baixo da pálpebra para não sobrar fresta entre as duas.
const clipPath = (edge: ReturnType<typeof lidEdge>) => `M${line(edge.map(([x, y]) => [x, y - 6] as const))}L${edge[edge.length - 1][0]} 2000L${EYE.x0} 2000Z`;
const REST = lidEdge(0);

export default function EyeMark() {
  const clipId = `eye-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const lidRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current, pupil = pupilRef.current, lid = lidRef.current, clip = clipRef.current;
    if (!svg || !pupil || !lid || !clip) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    let blinkAt = -1, lastB = 0, raf = 0, timer = 0;

    const setLid = (b: number) => {
      const edge = lidEdge(b);
      lid.setAttribute('d', lidPath(edge));
      clip.setAttribute('d', clipPath(edge));
    };
    const tick = (t: number) => {
      cur.x += (target.x - cur.x) * 0.14;
      cur.y += (target.y - cur.y) * 0.14;
      let b = 0;
      if (blinkAt >= 0) {
        const p = (t - blinkAt) / 300;
        if (p >= 1) blinkAt = -1;
        else if (p < 0.4) b = 1 - (1 - p / 0.4) ** 2;
        else { const u = (p - 0.4) / 0.6; b = 1 - u * u * (3 - 2 * u); }
      }
      pupil.setAttribute('transform', `translate(${cur.x.toFixed(1)} ${cur.y.toFixed(1)})`);
      if (b !== lastB) { setLid(b); lastB = b; }
      const settled = blinkAt < 0 && Math.abs(target.x - cur.x) < 0.1 && Math.abs(target.y - cur.y) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const blink = () => { if (blinkAt < 0) { blinkAt = performance.now(); wake(); } };
    const scheduleBlink = () => { timer = window.setTimeout(() => { if (!document.hidden) blink(); scheduleBlink(); }, 2800 + Math.random() * 4200); };

    // A pupila olha para onde o ponteiro está na página.
    const look = (event: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2), dy = event.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240);
      target.x = (dx / d) * 120 * k;
      target.y = Math.max(-30, Math.min(50, (dy / d) * 50 * k));
      wake();
    };
    const host = svg.parentElement;

    window.addEventListener('pointermove', look, { passive: true });
    host?.addEventListener('pointerenter', blink);
    scheduleBlink();
    return () => {
      window.removeEventListener('pointermove', look);
      host?.removeEventListener('pointerenter', blink);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const [cx, cy, r] = EYE.pupil;
  return <svg ref={svgRef} className="eye-mark" viewBox={VIEWBOX} aria-hidden="true" focusable="false">
    <defs><clipPath id={clipId}><path ref={clipRef} d={clipPath(REST)} /></clipPath></defs>
    <rect x="126" y="113" width="1739" height="1773" rx="195" fill={INK} />
    <path d={EYE.cream} fill={CREAM} fillRule="evenodd" />
    <g clipPath={`url(#${clipId})`}><circle ref={pupilRef} cx={cx} cy={cy} r={r} fill={INK} /></g>
    <path ref={lidRef} d={lidPath(REST)} fill={INK} />
  </svg>;
}
