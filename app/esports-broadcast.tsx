'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';

const thumbnails = [
  { src: '/thumbnails-2/iXCWobp75I8-HD.jpg', title: 'Pesadelo na Ilha', url: 'https://www.youtube.com/watch?v=iXCWobp75I8' },
  { src: '/thumbnails-2/vUDutSKUCPw-HD.jpg', title: 'O título histórico da T1', url: 'https://www.youtube.com/watch?v=vUDutSKUCPw' },
  { src: '/thumbnails-2/thumb1.jpg', title: 'CBOLÃO · Grande Final', url: 'https://www.youtube.com/watch?v=J37eDmkr9Xg' },
  { src: '/thumbnails-2/mZu1CmH8IFw-HD.jpg', title: 'DRX × T1 · Final do Worlds', url: 'https://www.youtube.com/watch?v=mZu1CmH8IFw' },
  { src: '/thumbnails-2/rf-U5qmLlzk-HD.jpg', title: 'T1 × BLG · Grande Final', url: 'https://www.youtube.com/watch?v=rf-U5qmLlzk' },
  { src: '/thumbnails-2/jJvpO_aEcCg-HD.jpg', title: 'O melhor time do mundo?', url: 'https://www.youtube.com/watch?v=jJvpO_aEcCg' },
  { src: '/thumbnails-2/inv-gWRluOo-HD.jpg', title: 'Faker × Creme · Grande Final', url: 'https://www.youtube.com/watch?v=inv-gWRluOo' },
];

const linkedThumbnails = thumbnails.filter(thumb => thumb.url !== null);

export default function EsportsBroadcast() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const step = (direction: number) => setActive(index => (index + direction + thumbnails.length) % thumbnails.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => step(1), 4800);
    return () => window.clearInterval(timer);
  }, [paused]);

  return <section className="broadcast-section" id="esports-broadcast" aria-labelledby="broadcast-heading">
    <span className="broadcast-watermark" aria-hidden="true">ESPORTS</span>
    <div className="broadcast-header">
      <div className="broadcast-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>YOUTUBE &amp; THUMBNAILS — 05</span></div>
      <div className="broadcast-title-row">
        <h2 id="broadcast-heading">Thumbnails · Esports</h2>
        <div className="broadcast-platforms" aria-label="Plataformas de publicação">
          <span className="platform-youtube"><Play fill="currentColor" /></span><span className="platform-x">𝕏</span><span className="platform-twitch">T</span><span className="platform-kick">K</span>
        </div>
      </div>
    </div>

    <div className="broadcast-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="broadcast-stage-cards">
        {thumbnails.map((thumb, index) => {
          let offset = index - active;
          if (offset > thumbnails.length / 2) offset -= thumbnails.length;
          if (offset < -thumbnails.length / 2) offset += thumbnails.length;
          return <button className="broadcast-stage-card" data-active={offset === 0} key={thumb.src} onClick={() => setActive(index)} style={{ transform: `translate(-50%, -50%) translateX(${offset * 72}%) scale(${1 - Math.abs(offset) * .095})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} aria-label={offset === 0 ? `${thumb.title}, em destaque` : `Destacar ${thumb.title}`}>
            <img src={thumb.src} alt={thumb.title} loading={Math.abs(offset) < 2 ? 'eager' : 'lazy'} />
          </button>;
        })}
      </div>
      <div className="broadcast-stage-caption">
        <button onClick={() => step(-1)} aria-label="Thumbnail anterior"><ArrowLeft /></button>
        <div><strong>{thumbnails[active].title}</strong><span>{String(active + 1).padStart(2, '0')} / {String(thumbnails.length).padStart(2, '0')}</span></div>
        <button onClick={() => step(1)} aria-label="Próxima thumbnail"><ArrowRight /></button>
      </div>
    </div>

    <div className="broadcast-reel" aria-label="Vídeos com thumbnails selecionadas">
      <div className="broadcast-track">
        {[0, 1].map(copy => <div className="broadcast-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
          {linkedThumbnails.map(thumb => <a href={thumb.url!} target="_blank" rel="noreferrer" className="broadcast-reel-card" tabIndex={copy === 1 ? -1 : 0} key={`${copy}-${thumb.src}`} aria-label={`Assistir ${thumb.title} no YouTube`}>
            <span className="broadcast-reel-image"><img src={thumb.src} alt={copy === 0 ? thumb.title : ''} loading="lazy" /><span className="broadcast-play"><Play fill="currentColor" /></span></span>
            <span className="broadcast-reel-title"><strong>{thumb.title}</strong><ExternalLink /></span>
          </a>)}
        </div>)}
      </div>
    </div>
    <p className="broadcast-hint">Passe o mouse para pausar · Clique em uma thumb para assistir ao vídeo</p>
  </section>;
}
