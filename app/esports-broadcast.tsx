'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, ExternalLink, Play, ThumbsUp } from 'lucide-react';

const thumbnails = [
  { src: '/thumbnails-2/iXCWobp75I8-HD.jpg', title: 'Pesadelo na Ilha', videoId: 'iXCWobp75I8' },
  { src: '/thumbnails-2/vUDutSKUCPw-HD.jpg', title: 'O título histórico da T1', videoId: 'vUDutSKUCPw' },
  { src: '/thumbnails-2/thumb1.jpg', title: 'CBOLÃO · Grande Final', videoId: 'J37eDmkr9Xg' },
  { src: '/thumbnails-2/mZu1CmH8IFw-HD.jpg', title: 'DRX × T1 · Final do Worlds', videoId: 'mZu1CmH8IFw' },
  { src: '/thumbnails-2/rf-U5qmLlzk-HD.jpg', title: 'T1 × BLG · Grande Final', videoId: 'rf-U5qmLlzk' },
  { src: '/thumbnails-2/jJvpO_aEcCg-HD.jpg', title: 'O melhor time do mundo?', videoId: 'jJvpO_aEcCg' },
  { src: '/thumbnails-2/inv-gWRluOo-HD.jpg', title: 'Faker × Creme · Grande Final', videoId: 'inv-gWRluOo' },
];

const stageThumbnails = [
  { src: '/thumbnails-2/palco/idl-baiano-worlds-londres.jpg', title: 'Worlds em Londres · Ilha das Lendas' },
  { src: '/thumbnails-2/palco/baiano-worlds-capa-azul.jpg', title: 'Worlds 2024 · Costream oficial' },
  { src: '/thumbnails-2/palco/DQnLLVIRhVM-HD.jpg', title: 'Costream do CBLOL · Ilha das Lendas' },
  { src: '/thumbnails-2/palco/faker-bdd-lck-idl.jpg', title: 'Faker × BDD · Resumo LCK' },
  { src: '/thumbnails-2/palco/baiano-heineken-djonga.jpg', title: 'Show do Djonga no CBLOL' },
  { src: '/thumbnails-2/palco/robo-cblol-idl.jpg', title: 'Robo de Camille · Resumo LTA' },
];

type VideoStats = Record<string, { views: number; likes: number }>;

function compactNumber(value: number) {
  const format = (number: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(number);
  if (value >= 1_000_000) return `${format(value / 1_000_000)} mi`;
  if (value >= 1_000) return `${format(value / 1_000)} mil`;
  return format(value);
}

export default function EsportsBroadcast() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState<VideoStats>({});
  const step = (direction: number) => setActive(index => (index + direction + stageThumbnails.length) % stageThumbnails.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => step(1), 4800);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/youtube-stats?ids=${thumbnails.map(thumb => thumb.videoId).join(',')}`, { signal: controller.signal })
      .then(response => response.ok ? response.json() as Promise<{ items?: VideoStats }> : null)
      .then(data => { if (data?.items) setStats(data.items); })
      .catch(error => { if (error.name !== 'AbortError') console.warn('YouTube stats indisponíveis'); });
    return () => controller.abort();
  }, []);

  return <section className="broadcast-section" id="esports-broadcast" aria-labelledby="broadcast-heading">
    <span className="broadcast-watermark" aria-hidden="true">ESPORTS</span>
    <div className="broadcast-header">
      <div className="broadcast-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>YOUTUBE &amp; THUMBNAILS — 05</span></div>
      <div className="broadcast-title-row">
        <h2 id="broadcast-heading">Thumbnails · Esports</h2>
        <div className="broadcast-platforms" aria-label="Plataformas de publicação">
          <span className="platform-youtube"><img src="/icons/social/youtube.svg" alt="YouTube" /></span>
          <span className="platform-x"><img src="/icons/social/x-twitter.svg" alt="X" /></span>
          <span className="platform-twitch"><img src="/icons/social/twitch.svg" alt="Twitch" /></span>
          <span className="platform-kick"><img src="/icons/social/kick.svg" alt="Kick" /></span>
        </div>
      </div>
    </div>

    <div className="broadcast-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="broadcast-stage-cards">
        {stageThumbnails.map((thumb, index) => {
          let offset = index - active;
          if (offset > stageThumbnails.length / 2) offset -= stageThumbnails.length;
          if (offset < -stageThumbnails.length / 2) offset += stageThumbnails.length;
          return <button className="broadcast-stage-card" data-active={offset === 0} key={thumb.src} onClick={() => setActive(index)} style={{ transform: `translate(-50%, -50%) translateX(${offset * 72}%) scale(${1 - Math.abs(offset) * .095})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} aria-label={offset === 0 ? `${thumb.title}, em destaque` : `Destacar ${thumb.title}`}>
            <img src={thumb.src} alt={thumb.title} loading={Math.abs(offset) < 2 ? 'eager' : 'lazy'} />
          </button>;
        })}
      </div>
      <div className="broadcast-stage-caption">
        <button onClick={() => step(-1)} aria-label="Thumbnail anterior"><ArrowLeft /></button>
        <div><strong>{stageThumbnails[active].title}</strong><span>{String(active + 1).padStart(2, '0')} / {String(stageThumbnails.length).padStart(2, '0')}</span></div>
        <button onClick={() => step(1)} aria-label="Próxima thumbnail"><ArrowRight /></button>
      </div>
    </div>

    <div className="broadcast-reel" aria-label="Vídeos com thumbnails selecionadas">
      <div className="broadcast-track">
        {[0, 1].map(copy => <div className="broadcast-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
          {thumbnails.map(thumb => <a href={`https://www.youtube.com/watch?v=${thumb.videoId}`} target="_blank" rel="noreferrer" className="broadcast-reel-card" tabIndex={copy === 1 ? -1 : 0} key={`${copy}-${thumb.src}`} aria-label={`Assistir ${thumb.title} no YouTube`}>
            <span className="broadcast-reel-image"><img src={thumb.src} alt={copy === 0 ? thumb.title : ''} loading="lazy" /><span className="broadcast-play"><Play fill="currentColor" /></span></span>
            <span className="broadcast-reel-title"><span><strong>{thumb.title}</strong><span className="broadcast-stats" aria-label={stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].views)} visualizações e ${compactNumber(stats[thumb.videoId].likes)} curtidas` : 'Métricas do vídeo carregando'}>
              <span><Eye />{stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].views)} visualizações` : '— visualizações'}</span>
              <span><ThumbsUp />{stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].likes)} curtidas` : '— curtidas'}</span>
            </span></span><ExternalLink /></span>
          </a>)}
        </div>)}
      </div>
    </div>
    <p className="broadcast-hint">Passe o mouse para pausar · Clique em uma thumb para assistir ao vídeo</p>
  </section>;
}
