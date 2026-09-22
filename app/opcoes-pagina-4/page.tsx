'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Grid3X3, Layers3, MousePointer2, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import styles from './preview.module.css';

const posters = [
  { src: '/posters/poster-viagem-londres-worlds.webp', title: 'Worlds em Londres', year: '2024' },
  { src: '/posters/final-worlds-2023.webp', title: 'Final Worlds', year: '2023' },
  { src: '/posters/semifinal-worlds-2023.webp', title: 'Semifinal T1 × JDG', year: '2023' },
  { src: '/posters/semifinal2-worlds-2023.webp', title: 'Semifinal Worlds', year: '2023' },
  { src: '/posters/final-worlds-2024.webp', title: 'Grande Final Worlds', year: '2024' },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function PageFourOptions() {
  const [active, setActive] = useState(2);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const storyRef = useRef<HTMLElement | null>(null);

  const step = (direction: number) => setActive(index => (index + direction + posters.length) % posters.length);
  const stepSelected = (direction: number) => setSelected(index => index === null ? null : (index + direction + posters.length) % posters.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => step(1), 4500);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const update = () => {
      if (!storyRef.current) return;
      const rect = storyRef.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      setScrollProgress(clamp(-rect.top / distance));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') stepSelected(1);
      if (event.key === 'ArrowLeft') stepSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <a href="/">JONATHAN BOLANLE</a>
      <nav aria-label="Opções da página 4"><a href="#palco">01 PALCO</a><a href="#scroll">02 SCROLL</a><a href="#parede">03 PAREDE</a></nav>
      <a href="/" className={styles.back}>Voltar ao portfólio <ArrowUpRight size={15} /></a>
    </header>

    <section className={styles.intro}>
      <span>ESTUDO DE INTERAÇÃO / PÁGINA 04</span>
      <h1>Três movimentos<br />para o mesmo case.</h1>
      <p>Worlds 2023 &amp; 2024 · Campanha e key art</p>
    </section>

    <section className={styles.option} id="palco">
      <div className={styles.optionHead}><div><span className={styles.number}>01</span><p>PALCO DE PÔSTERES</p></div><div className={styles.icon}><MousePointer2 size={19} /></div></div>
      <div className={styles.optionCopy}><h2>Um trabalho<br />por vez.</h2><p>O pôster ativo ocupa o centro; os demais permanecem visíveis nas laterais. A troca é discreta, automática e controlável.</p></div>
      <div className={styles.coverflow} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
        {posters.map((poster, index) => {
          let offset = index - active;
          if (offset > posters.length / 2) offset -= posters.length;
          if (offset < -posters.length / 2) offset += posters.length;
          return <button key={poster.src} className={styles.coverCard} data-active={offset === 0} onClick={() => offset === 0 ? setSelected(index) : setActive(index)} style={{ transform: `translate(-50%, -50%) translateX(${offset * 53}%) translateZ(${Math.abs(offset) * -120}px) rotateY(${offset * -9}deg) scale(${1 - Math.abs(offset) * .08})`, zIndex: 10 - Math.abs(offset), opacity: Math.abs(offset) > 2 ? 0 : 1 }} aria-label={offset === 0 ? `Ampliar ${poster.title}` : `Destacar ${poster.title}`}>
            <img src={poster.src} alt={poster.title} /><span>{poster.year}</span>
          </button>;
        })}
        <div className={styles.stageControls}><button onClick={() => step(-1)} aria-label="Pôster anterior"><ArrowLeft /></button><div><span>{String(active + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span><strong>{posters[active].title}</strong></div><button onClick={() => step(1)} aria-label="Próximo pôster"><ArrowRight /></button></div>
      </div>
    </section>

    <section className={styles.scrollStory} id="scroll" ref={storyRef}>
      <div className={styles.scrollSticky}>
        <div className={styles.optionHead}><div><span className={styles.number}>02</span><p>PILHA GUIADA PELO SCROLL</p></div><div className={styles.icon}><Layers3 size={19} /></div></div>
        <div className={styles.scrollCopy}><h2>A campanha<br />se abre em cena.</h2><p>Continue descendo. Os pôsteres entram pela base e formam uma composição em leque.</p><span>{String(Math.min(posters.length, Math.max(1, Math.ceil(scrollProgress * posters.length)))).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span></div>
        <div className={styles.posterStack}>
          {posters.map((poster, index) => {
            const reveal = clamp(scrollProgress * 1.55 - index * .14);
            const spread = (index - (posters.length - 1) / 2);
            return <button key={poster.src} className={styles.stackCard} onClick={() => setSelected(index)} style={{ transform: `translate(-50%, ${108 - reveal * 158}%) translateX(${spread * reveal * 31}%) rotate(${spread * reveal * 5.5}deg) scale(${.78 + reveal * .22})`, opacity: .08 + reveal * .92, zIndex: index + 1 }} aria-label={`Ampliar ${poster.title}`}><img src={poster.src} alt={poster.title} /></button>;
          })}
        </div>
      </div>
    </section>

    <section className={`${styles.option} ${styles.wallOption}`} id="parede">
      <div className={styles.optionHead}><div><span className={styles.number}>03</span><p>PAREDE EDITORIAL INTERATIVA</p></div><div className={styles.icon}><Grid3X3 size={19} /></div></div>
      <div className={styles.optionCopy}><h2>Todos em cena.<br />Um ganha foco.</h2><p>A composição permanece aberta. Ao passar o mouse, uma peça assume o primeiro plano e reorganiza o ritmo visual.</p></div>
      <div className={styles.posterWall}>
        {posters.map((poster, index) => <button key={poster.src} className={styles.wallCard} onClick={() => setSelected(index)} aria-label={`Ampliar ${poster.title}`}><img src={poster.src} alt={poster.title} /><span><small>{poster.year}</small>{poster.title}</span></button>)}
      </div>
    </section>

    <footer className={styles.footer}><span>COMPARAÇÃO INTERATIVA / 2026</span><a href="#palco">Voltar ao início ↑</a></footer>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className={styles.dialog} showCloseButton={false}>
        {selected !== null && <div className={styles.lightbox}>
          <DialogTitle className="sr-only">{posters[selected].title}</DialogTitle>
          <DialogDescription className="sr-only">Pôster ampliado. Use as setas para navegar.</DialogDescription>
          <img src={posters[selected].src} alt={posters[selected].title} />
          <div className={styles.lightboxControls}><button onClick={() => stepSelected(-1)} aria-label="Pôster anterior"><ArrowLeft /></button><div><span>{String(selected + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}</span><strong>{posters[selected].title}</strong></div><button onClick={() => stepSelected(1)} aria-label="Próximo pôster"><ArrowRight /></button></div>
          <DialogClose className={styles.close} aria-label="Fechar"><X /></DialogClose>
        </div>}
      </DialogContent>
    </Dialog>
  </main>;
}
