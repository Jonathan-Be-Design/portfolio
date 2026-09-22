'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const posters = [
  { src: '/posters/poster-viagem-londres-worlds.webp', title: 'Worlds em Londres', year: '2024' },
  { src: '/posters/final-worlds-2023.webp', title: 'Final Worlds', year: '2023' },
  { src: '/posters/semifinal-worlds-2023.webp', title: 'Semifinal T1 × JDG', year: '2023' },
  { src: '/posters/semifinal2-worlds-2023.webp', title: 'Semifinal Worlds', year: '2023' },
  { src: '/posters/final-worlds-2024.webp', title: 'Grande Final Worlds', year: '2024' },
];

export default function PosterStage() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const step = (direction: number) => setActive(index => (index + direction + posters.length) % posters.length);
  const stepSelected = (direction: number) => setSelected(index => index === null ? null : (index + direction + posters.length) % posters.length);

  useEffect(() => {
    if (paused || selected !== null) return;
    const timer = window.setInterval(() => step(1), 4500);
    return () => window.clearInterval(timer);
  }, [paused, selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') stepSelected(1);
      if (event.key === 'ArrowLeft') stepSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return <>
    <section className="case-section" id="worlds" aria-labelledby="worlds-heading">
      <div className="case-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>CASE 1 · CAMPANHA &amp; KEY ART — 04</span></div>
      <div className="case-heading">
        <div><span>WORLDS 2023 &amp; 2024</span><h2 id="worlds-heading">Artes digitais<br />para o mundial.</h2></div>
        <p>Direção visual e criação de key arts para promover as co-streams oficiais do Worlds nos canais de Baiano e Ilha das Lendas — parceiros oficiais da Riot Games na transmissão do campeonato.</p>
      </div>
      <div className="case-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
        {posters.map((poster, index) => {
          let offset = index - active;
          if (offset > posters.length / 2) offset -= posters.length;
          if (offset < -posters.length / 2) offset += posters.length;
          return <button key={poster.src} className="case-poster" data-active={offset === 0} onClick={() => offset === 0 ? setSelected(index) : setActive(index)} style={{ transform: `translate(-50%, -50%) translateX(${offset * 53}%) translateZ(${Math.abs(offset) * -120}px) rotateY(${offset * -9}deg) scale(${1 - Math.abs(offset) * .08})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} aria-label={offset === 0 ? `Ampliar ${poster.title}` : `Destacar ${poster.title}`}>
            <img src={poster.src} alt={poster.title} loading={offset === 0 ? 'eager' : 'lazy'} /><span>{poster.year}</span>
          </button>;
        })}
        <div className="case-controls">
          <button onClick={() => step(-1)} aria-label="Pôster anterior"><ArrowLeft /></button>
          <div><span>{String(active + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span><strong>{posters[active].title}</strong></div>
          <button onClick={() => step(1)} aria-label="Próximo pôster"><ArrowRight /></button>
        </div>
      </div>
      <p className="case-hint">Passe o mouse para pausar · Clique no pôster central para ampliar</p>
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
