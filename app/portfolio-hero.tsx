'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUpRight, Menu, Pause, Play } from 'lucide-react';
import { gameThumbnailRows } from './games-thumbnails';

const features = [
  { id: 'worlds', href: '#worlds', title: 'Artes · Worlds', label: '2023–2024 · Key art & pôsteres', src: '/trabalhos/worlds-hero-test.png?v=ebbd013a', width: 2058, height: 1350, position: 'center 30%' },
  { id: 'esports', href: '#esports-broadcast', title: 'Esports · Broadcast', label: 'Thumbnails & transmissões', src: '/trabalhos/final-worlds-2023-cover.webp', width: 2400, height: 1760, position: 'center 35%' },
  { id: 'gaming', href: '#games-thumbnails', title: 'Conteúdo · Gaming', label: 'Thumbnails para games', src: '/trabalhos/gaming-hero-test.jpg', width: 2560, height: 1440, position: 'center center' },
  { id: 'other-work', href: '#projetos', title: 'Outros Trabalhos', label: 'Música, identidade visual & game design', src: '/trabalhos/west-reis-hero.jpg', width: 2560, height: 1683, position: 'left center' },
];

const menuItems = [
  ['Artes · Worlds', '#worlds'],
  ['Impacto & Escala', '#impacto'],
  ['Esports · Broadcast', '#esports-broadcast'],
  ['Gaming', '#games-thumbnails'],
  ['Outros Trabalhos', '#projetos'],
  ['Marcas & Parceiros', '#marcas'],
  ['Sobre', '#sobre'],
  ['Contato', '#contato'],
] as const;

const gamingMuralRows = [
  gameThumbnailRows[0].slice(0, 5),
  gameThumbnailRows[1].slice(0, 3),
  [...gameThumbnailRows[0].slice(5), gameThumbnailRows[1][3]],
  gameThumbnailRows[1].slice(4),
];

const gamingMuralSrc = (filename: string) =>
  filename === 'minerva-pokemon-minecraft.jpg' || filename === 'minerva-liars-bar.jpg'
    ? `/games-thumbnails/${filename}`
    : `/impact/${filename.replace(/\.jpg$/, '.webp')}`;

export default function PortfolioHero() {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressTapUntil = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    const updateHeader = () => setIsFloating(window.scrollY > 64);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const startSwipe = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) return;
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const endSwipe = (event: TouchEvent<HTMLElement>) => {
    if (!touchStart.current) return;
    const distanceX = event.changedTouches[0].clientX - touchStart.current.x;
    const distanceY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(distanceX) < 55 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) return;
    suppressTapUntil.current = Date.now() + 350;
    setActive(index => (index + (distanceX < 0 ? 1 : -1) + features.length) % features.length);
  };

  const header = <header className={`cinema-header ${isFloating ? 'is-floating' : ''} ${menu ? 'menu-open' : ''}`}>
    <a className="signature" href="#inicio" aria-label="Jonathan Bolanle, início">
      <span className="signature-name"><span>Jonathan</span><span>Bolanle</span></span>
      <span className="signature-monogram" aria-hidden="true">JB</span>
    </a>
    <div className="hero-nav-shell">
      <a className="hero-contact nav-pill" href="#contato">Vamos conversar <ArrowUpRight size={17}/></a>
      <button className="hero-menu nav-pill" onClick={() => setMenu(open => !open)} aria-expanded={menu} aria-controls="portfolio-navigation"><span>{menu ? 'Fechar' : 'Menu'}</span><Menu size={18}/></button>
    </div>
    {menu && <nav className="hero-menu-panel" id="portfolio-navigation" aria-label="Navegação principal">
      {menuItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight aria-hidden="true" /></a>)}
    </nav>}
  </header>;

  return <>
  <section className={`cinema-hero ${paused ? 'motion-paused' : ''}`} id="inicio" aria-label="Projetos em destaque" onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchStart.current = null; }} onClickCapture={event => { if (Date.now() < suppressTapUntil.current) { event.preventDefault(); event.stopPropagation(); suppressTapUntil.current = 0; } }}>
    <div className="hero-visuals" aria-hidden="true">
      {features.map((item, index) => <div key={item.id} className={`hero-frame hero-frame-${item.id} ${index === active ? 'is-active' : ''}`}>
        {item.id === 'gaming' ? <div className="hero-gaming-mural">
          {gamingMuralRows.map((images, rowIndex) => <div className="hero-gaming-mural-row" style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }} key={rowIndex}>
            {images.map(image => <div className="hero-gaming-mural-tile" key={image}><img src={gamingMuralSrc(image)} alt="" loading="lazy" draggable={false} /></div>)}
          </div>)}
        </div> : <img src={item.src} alt="" width={item.width} height={item.height} style={{ objectPosition: item.position }} fetchPriority={index === 0 ? 'high' : 'auto'} />}
      </div>)}
    </div>
    <div className="cinema-header-spacer" aria-hidden="true" />
    <div className="hero-bottom">
      <div className="hero-selection"><span className="hero-kicker">Seleção de trabalhos</span>
        <nav className="hero-projects" aria-label="Ir para uma seção do portfólio">
          {features.map((item, index) => <a key={item.id} href={item.href} className={index === active ? 'is-active' : ''} onPointerEnter={event => { if(event.pointerType === 'mouse') setActive(index); }} onFocus={() => setActive(index)} onClick={() => setActive(index)}>{item.title}</a>)}
        </nav>
      </div>
      <div className="hero-actions"><p aria-live="polite">{features[active].label}</p><a className="campaign-link" href={features[active].href}>Ver seção <ArrowUpRight size={18}/></a><div className="hero-utilities"><button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Ativar movimento das imagens' : 'Pausar movimento das imagens'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button><a href="#projetos" aria-label="Explorar todos os trabalhos"><ArrowDown size={25}/></a></div></div>
    </div>
  </section>
  {!isMounted ? header : createPortal(header, document.body)}
  </>;
}
