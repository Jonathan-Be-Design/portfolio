'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, X, Mail, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { projects, type Project } from './selected-projects';
import PortfolioHero from './portfolio-hero';
import PosterStage from './poster-stage';
import EsportsBroadcast from './esports-broadcast';
import GamesThumbnails from './games-thumbnails';
import LivePosters from './live-posters';

const featuredBrands = [
  { name: 'Baiano', logo: '/logos/baiano.png', lines: ['STREAMER', 'E-SPORTS'], className: 'baiano' },
  { name: 'Ilha das Lendas', logo: '/logos/ilha-das-lendas.svg', lines: ['CREATORS', 'E-SPORTS'], className: 'idl' },
  { name: 'Omelete & Co', logo: '/logos/omelete-co.png', lines: ['ENTRETENIMENTO', 'E-SPORTS'], className: 'omelete' },
  { name: 'Minerva', logo: '/logos/minerva.png', lines: ['ENTRETENIMENTO', 'GAMING'], className: 'minerva' },
];

const campaignPartners = [
  { name: 'Riot Games', logo: '/logos/riot-games.png', className: 'riot' },
  { name: 'CBLOL', logo: '/logos/cblol.png', className: 'cblol' },
  { name: 'Heineken', logo: '/logos/heineken.png', className: 'heineken' },
  { name: 'Snapdragon', logo: '/logos/snapdragon.png', className: 'snapdragon' },
  { name: 'Sadia', logo: '/logos/sadia.png', className: 'sadia' },
];

const esportsThumbs = [
  { src: '/impact/baiano-heineken-djonga.webp', title: 'Baiano × Heineken — Show do Djonga' },
  { src: '/impact/baiano-worlds-capa-azul.webp', title: 'Baiano — Worlds 2024' },
  { src: '/impact/faker-bdd-lck-idl.webp', title: 'Faker vs BDD — Resumo LCK' },
  { src: '/impact/faker-lck-idl.webp', title: 'Faker — LCK' },
  { src: '/impact/final-worlds-faker-chovy.webp', title: 'Final Worlds — Faker × Chovy' },
  { src: '/impact/idl-baiano-worlds-londres.webp', title: 'Ilha das Lendas em Londres' },
  { src: '/impact/robo-cblol-idl.webp', title: 'Robo de Camille — CBLOL' },
];

const gamingThumbs = [
  { src: '/impact/minerva-ambessa-lol.webp', title: 'Minerva — Ambessa' },
  { src: '/impact/minerva-cyberpunk-2077.webp', title: 'Minerva — Cyberpunk 2077' },
  { src: '/impact/minerva-darius-lol.webp', title: 'Minerva — Darius' },
  { src: '/impact/minerva-eldenring.webp', title: 'Minerva — Elden Ring' },
  { src: '/impact/minerva-expedition-33.webp', title: 'Minerva — Expedition 33' },
  { src: '/impact/minerva-graves-lol.webp', title: 'Minerva — Graves' },
  { src: '/impact/minerva-kratos-gow.webp', title: 'Minerva — God of War' },
  { src: '/impact/minerva-live-thumb.webp', title: 'Minerva — Live' },
  { src: '/impact/minerva-minecraft-1.webp', title: 'Minerva — Minecraft' },
  { src: '/impact/minerva-red-dead-redemption2.webp', title: 'Minerva — Red Dead Redemption 2' },
  { src: '/impact/minerva-valorant-duo-grevthar.webp', title: 'Minerva — Valorant Duo' },
  { src: '/impact/minerva-valorant.webp', title: 'Minerva — Valorant' },
];

const impactThumbs = [...esportsThumbs, ...gamingThumbs];

