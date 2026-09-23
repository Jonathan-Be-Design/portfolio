'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

const rows = [
  [
    'minerva-valorant.jpg',
    'minerva-cyberpunk-2077.jpg',
    'minerva-red-dead-redemption2.jpg',
    'minerva-minecraft-1.jpg',
    'minerva-pokemon-minecraft.jpg',
  ],
  [
    'minerva-valorant-duo-grevthar.jpg',
    'minerva-ambessa-lol.jpg',
    'minerva-liars-bar.jpg',
    'minerva-live-thumb.jpg',
    'minerva-expedition-33.jpg',
  ],
  [
    'minerva-kratos-gow.jpg',
    'minerva-eldenring.jpg',
    'minerva-graves-lol.jpg',
    'minerva-darius-lol.jpg',
    'robo-cblol-idl.jpg',
  ],
];

function DragRow({ images, large, label }: { images: string[]; large?: boolean; label: string }) {
  const row = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, scroll: 0 });
  const [dragging, setDragging] = useState(false);

  const start = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!row.current || event.pointerType === 'touch') return;
    drag.current = { active: true, x: event.clientX, scroll: row.current.scrollLeft };
    row.current.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!row.current || !drag.current.active) return;
    row.current.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x);
  };

  const stop = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (row.current?.hasPointerCapture(event.pointerId)) row.current.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  return <div
    ref={row}
    className={`games-drag-row${large ? ' games-drag-row-large' : ''}${dragging ? ' is-dragging' : ''}`}
    aria-label={label}
    onPointerDown={start}
    onPointerMove={move}
    onPointerUp={stop}
    onPointerCancel={stop}
    onPointerLeave={stop}
  >
    <div className="games-drag-track">
      {images.map((image, index) => <div className="games-thumb" key={image}>
        <img src={`/games-thumbnails/${image}`} alt={`Thumbnail de gaming ${index + 1}`} loading="lazy" draggable={false} />
      </div>)}
    </div>
  </div>;
}

export default function GamesThumbnails() {
  return <section className="games-section" id="games-thumbnails" aria-labelledby="games-heading">
    <span className="games-watermark" aria-hidden="true">gaming</span>
    <div className="games-header">
      <div className="games-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>YOUTUBE &amp; THUMBNAILS — 06</span></div>
      <div className="games-title-row">
        <h2 id="games-heading">Thumbnails · Games</h2>
        <div className="broadcast-platforms" aria-label="Plataformas de publicação">
          <span className="platform-youtube"><img src="/icons/social/youtube.svg" alt="YouTube" /></span>
          <span className="platform-x"><img src="/icons/social/x-twitter.svg" alt="X" /></span>
          <span className="platform-twitch"><img src="/icons/social/twitch.svg" alt="Twitch" /></span>
          <span className="platform-kick"><img src="/icons/social/kick.svg" alt="Kick" /></span>
        </div>
      </div>
      <p className="games-hint">Arraste horizontalmente para explorar</p>
    </div>
    <div className="games-gallery">
      <DragRow images={rows[0]} label="Primeira faixa de thumbnails de games" />
      <DragRow images={rows[1]} large label="Segunda faixa de thumbnails de games em destaque" />
      <DragRow images={rows[2]} label="Terceira faixa de thumbnails de games" />
    </div>
  </section>;
}
