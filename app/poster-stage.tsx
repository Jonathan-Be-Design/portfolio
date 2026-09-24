'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const posters = [
  { src: '/posters/poster-viagem-londres-worlds.webp', title: 'Worlds em Londres', year: '2024' },
  { src: '/posters/final-worlds-2023.webp', title: 'Final Worlds', year: '2023' },
  { src: '/posters/semifinal-worlds-2023.webp', title: 'Semifinal T1 × JDG', year: '2023' },
  { src: '/posters/semifinal2-worlds-2023.webp', title: 'Semifinal Worlds', year: '2023' },
  { src: '/posters/final-worlds-2024.webp', title: 'Grande Final Worlds', year: '2024' },
];

export default function PosterStage({ layout = 'default' }: { layout?: 'default' | 'spread' }) {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  const step = (direction: number) => setActive(index => (index + direction + posters.length) % posters.length);
  const stepSelected = (direction: number) => setSelected(index => index === null ? null : (index + direction + posters.length) % posters.length);

  useEffect(() => {
    if (paused || selected !== null) return;
    const timer = window.setInterval(() => step(1), 4500);
    return () => window.clearInterval(timer);
  }, [active, paused, selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') stepSelected(1);
      if (event.key === 'ArrowLeft') stepSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  useEffect(() => {
    if (layout !== 'spread') return;

    let frame = 0;
    const updateViewport = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setViewportWidth(window.innerWidth));
    };

    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateViewport);
    };
  }, [layout]);

  const spread = layout === 'spread';
  const spreadProgress = spread ? Math.min(1, Math.max(0, (viewportWidth - 900) / 1020)) : 0;

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!spread || event.button !== 0) return;
    dragStart.current = event.clientX;
    dragged.current = false;
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    if (Math.abs(event.clientX - dragStart.current) > 10) {
      dragged.current = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    dragStart.current = null;
    setDragging(false);
    if (Math.abs(distance) > 45) step(distance < 0 ? 1 : -1);
    window.setTimeout(() => { dragged.current = false; }, 0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const cancelDrag = () => {
    dragStart.current = null;
    dragged.current = false;
    setDragging(false);
  };

  return <>
    <section className={`case-section${spread ? ' case-section-spread' : ''}`} id="worlds" aria-labelledby="worlds-heading">
      <div className="case-top" data-motion-reveal><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>CASE 1 · CAMPANHA &amp; KEY ART — 02</span></div>
      <div className="case-heading" data-motion-reveal>
        <h2 id="worlds-heading">Artes Digitais · Worlds 2023 &amp; 2024</h2>
        <p>Direção visual e criação de key arts para promover as co-streams oficiais do Worlds nos canais de Baiano e Ilha das Lendas — parceiros oficiais da Riot Games na transmissão do campeonato.</p>
        {spread ? <div className="case-action-nav">
          <button type="button" className="case-action-arrow" onClick={() => step(-1)} aria-label="Pôster anterior"><ArrowLeft size={20} aria-hidden="true" /></button>
          <span className="case-action">CLIQUE NA IMAGEM PARA AMPLIAR</span>
          <button type="button" className="case-action-arrow" onClick={() => step(1)} aria-label="Próximo pôster"><ArrowRight size={20} aria-hidden="true" /></button>
        </div> : <span className="case-action">CLIQUE NA IMAGEM PARA AMPLIAR</span>}
      </div>
      <div className={`case-stage${dragging ? ' is-dragging' : ''}`} data-motion-stage="34" data-motion-image-group onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onPointerDownCapture={startDrag} onPointerMoveCapture={moveDrag} onPointerUpCapture={finishDrag} onPointerCancelCapture={cancelDrag} onDragStart={event => { if (spread) event.preventDefault(); }} tabIndex={spread ? 0 : undefined} onKeyDown={event => { if (!spread) return; if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1); }}>
        {posters.map((poster, index) => {
          let offset = index - active;
          if (offset > posters.length / 2) offset -= posters.length;
          if (offset < -posters.length / 2) offset += posters.length;
          const distance = spread ? 53 + (35 * spreadProgress) : 53;
          const depth = spread ? -120 + (55 * spreadProgress) : -120;
          const rotation = spread ? -9 + (5 * spreadProgress) : -9;
          const scaleStep = spread ? .08 - (.035 * spreadProgress) : .08;
          return <button key={poster.src} className="case-poster" data-active={offset === 0} onClick={() => { if (dragged.current) { dragged.current = false; return; } if (offset === 0) setSelected(index); else setActive(index); }} style={{ transform: `translate(-50%, -50%) translateX(${offset * distance}%) translateZ(${Math.abs(offset) * depth}px) rotateY(${offset * rotation}deg) scale(${1 - Math.abs(offset) * scaleStep})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} aria-label={offset === 0 ? `Ampliar ${poster.title}` : `Destacar ${poster.title}`}>
            <img src={poster.src} alt={poster.title} data-motion-card-image draggable={!spread} loading={offset === 0 ? 'eager' : 'lazy'} /><span>{poster.year}</span>
          </button>;
        })}
        <div className="case-controls">
          <button onClick={() => step(-1)} aria-label="Pôster anterior"><ArrowLeft /></button>
          <div><span>{String(active + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span><strong>{posters[active].title}</strong></div>
          <button onClick={() => step(1)} aria-label="Próximo pôster"><ArrowRight /></button>
        </div>
      </div>
      <p className="case-hint">Passe o mouse para pausar · Use as setas para navegar</p>
    </section>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="case-dialog" showCloseButton={false}>
        {selected !== null && <div className="case-lightbox" onTouchStart={event => setTouchStart(event.changedTouches[0].clientX)} onTouchEnd={event => { if (touchStart !== null) { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 55) stepSelected(distance < 0 ? 1 : -1); } setTouchStart(null); }}>
          <DialogTitle className="sr-only">{posters[selected].title}</DialogTitle>
          <DialogDescription className="sr-only">Pôster ampliado. Use as setas para navegar.</DialogDescription>
          <img src={posters[selected].src} alt={posters[selected].title} />
          <div className="case-lightbox-controls"><button onClick={() => stepSelected(-1)} aria-label="Pôster anterior"><ArrowLeft /></button><div><span>{String(selected + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span><strong>{posters[selected].title}</strong></div><button onClick={() => stepSelected(1)} aria-label="Próximo pôster"><ArrowRight /></button></div>
          <DialogClose className="case-lightbox-close" aria-label="Fechar"><X /></DialogClose>
        </div>}
      </DialogContent>
    </Dialog>
  </>;
}
