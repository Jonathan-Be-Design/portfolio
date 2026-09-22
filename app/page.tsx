'use client';

import { ArrowUpRight, Download, Mail } from 'lucide-react';
import PortfolioHero from './portfolio-hero';

type Work = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  images: string[];
  tone: string;
};

const works: Work[] = [
  {
    id: 'esports', number: '02', eyebrow: 'CONTEÚDO & BROADCAST', title: 'Esports em tempo real.',
    description: 'Chamadas de programação, campeonatos, convidados e transmissões para Ilha das Lendas e Baiano.',
    images: ['/trabalhos/esports-13.jpg', '/trabalhos/esports-06.jpg', '/trabalhos/esports-10.jpg', '/trabalhos/esports-11.jpg'], tone: 'magenta',
  },
  {
    id: 'gaming', number: '03', eyebrow: 'YOUTUBE & CREATORS', title: 'Uma história antes do clique.',
    description: 'Composição, tratamento e hierarquia visual para conteúdo de games e entretenimento.',
    images: ['/trabalhos/gaming-01.jpg', '/trabalhos/gaming-02.jpg', '/trabalhos/gaming-05.jpg', '/trabalhos/gaming-11.jpg'], tone: 'red',
  },
  {
    id: 'west-reis', number: '04', eyebrow: 'MÚSICA & IDENTIDADE', title: 'West Reis.',
    description: 'Direção visual e sistema gráfico para apresentar trajetória, números e presença digital.',
    images: ['/trabalhos/west-reis-01.jpg', '/trabalhos/west-reis-02.jpg', '/trabalhos/west-reis-04.jpg', '/trabalhos/west-reis-08.jpg'], tone: 'wine',
  },
  {
    id: 'drew', number: '05', eyebrow: 'BRAND SYSTEM', title: 'DREW.',
    description: 'Identidade visual, linguagem de marca e aplicações para um projeto conectado à cultura de rua.',
    images: ['/trabalhos/drew-01.png'], tone: 'yellow',
  },
  {
    id: '1936', number: '06', eyebrow: 'PROJETO AUTORAL', title: '1936.',
    description: 'Identidade, interface, ilustração e tipografia para um universo narrativo próprio.',
    images: ['/trabalhos/1936-13.png', '/trabalhos/1936-01.png', '/trabalhos/1936-07.png', '/trabalhos/1936-11.png'], tone: 'orange',
  },
];

