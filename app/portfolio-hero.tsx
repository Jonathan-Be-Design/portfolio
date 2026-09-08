'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, X, Pause, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

const features = [
  { id: 'west-reis', title: 'West Reis', label: 'Media kit', src: '/trabalhos/west-reis-01.jpg', position: '65% 42%' },
  { id: 'worlds-2023', title: 'Worlds 2023', label: 'Key art & pôsteres', src: '/trabalhos/worlds-2023-01.jpg', position: 'center 36%' },
  { id: 'gaming', title: 'Gaming Content', label: 'Thumbnails', src: '/trabalhos/gaming-01.jpg', position: '42% center' },
  { id: 'esports', title: 'Esports & Broadcast', label: 'Thumbnails & transmissões', src: '/trabalhos/esports-01.jpg', position: '60% center' },
];

export default function PortfolioHero({ onOpen }: { onOpen: (id: string) => void }) {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(false);
  return <section className={`cinema-hero ${paused ? 'motion-paused' : ''}`} id="inicio" aria-label="Projetos em destaque">
    <div className="hero-visuals" aria-hidden="true">
      {features.map((item, index) => <div key={item.id} className={`hero-frame ${index === active ? 'is-active' : ''}`}><img src={item.src} alt="" width={1200} height={item.id === 'worlds-2023' ? 1500 : 675} style={{ objectPosition: item.position }} fetchPriority={index === 0 ? 'high' : 'auto'} /></div>)}
    </div>
    <header className="cinema-header">
      <button className="hero-menu" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu size={23}/><span>Menu</span></button>
      <a className="signature" href="#inicio" aria-label="Jonathan Bolanle, início">Jonathan<span>Bolanle</span></a>
      <a className="hero-contact" href="#contato">Vamos conversar <ArrowUpRight size={17}/></a>
    </header>
    <div className="hero-intro"><h1>Design & edição de vídeo.</h1><p>Jonathan Bolanle · Rio de Janeiro</p></div>
    <div className="hero-bottom">
      <div className="hero-selection"><span className="hero-kicker">Seleção de trabalhos / 01 — 04</span>
        <div className="hero-projects" role="group" aria-label="Escolher projeto em destaque">
          {features.map((item, index) => <button key={item.id} className={index === active ? 'is-active' : ''} aria-pressed={index === active} onPointerEnter={event => { if(event.pointerType === 'mouse') setActive(index); }} onFocus={() => setActive(index)} onClick={() => setActive(index)}>{item.title}<span>{String(index + 1).padStart(2,'0')}</span></button>)}
        </div>
      </div>
      <div className="hero-actions"><p aria-live="polite">{features[active].label}</p><button className="campaign-link" onClick={() => onOpen(features[active].id)}>Ver projeto <ArrowUpRight size={18}/></button><div className="hero-utilities"><button className="motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? 'Ativar movimento das imagens' : 'Pausar movimento das imagens'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button><a href="#projetos" aria-label="Explorar todos os trabalhos"><ArrowDown size={25}/></a></div></div>
    </div>
    <Dialog open={menu} onOpenChange={setMenu}><DialogContent className="nav-dialog" showCloseButton={false}><div className="nav-dialog-top"><DialogTitle>Jonathan Bolanle</DialogTitle><DialogClose className="icon-button" aria-label="Fechar menu"><X size={24}/></DialogClose></div><DialogDescription className="sr-only">Navegação do portfólio</DialogDescription><nav aria-label="Navegação principal">{[['Trabalhos','#projetos'],['Sobre','#sobre'],['Contato','#contato']].map(([label,href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}<ArrowUpRight/></a>)}</nav><a className="menu-email" href="mailto:jotabolanle@gmail.com">jotabolanle@gmail.com</a></DialogContent></Dialog>
  </section>;
}
