'use client';

import { useRef, useState, type TouchEvent } from 'react';
import { ArrowDown, ArrowUpRight, Menu, X, Pause, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { gameThumbnailRows } from './games-thumbnails';

const features = [
  { id: 'worlds', href: '#worlds', title: 'Artes · Worlds', label: '2023–2024 · Key art & pôsteres', src: '/trabalhos/worlds-hero-test.png?v=ebbd013a', width: 2058, height: 1350, position: 'center 30%' },
  { id: 'esports', href: '#esports-broadcast', title: 'Esports · Broadcast', label: 'Thumbnails & transmissões', src: '/trabalhos/esports-hero-test.jpg?v=09d08c68', width: 2560, height: 1877, position: 'center 35%' },
  { id: 'gaming', href: '#games-thumbnails', title: 'Conteúdo · Gaming', label: 'Thumbnails para games', src: '/trabalhos/gaming-hero-test.jpg', width: 2560, height: 1440, position: 'center center' },
  { id: 'other-work', href: '#projetos', title: 'Outros Trabalhos', label: 'Música, identidade visual & game design', src: '/trabalhos/west-reis-hero.jpg', width: 2560, height: 1683, position: 'left center' },
];

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
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressTapUntil = useRef(0);

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

  return <section className={`cinema-hero ${paused ? 'motion-paused' : ''}`} id="inicio" aria-label="Projetos em destaque" onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { touchStart.current = null; }} onClickCapture={event => { if (Date.now() < suppressTapUntil.current) { event.preventDefault(); event.stopPropagation(); suppressTapUntil.current = 0; } }}>
    <div className="hero-visuals" aria-hidden="true">
      {features.map((item, index) => <div key={item.id} className={`hero-frame hero-frame-${item.id} ${index === active ? 'is-active' : ''}`}>
        {item.id === 'gaming' ? <div className="hero-gaming-mural">
          {gamingMuralRows.map((images, rowIndex) => <div className="hero-gaming-mural-row" style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }} key={rowIndex}>
            {images.map(image => <div className="hero-gaming-mural-tile" key={image}><img src={gamingMuralSrc(image)} alt="" loading="lazy" draggable={false} /></div>)}
          </div>)}
        </div> : <img src={item.src} alt="" width={item.width} height={item.height} style={{ objectPosition: item.position }} fetchPriority={index === 0 ? 'high' : 'auto'} />}
      </div>)}
    </div>
    <header className="cinema-header">
      <button className="hero-menu" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu size={23}/><span>Menu</span></button>
      <a className="signature" href="#inicio" aria-label="Jonathan Bolanle, início">Jonathan<span>Bolanle</span></a>
      <a className="hero-contact" href="#contato">Vamos conversar <ArrowUpRight size={17}/></a>
    </header>
    <div className="hero-bottom">
      <div className="hero-selection"><span className="hero-kicker">Seleção de trabalhos</span>
        <nav className="hero-projects" aria-label="Ir para uma seção do portfólio">
          {features.map((item, index) => <a key={item.id} href={item.href} className={index === active ? 'is-active' : ''} onPointerEnter={event => { if(event.pointerType === 'mouse') setActive(index); }} onFocus={() => setActive(index)} onClick={() => setActive(index)}>{item.title}</a>)}
        </nav>
      </div>
      <div className="hero-actions"><p aria-live="polite">{features[active].label}</p><a className="campaign-link" href={features[active].href}>Ver seção <ArrowUpRight size={18}/></a><div className="hero-utilities"><button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Ativar movimento das imagens' : 'Pausar movimento das imagens'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button><a href="#projetos" aria-label="Explorar todos os trabalhos"><ArrowDown size={25}/></a></div></div>
    </div>
    <Dialog open={menu} onOpenChange={setMenu}><DialogContent className="nav-dialog" showCloseButton={false}><div className="nav-dialog-top"><DialogTitle>Jonathan Bolanle</DialogTitle><DialogClose className="icon-button" aria-label="Fechar menu"><X size={24}/></DialogClose></div><DialogDescription className="sr-only">Navegação do portfólio</DialogDescription><nav aria-label="Navegação principal">{[['Trabalhos','#projetos'],['Sobre','#sobre'],['Contato','#contato']].map(([label,href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight/></a>)}</nav><a className="menu-email" href="mailto:jotabolanle@gmail.com">jotabolanle@gmail.com</a></DialogContent></Dialog>
  </section>;
}