function Img({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

export default function Home() {
  const scrollToWorlds = () => document.querySelector('#worlds')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <main id="conteudo" className="site-shell">
        <PortfolioHero onOpen={scrollToWorlds} />

        <section className="cred-section ruled" id="credibilidade" aria-labelledby="cred-title">
          <div className="section-meta"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>MARCAS &amp; PARCEIROS — 02</span></div>
          <h2 id="cred-title" className="pill-title">MARCAS E CRIADORES COM QUEM CONTRIBUÍ</h2>
          <div className="brand-row" aria-label="Marcas e criadores"><strong>BAIANO</strong><strong>ILHA DAS<br />LENDAS</strong><strong>OMELETE<span>&amp;CO</span></strong><strong>MNRV</strong></div>
          <p className="partner-label">PEÇAS PARA CAMPANHAS DE PARCEIROS NACIONAIS E GLOBAIS</p>
          <div className="partner-row"><span>RIOT GAMES</span><span>CBLOL</span><span>HEINEKEN</span><span>SNAPDRAGON</span><span>SADIA</span></div>
        </section>

        <section className="impact-section ruled" aria-labelledby="impact-title">
          <div className="section-meta"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>IMPACTO &amp; ESCALA — 03</span></div>
          <h2 id="impact-title" className="pill-title green">VISUALIZAÇÕES E IMPRESSÕES ACUMULADAS</h2>
          <div className="stats-grid">
            <article><strong>400M+</strong><p>Visualizações em vídeos longos</p></article>
            <article><strong>2B+</strong><p>Impressões nas redes sociais</p></article>
            <article><strong>5K+</strong><p>Imagens, vídeos e animações produzidas</p></article>
          </div>
          <div className="impact-strip" aria-label="Seleção de peças de conteúdo">
            {['worlds-2024-02.jpg','esports-06.jpg','esports-13.jpg','gaming-02.jpg','gaming-05.jpg','esports-04.jpg'].map((name, i) => <Img key={name} src={`/trabalhos/${name}`} alt={`Peça de conteúdo ${i + 1}`} />)}
          </div>
        </section>

        <section className="case-section" id="worlds" aria-labelledby="worlds-title">
          <div className="case-intro ruled">
            <div className="section-meta"><span>CASE 01 / CAMPANHA &amp; KEY ART</span><span>WORLDS — 2023 / 2024</span></div>
            <div className="case-title-row"><div><p className="micro-label">ILHA DAS LENDAS + BAIANO</p><h2 id="worlds-title">Worlds<br /><span>2023—2024</span></h2></div><p>Key arts para anunciar as co-streams oficiais de Baiano e Ilha das Lendas, parceiros oficiais da Riot Games na transmissão brasileira do campeonato.</p></div>
          </div>

          <div className="worlds-hero-grid">
            <Img src="/trabalhos/worlds-2023-01.jpg" alt="Key art Worlds 2023 com jogadores da T1 e JDG" eager />
            <Img src="/trabalhos/worlds-2024-03.jpg" alt="Key art Worlds 2024 com Faker e a grande final" eager />
          </div>

          <div className="case-context ruled">
            <div><p className="micro-label">CONTEXTO</p><h3>O campeonato<br />ganha uma<br />voz brasileira.</h3></div>
            <div className="context-copy"><p>Durante o Worlds 2023 e 2024, Baiano e Ilha das Lendas foram parceiros oficiais da Riot Games na transmissão brasileira do campeonato. As peças foram desenvolvidas para anunciar as co-streams oficiais e apresentar cada etapa do torneio com o impacto visual de um dos maiores eventos de esports do mundo.</p><p>O desafio foi transformar partidas, confrontos e momentos decisivos em key arts com leitura imediata, combinando jogadores, equipes, troféus e elementos do campeonato.</p></div>
          </div>

          <div className="year-block year-2023 ruled">
            <div className="year-copy"><p className="micro-label">DIREÇÃO CROMÁTICA / 2023</p><h3>Azul contra<br /><span>vermelho.</span></h3><p>Os materiais oficiais da Riot Games exploraram intensamente essa combinação. A linguagem influenciou diretamente as peças de Baiano e Ilha das Lendas, criando conexão imediata com o campeonato sem perder a identidade da cobertura brasileira.</p></div>
            <div className="year-gallery"><Img src="/trabalhos/worlds-2023-02.jpg" alt="Arte da final do Worlds 2023" /><Img src="/trabalhos/worlds-2023-03.jpg" alt="Arte de confronto do Worlds 2023" /></div>
          </div>

          <div className="year-block year-2024 ruled">
            <div className="year-gallery"><Img src="/trabalhos/worlds-2024-01.jpg" alt="Arte Worlds 2024 em Londres" /><Img src="/trabalhos/worlds-2024-02.jpg" alt="Arte do troféu Worlds 2024" /></div>
            <div className="year-copy"><p className="micro-label">DIREÇÃO CROMÁTICA / 2024</p><h3>Uma nova<br /><span>atmosfera.</span></h3><p>Em 2024, a comunicação oficial adotou uma direção predominantemente azul. As artes acompanharam a mudança, incorporando a nova atmosfera cromática aos anúncios da co-stream.</p></div>
          </div>

          <div className="responsibility ruled"><p className="micro-label">RESPONSABILIDADES</p><p>Criação das key arts, pesquisa e seleção de imagens, composição dos jogadores, tratamento fotográfico, definição da hierarquia tipográfica e adaptação da identidade oficial do campeonato.</p><span>PHOTOSHOP · DIREÇÃO DE ARTE · COMPOSIÇÃO · TRATAMENTO</span></div>
        </section>

        <section className="selected-heading ruled" id="projetos" aria-labelledby="selected-title">
          <div className="section-meta"><span>TRABALHOS SELECIONADOS</span><span>02 — 06</span></div>
          <h2 id="selected-title">Outros universos.<br /><span>A mesma intenção.</span></h2>
        </section>

        {works.map((work, workIndex) => (
          <section className={`work-story tone-${work.tone} ruled`} id={work.id} key={work.id} aria-labelledby={`${work.id}-title`}>
            <div className="work-story-head"><div><p className="micro-label">{work.eyebrow} / {work.number}</p><h2 id={`${work.id}-title`}>{work.title}</h2></div><p>{work.description}</p></div>
            {work.images.length === 1 ? (
              <div className="long-case"><Img src={work.images[0]} alt={`Projeto ${work.title}`} /></div>
            ) : (
              <div className={`story-grid story-grid-${workIndex % 2}`}>
                {work.images.map((src, i) => <Img key={src} src={src} alt={`${work.title}, peça ${i + 1}`} />)}
              </div>
            )}
          </section>
        ))}

        <section className="about-section-new ruled" id="sobre" aria-labelledby="about-title">
          <div className="section-meta"><span>JONATHAN BOLANLE</span><span>SOBRE — 07</span></div>
          <div className="about-layout"><div><p className="micro-label">DESIGN, CULTURA &amp; UM BOM REPERTÓRIO</p><h2 id="about-title">Design que<br />ganha <span>escala.</span></h2></div><div className="about-copy-new"><p className="lead">Há 5 anos, transformo ideias em imagens para criadores de conteúdo, games e esports.</p><p>Minha trajetória inclui a liderança de design para Ilha das Lendas e Baiano, além de trabalhos com a Omelete Company em campanhas e eventos como a CCXP Brasil.</p><div className="skills"><span>CAMPANHAS &amp; KEY ART</span><span>IDENTIDADE VISUAL</span><span>CONTEÚDO &amp; BROADCAST</span><span>EDIÇÃO DE VÍDEO</span></div><div className="resume-links-new"><a href="/curriculo-pt.pdf" target="_blank" rel="noreferrer">Currículo em português <Download size={16} /></a><a href="/curriculo-en.pdf" target="_blank" rel="noreferrer">Résumé in English <Download size={16} /></a></div></div></div>
        </section>

        <section className="contact-section-new ruled" id="contato" aria-labelledby="contact-title">
          <div className="section-meta"><span>ABERTO A NOVOS PROJETOS</span><span>CONTATO — 08</span></div>
          <a href="mailto:jotabolanle@gmail.com" className="contact-call"><h2 id="contact-title">Vamos criar<br /><span>algo marcante?</span></h2><ArrowUpRight aria-hidden="true" /></a>
          <div className="contact-grid"><p>Projetos pontuais, parcerias recorrentes<br />e oportunidades em equipes de criação.</p><a href="mailto:jotabolanle@gmail.com"><Mail size={18} /> jotabolanle@gmail.com</a><a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} /></a></div>
        </section>
      </main>
      <footer className="folio-footer"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><span>RIO DE JANEIRO, BRASIL</span><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>
    </>
  );
}
