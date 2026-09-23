'use client';

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export const gameThumbnailRows = [
  [
    'minerva-valorant.jpg',
    'minerva-cyberpunk-2077.jpg',
    'minerva-red-dead-redemption2.jpg',
    'minerva-minecraft-1.jpg',
    'minerva-pokemon-minecraft.jpg',
    'minerva-kratos-gow.jpg',
    'minerva-eldenring.jpg',
    'minerva-graves-lol.jpg',
  ],
  [
    'minerva-valorant-duo-grevthar.jpg',
    'minerva-ambessa-lol.jpg',
    'minerva-liars-bar.jpg',
    'minerva-live-thumb.jpg',
    'minerva-expedition-33.jpg',
    'minerva-darius-lol.jpg',
    'robo-cblol-idl.jpg',
  ],
];

function DragRow({ images, large, label }: { images: string[]; large?: boolean; label: string }) {
  const row = useRef<HTMLDivElement>(null);
  const cycleWidth = useRef(0);
  const drag = useRef({ active: false, x: 0, scroll: 0 });
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    const container = row.current;
    const cycle = container?.querySelector<HTMLElement>('.games-drag-group');
    if (!container || !cycle) return;

    const measure = () => {
      const nextWidth = cycle.offsetWidth;
      if (!nextWidth) return;
      const previousWidth = cycleWidth.current;
      const relativePosition = previousWidth ? (container.scrollLeft - previousWidth) / previousWidth : 0;
      cycleWidth.current = nextWidth;
      container.scrollLeft = nextWidth + (previousWidth ? relativePosition * nextWidth : window.innerWidth * (large ? .2 : .07));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(cycle);
    return () => observer.disconnect();
  }, [images, large]);

  const wrap = () => {
    const container = row.current;
    const width = cycleWidth.current;
    if (!container || !width) return;
    const before = container.scrollLeft;
    const after = before < width * .5 || before > width * 1.5
      ? ((before - width * .5) % width + width) % width + width * .5
      : before;
    if (after === before) return;
    container.scrollLeft = after;
    if (drag.current.active) drag.current.scroll += after - before;
  };

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
    onScroll={wrap}
    onPointerDown={start}
    onPointerMove={move}
    onPointerUp={stop}
    onPointerCancel={stop}
    onLostPointerCapture={stop}
  >
    <div className="games-drag-track">
      {[0, 1, 2].map(copy => <div className="games-drag-group" aria-hidden={copy === 1 ? undefined : true} key={copy}>
        {images.map((image, index) => <div className="games-thumb" key={`${copy}-${image}`}>
          <img src={`/games-thumbnails/${image}`} alt={copy === 1 ? `Thumbnail de gaming ${index + 1}` : ''} data-motion-card-image loading="lazy" draggable={false} />
        </div>)}
      </div>)}
    </div>
  </div>;
}

export default function GamesThumbnails() {
  return <section className="games-section" id="games-thumbnails" aria-labelledby="games-heading">
    <span className="games-watermark" data-motion-watermark aria-hidden="true">gaming</span>
    <div className="games-header">
      <div className="games-top" data-motion-reveal><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>YOUTUBE &amp; THUMBNAILS — 06</span></div>
      <div className="games-title-row" data-motion-reveal>
        <h2 id="games-heading">Games</h2>
        <div className="broadcast-platforms" aria-label="Plataformas de publicação">
          <span className="platform-youtube"><img src="/icons/social/youtube.svg" alt="YouTube" /></span>
          <span className="platform-x"><img src="/icons/social/x-twitter.svg" alt="X" /></span>
          <span className="platform-twitch"><img src="/icons/social/twitch.svg" alt="Twitch" /></span>
          <span className="platform-kick"><img src="/icons/social/kick.svg" alt="Kick" /></span>
        </div>
      </div>
      <p className="games-hint" data-motion-reveal>Arraste horizontalmente para explorar</p>
    </div>
    <div className="games-gallery" data-motion-stage="26" data-motion-image-group>
      <DragRow images={gameThumbnailRows[0]} label="Primeira faixa de thumbnails de games" />
      <DragRow images={gameThumbnailRows[1]} large label="Segunda faixa de thumbnails de games em destaque" />
    </div>
  </section>;
}
