'use client';

import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function PortfolioHero({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="folio-hero" id="inicio" aria-labelledby="hero-title">
      <div className="folio-hero-art" aria-hidden="true">
        <img src="/trabalhos/worlds-2023-01.jpg" alt="" width={1200} height={1500} />
      </div>
      <div className="folio-hero-shade" aria-hidden="true" />

      <header className="folio-nav">
        <a className="folio-brand" href="#inicio">Jonathan<br />Bolanle</a>
        <nav aria-label="Navegação principal">
          <a href="#projetos">Trabalhos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="folio-talk" href="#contato">Vamos conversar <ArrowUpRight size={15} /></a>
      </header>

      <div className="folio-side folio-side-left" aria-hidden="true">
        <span>KERIA</span><span>GUMAYUSI</span><span>FAKER</span>
      </div>
      <div className="folio-side folio-side-right" aria-hidden="true">
        <span>01</span><span>PORTFÓLIO / 2026</span>
      </div>

      <div className="folio-hero-copy">
        <p className="folio-overline">PRINCIPAIS TRABALHOS / 2021 — 2026</p>
        <h1 id="hero-title">Esports &amp; Broadcast<br />YouTube &amp; Creators<br />Key Art &amp; Media</h1>
      </div>

      <div className="folio-hero-meta">
        <p>Designer Gráfico<br /><span>Rio de Janeiro</span></p>
        <strong>5 ANOS DE EXPERIÊNCIA</strong>
        <button onClick={() => onOpen('worlds')}>Ver projeto em destaque <ArrowUpRight size={15} /></button>
      </div>

      <a className="folio-scroll" href="#credibilidade" aria-label="Continuar para a próxima seção"><ArrowDown size={20} /></a>
    </section>
  );
}
