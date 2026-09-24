'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, ExternalLink, Play, ThumbsUp, X } from 'lucide-react';
import { reelVideos as thumbnails, stageVideos as stageThumbnails } from '@/lib/youtube-videos';

type VideoStats = Record<string, { views: number; likes: number }>;
// Re-enable once production has a working YouTube API secret.
const SHOW_VIDEO_STATS = true;

function compactNumber(value: number) {
  const format = (number: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(number);
  if (value >= 1_000_000) return `${format(value / 1_000_000)} mi`;
  if (value >= 1_000) return `${format(value / 1_000)} mil`;
  return format(value);
}

export default function EsportsBroadcast() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [stats, setStats] = useState<VideoStats>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressTapUntil = useRef(0);
  const step = (direction: number) => {
    setPlaying(false);
    setActive(index => (index + direction + stageThumbnails.length) % stageThumbnails.length);
  };

  const startSwipe = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    setPaused(true);
  };

  const endSwipe = (event: TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const distanceX = event.changedTouches[0].clientX - touchStart.current.x;
    const distanceY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    setPaused(false);
    if (Math.abs(distanceX) < 55 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) return;
    suppressTapUntil.current = Date.now() + 350;
    step(distanceX < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (paused || playing || reducedMotion) return;
    const timer = window.setInterval(() => step(1), 4800);
    return () => window.clearInterval(timer);
  }, [active, paused, playing, reducedMotion]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!SHOW_VIDEO_STATS) return;
    const controller = new AbortController();
    fetch('/api/youtube-stats', { signal: controller.signal })
      .then(response => response.ok ? response.json() as Promise<{ items?: VideoStats }> : null)
      .then(data => { if (data?.items) setStats(data.items); })
      .catch(error => { if (error.name !== 'AbortError') console.warn('YouTube stats indisponíveis'); });
    return () => controller.abort();
  }, []);

  const activeStats = SHOW_VIDEO_STATS ? stats[stageThumbnails[active].videoId] : undefined;

  return <section className="broadcast-section" id="esports-broadcast" aria-labelledby="broadcast-heading">
    <span className="broadcast-watermark" data-motion-watermark aria-hidden="true">ESPORTS</span>
    <div className="broadcast-header">
      <div className="broadcast-top" data-motion-reveal><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>YOUTUBE &amp; THUMBNAILS — 04</span></div>
      <div className="broadcast-title-row" data-motion-reveal>
        <h2 id="broadcast-heading">Esports</h2>
        <div className="broadcast-platforms" aria-label="Plataformas de publicação">
          <span className="platform-youtube"><img src="/icons/social/youtube.svg" alt="YouTube" /></span>
          <span className="platform-x"><img src="/icons/social/x-twitter.svg" alt="X" /></span>
          <span className="platform-twitch"><img src="/icons/social/twitch.svg" alt="Twitch" /></span>
          <span className="platform-kick"><img src="/icons/social/kick.svg" alt="Kick" /></span>
        </div>
      </div>
    </div>

    <div className="broadcast-stage" data-motion-stage="30" data-motion-image-group onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="broadcast-stage-cards" onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchStart.current = null; setPaused(false); }}>
        {stageThumbnails.map((thumb, index) => {
          let offset = index - active;
          if (offset > stageThumbnails.length / 2) offset -= stageThumbnails.length;
          if (offset < -stageThumbnails.length / 2) offset += stageThumbnails.length;
          return <button className="broadcast-stage-card" data-active={offset === 0} key={thumb.src} tabIndex={Math.abs(offset) > 1 ? -1 : 0} aria-hidden={Math.abs(offset) > 1} onClick={() => { if (Date.now() < suppressTapUntil.current) { suppressTapUntil.current = 0; return; } if (offset === 0) { setPlaying(true); } else { setPlaying(false); setActive(index); } }} style={{ transform: `translate(-50%, -50%) translateX(${offset * 35}%) scale(${1 - Math.abs(offset) * .03})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 1 ? 0 : 1, pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto' }} aria-label={offset === 0 ? `Reproduzir ${thumb.title}` : `Destacar ${thumb.title}`}>
            <img src={thumb.src} alt={thumb.title} data-motion-card-image loading={Math.abs(offset) < 2 ? 'eager' : 'lazy'} />
            <span className="broadcast-stage-play" aria-hidden="true"><Play fill="currentColor" /></span>
          </button>;
        })}
        {playing && <div className="broadcast-stage-player">
          <iframe src={`https://www.youtube.com/embed/${stageThumbnails[active].videoId}?autoplay=1&rel=0&playsinline=1`} title={`Vídeo: ${stageThumbnails[active].title}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          <button type="button" className="broadcast-stage-player-close" onClick={() => setPlaying(false)} aria-label="Fechar vídeo"><X size={19} /></button>
        </div>}
        <button type="button" className="broadcast-stage-arrow broadcast-stage-arrow-prev" onClick={() => step(-1)} aria-label="Thumbnail anterior"><ArrowLeft size={22} /></button>
        <button type="button" className="broadcast-stage-arrow broadcast-stage-arrow-next" onClick={() => step(1)} aria-label="Próxima thumbnail"><ArrowRight size={22} /></button>
      </div>
      <div className={`broadcast-stage-caption${SHOW_VIDEO_STATS ? '' : ' broadcast-stage-caption-compact'}`}>
        <strong>{stageThumbnails[active].title}</strong>
        {SHOW_VIDEO_STATS && <span className="broadcast-stage-stats" aria-label={activeStats ? `${compactNumber(activeStats.views)} visualizações e ${compactNumber(activeStats.likes)} curtidas` : 'Métricas do vídeo carregando'}>
          <span><Eye aria-hidden="true" />{activeStats ? `${compactNumber(activeStats.views)} visualizações` : '— visualizações'}</span>
          <span><ThumbsUp aria-hidden="true" />{activeStats ? `${compactNumber(activeStats.likes)} curtidas` : '— curtidas'}</span>
        </span>}
      </div>
    </div>

    <div className="broadcast-reel" data-motion-stage="20" aria-label="Vídeos com thumbnails selecionadas">
      <div className="broadcast-track">
        {[0, 1].map(copy => <div className="broadcast-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
          {thumbnails.map(thumb => <a href={`https://www.youtube.com/watch?v=${thumb.videoId}`} target="_blank" rel="noreferrer" className="broadcast-reel-card" tabIndex={copy === 1 ? -1 : 0} key={`${copy}-${thumb.src}`} aria-label={`Assistir ${thumb.title} no YouTube`}>
            <span className="broadcast-reel-image"><img src={thumb.src} alt={copy === 0 ? thumb.title : ''} loading="lazy" /><span className="broadcast-play"><Play fill="currentColor" /></span></span>
            <span className="broadcast-reel-title"><span><strong>{thumb.title}</strong>{SHOW_VIDEO_STATS && <span className="broadcast-stats" aria-label={stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].views)} visualizações e ${compactNumber(stats[thumb.videoId].likes)} curtidas` : 'Métricas do vídeo carregando'}>
              <span><Eye />{stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].views)} visualizações` : '— visualizações'}</span>
              <span><ThumbsUp />{stats[thumb.videoId] ? `${compactNumber(stats[thumb.videoId].likes)} curtidas` : '— curtidas'}</span>
            </span>}</span><ExternalLink /></span>
          </a>)}
        </div>)}
      </div>
    </div>
    <p className="broadcast-hint">Passe o mouse para pausar · Clique em uma thumb para assistir ao vídeo</p>
  </section>;
}