export default function Home() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [impactImage, setImpactImage] = useState<number | null>(null);
  const [impactTouchStart, setImpactTouchStart] = useState<number | null>(null);
  const visible = projects;
  const openProject = (project: Project) => { setSelected(project); setActiveImage(0); setExpanded(project.id === 'drew'); };
  const step = (direction: number) => {
    if (selected) { setActiveImage(i => (i + direction + selected.images.length) % selected.images.length); setExpanded(false); }
  };
  const stepImpact = (direction: number) => setImpactImage(index => index === null ? null : (index + direction + impactThumbs.length) % impactThumbs.length);
  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { setActiveImage(i => (i + 1) % selected.images.length); setExpanded(false); }
      if (event.key === 'ArrowLeft') { setActiveImage(i => (i - 1 + selected.images.length) % selected.images.length); setExpanded(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);
  useEffect(() => {
    if (impactImage === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') stepImpact(1);
      if (event.key === 'ArrowLeft') stepImpact(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [impactImage]);

  return (
    <>
      <a className="skip-link" href="#projetos">Ir para os projetos</a>
      <main>
        <PortfolioHero onOpen={id => { const project = projects.find(p => p.id === id); if (project) openProject(project); }} />
        <section className="brand-section" id="marcas" aria-labelledby="brand-heading">
          <div className="brand-wrap">
            <div className="brand-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>MARCAS E PARCEIROS — 02</span></div>
            <h2 className="brand-pill" id="brand-heading">MARCAS E CRIADORES COM QUEM COLABOREI</h2>
            <div className="featured-brands">
              {featuredBrands.map(brand => <article className={`featured-brand ${brand.className}`} key={brand.name}>
                <div className="featured-logo"><img src={brand.logo} alt={brand.name} loading="lazy" /></div>
                <p>{brand.lines.map(line => <span key={line}>{line}</span>)}</p>
              </article>)}
            </div>
            <div className="partner-block">
              <p className="partner-intro">*PEÇAS PARA CAMPANHAS DE PARCEIROS NACIONAIS E GLOBAIS:</p>
              <div className="partner-logos">
                {campaignPartners.map(partner => <div className={`partner-logo ${partner.className}`} key={partner.name}><img src={partner.logo} alt={partner.name} loading="lazy" /></div>)}
              </div>
            </div>
          </div>
        </section>
        <section className="impact-section" id="impacto" aria-labelledby="impact-heading">
          <div className="impact-wrap">
            <div className="impact-top"><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>IMPACTO &amp; ESCALA — 03</span></div>
            <h2 className="impact-pill" id="impact-heading">Visualizações e impressões acumuladas</h2>
            <div className="impact-metrics">
              <div className="impact-metric"><strong>400M+</strong><p>Visualizações em vídeos<br />com minhas thumbnails</p></div>
              <div className="impact-metric"><strong>2B+</strong><p>Impressões nas redes somando<br />capas, imagens e pôsteres</p></div>
              <div className="impact-metric"><strong>5K+</strong><p>Peças diferentes<br />produzidas</p></div>
            </div>
          </div>
          <div className="impact-gallery" aria-label="Galeria de thumbnails">
            <div className="impact-row impact-row-esports" aria-label="Thumbnails de esports">
              <div className="impact-track impact-track-left">
                {[0, 1].map(copy => <div className="impact-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
                  {esportsThumbs.map((thumb, index) => <button className="impact-thumb" key={`${copy}-${thumb.src}`} tabIndex={copy === 1 ? -1 : 0} onClick={() => setImpactImage(index)} aria-label={`Ampliar ${thumb.title}`}>
                    <img src={thumb.src} alt={copy === 0 ? thumb.title : ''} loading="lazy" /><span className="impact-zoom"><ZoomIn size={19} /></span>
                  </button>)}
                </div>)}
              </div>
            </div>
            <div className="impact-row impact-row-gaming" aria-label="Thumbnails de gaming">
              <div className="impact-track impact-track-right">
                {[0, 1].map(copy => <div className="impact-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
                  {gamingThumbs.map((thumb, index) => <button className="impact-thumb" key={`${copy}-${thumb.src}`} tabIndex={copy === 1 ? -1 : 0} onClick={() => setImpactImage(esportsThumbs.length + index)} aria-label={`Ampliar ${thumb.title}`}>
                    <img src={thumb.src} alt={copy === 0 ? thumb.title : ''} loading="lazy" /><span className="impact-zoom"><ZoomIn size={18} /></span>
                  </button>)}
                </div>)}
              </div>
            </div>
          </div>
        </section>
        <PosterStage />
        <EsportsBroadcast />
        <GamesThumbnails />
        <LivePosters />
        <section className="work-section wrap" id="projetos" aria-labelledby="work-heading">
          <div className="section-top"><span className="eyebrow">PORTFÓLIO / JONATHAN BOLANLE</span><span className="section-note">DESIGN · MÚSICA · GAMES</span></div>
          <div className="work-title"><h2 id="work-heading">Outros trabalhos<br /><span>e contribuições.</span></h2><p>Uma seleção de projetos em música, identidade visual e game design.</p></div>
          <p className="sr-only" role="status">{visible.length} outros trabalhos e contribuições</p>
          <div className="project-grid curated-grid">
            {visible.map((project,index) => <button className={`project-card ${project.coverLayout}-card`} key={project.id} onClick={() => openProject(project)} aria-label={`Ver projeto ${project.title}`}>
              <div className="project-cover">{project.coverImages.length > 1 ? <div className={`cover-composition ${project.coverLayout}-composition`}>{project.coverImages.map((image,i) => <img key={image.src} src={image.src} alt={`${project.title}, peça ${i+1}`} width={image.width} height={image.height} loading="lazy" />)}</div> : <img src={project.coverImages[0].src} alt={project.title} width={project.coverImages[0].width} height={project.coverImages[0].height} loading="lazy" />}<span className="card-number">{String(index+1).padStart(2,'0')}</span><span className="card-open"><Plus size={25} /></span>{project.images.length > 1 && <span className="image-count">{project.images.length} IMAGENS</span>}</div>
              <div className="project-info"><div><span className="project-kind">{project.kind}</span><h3>{project.title}</h3></div><ArrowUpRight size={23} /></div>
            </button>)}
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-heading">
          <div className="wrap about-grid"><div><span className="eyebrow">02 / POR TRÁS DAS PEÇAS</span><h2 id="about-heading">Design com<br /><span>repertório.</span></h2><span className="about-sign">DESIGN, CULTURA &amp; RESULTADO.</span></div>
            <div className="about-copy"><p className="about-lead">Há 5 anos, transformo ideias em imagens para criadores de conteúdo, games e esports.</p><p>Minha trajetória inclui a liderança de design para Ilha das Lendas e Baiano, além de trabalhos com a Omelete Company em campanhas e eventos como a CCXP Brasil.</p><p>Como designer e profissional audiovisual, conduzo projetos variados, pôsteres para campanhas, identidade visual, thumbnails e outros. Também trabalho com edição de vídeo, somando movimento ao meu repertório de criação.</p><div className="skill-list"><span>THUMBNAILS & CONTEÚDO</span><span>CAMPANHAS & KEY ART</span><span>IDENTIDADE VISUAL</span><span>EDIÇÃO DE VÍDEO</span></div></div></div>
        </section>

        <section className="contact-section wrap" id="contato" aria-labelledby="contact-heading">
          <div className="section-top"><span className="eyebrow"><i /> ABERTO A NOVOS PROJETOS</span><span className="section-note">03 / CONTATO</span></div>
          <a className="contact-big" href="mailto:jotabolanle@gmail.com"><h2 id="contact-heading">Vamos criar<br /><span>algo juntos?</span></h2><ArrowUpRight aria-hidden="true" /></a>
          <div className="contact-bottom"><p>Projetos pontuais, parcerias recorrentes<br />e oportunidades em equipes de criação.</p><a href="mailto:jotabolanle@gmail.com"><Mail size={19}/> jotabolanle@gmail.com</a><a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={18}/></a></div>
        </section>
      </main>
      <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><span>RIO DE JANEIRO, BRASIL</span><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>

      <Dialog open={impactImage !== null} onOpenChange={open => { if (!open) setImpactImage(null); }}>
        <DialogContent className="impact-dialog" showCloseButton={false}>
          {impactImage !== null && <div className="impact-lightbox" onTouchStart={event => setImpactTouchStart(event.changedTouches[0].clientX)} onTouchEnd={event => { if (impactTouchStart !== null) { const distance = event.changedTouches[0].clientX - impactTouchStart; if (Math.abs(distance) > 55) stepImpact(distance < 0 ? 1 : -1); } setImpactTouchStart(null); }}>
            <DialogTitle className="sr-only">{impactThumbs[impactImage].title}</DialogTitle>
            <DialogDescription className="sr-only">Thumbnail ampliada. Use as setas para navegar entre as peças.</DialogDescription>
            <img src={impactThumbs[impactImage].src} alt={impactThumbs[impactImage].title} />
            <div className="impact-lightbox-bar">
              <button className="impact-lightbox-button" onClick={() => stepImpact(-1)} aria-label="Thumbnail anterior"><ArrowLeft size={21} /></button>
              <div><span>{String(impactImage + 1).padStart(2, '0')} / {String(impactThumbs.length).padStart(2, '0')}</span><p>{impactThumbs[impactImage].title}</p></div>
              <button className="impact-lightbox-button" onClick={() => stepImpact(1)} aria-label="Próxima thumbnail"><ArrowRight size={21} /></button>
            </div>
            <DialogClose className="impact-lightbox-close" aria-label="Fechar imagem"><X size={23} /></DialogClose>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selected)} onOpenChange={open => { if(!open) setSelected(null); }}>
        <DialogContent className="project-dialog" showCloseButton={false}>
          {selected && <>
            <div className="dialog-heading"><div><span className="project-kind">{selected.kind}</span><DialogTitle className="dialog-title">{selected.title}</DialogTitle></div><DialogClose className="icon-button" aria-label="Fechar projeto"><X size={25}/></DialogClose></div>
            <div className="dialog-body">
              <div className="gallery-stage"><div className={`gallery-image ${expanded ? 'expanded' : ''}`} key={`${selected.id}-${activeImage}`}><img src={selected.images[activeImage].src} width={selected.images[activeImage].width} height={selected.images[activeImage].height} alt={`${selected.title}, imagem ${activeImage+1} de ${selected.images.length}`} /></div><div className="gallery-controls"><button className="icon-button" aria-label="Imagem anterior" disabled={selected.images.length < 2} onClick={() => step(-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{String(activeImage+1).padStart(2,'0')} / {String(selected.images.length).padStart(2,'0')}</span><button className="icon-button" aria-label={expanded ? 'Ajustar imagem à tela' : 'Ampliar imagem'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}</button><button className="icon-button" aria-label="Próxima imagem" disabled={selected.images.length < 2} onClick={() => step(1)}><ArrowRight size={20}/></button></div></div>
              <div className="project-context"><DialogDescription className="dialog-description">{selected.description}</DialogDescription><dl><div><dt>CRIAÇÃO</dt><dd>{selected.creator ?? 'Jonathan Bolanle'}</dd></div>{selected.contributor && <div><dt>COLABORAÇÃO</dt><dd>{selected.contributor}</dd></div>}<div><dt>ESPECIALIDADE</dt><dd>{selected.kind}</dd></div></dl><div className="gallery-thumbs" aria-label="Escolher imagem">{selected.images.map((image,i) => <button key={image.src} className={i === activeImage ? 'thumb selected' : 'thumb'} aria-label={`Ver imagem ${i+1}`} aria-pressed={i === activeImage} onClick={() => {setActiveImage(i);setExpanded(false);}}><img src={image.src} alt="" loading="lazy" /></button>)}</div><a className="project-enquiry" href={`mailto:jotabolanle@gmail.com?subject=${encodeURIComponent('Projeto de design - ' + selected.kind)}`}>Tem um projeto em mente? <ArrowUpRight size={18}/></a></div>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
