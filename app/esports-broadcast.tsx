'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ZoomIn, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const pieces = [
  { src: '/trabalhos/esports-13.jpg', title: 'Final CBLOL 2024 — 2ª Etapa' },
  { src: '/trabalhos/esports-04.jpg', title: 'Ilha das Lendas — Worlds em Londres' },
  { src: '/trabalhos/esports-07.jpg', title: 'LPL — programação do dia' },
];

export default function EsportsBroadcast() {
  const [selected, setSelected] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const step = (direction: number) => setSelected(index => index === null ? null : (index + direction + pieces.length) % pieces.length);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return <>
    <section className="broadcast-section" id="esports-broadcast" aria-labelledby="broadcast-heading">
      <div className="broadcast-wrap">
        <div className="broadcast-top">
          <span>CONTEÚDO DIGITAL</span>
          <span>ESPORTS &amp; BROADCAST — 05</span>
        </div>
        <div className="broadcast-heading">
          <h2 id="broadcast-heading">Esports &amp; Broadcast</h2>
          <p>Capas, chamadas e peças para transmissões e redes sociais</p>
        </div>
        <div className="broadcast-grid">
          {pieces.map((piece, index) => <button className={`broadcast-piece broadcast-piece-${index + 1}`} key={piece.src} onClick={() => setSelected(index)} aria-label={`Ampliar ${piece.title}`}>
            <img src={piece.src} alt={piece.title} loading="lazy" />
            <span className="broadcast-overlay"><ZoomIn size={21} /><strong>AMPLIAR</strong></span>
          </button>)}
        </div>
        <div className="broadcast-footer"><span>JONATHAN BOLANLE — PORTFÓLIO 2026</span><span>ESPORTS &amp; BROADCAST</span><span>05</span></div>
      </div>
    </section>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="broadcast-dialog" showCloseButton={false}>
        {selected !== null && <div className="broadcast-lightbox" onTouchStart={event => setTouchStart(event.changedTouches[0].clientX)} onTouchEnd={event => { if (touchStart !== null) { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 55) step(distance < 0 ? 1 : -1); } setTouchStart(null); }}>
          <DialogTitle className="sr-only">{pieces[selected].title}</DialogTitle>
          <DialogDescription className="sr-only">Peça ampliada. Use as setas para navegar.</DialogDescription>
          <img src={pieces[selected].src} alt={pieces[selected].title} />
          <div className="broadcast-lightbox-bar">
            <button onClick={() => step(-1)} aria-label="Peça anterior"><ArrowLeft /></button>
            <div><span>{String(selected + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}</span><strong>{pieces[selected].title}</strong></div>
            <button onClick={() => step(1)} aria-label="Próxima peça"><ArrowRight /></button>
          </div>
          <DialogClose className="broadcast-lightbox-close" aria-label="Fechar"><X /></DialogClose>
        </div>}
      </DialogContent>
    </Dialog>
  </>;
}
