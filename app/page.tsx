'use client';

import { useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, X, Mail, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { projects, type Project } from './selected-projects';
import PortfolioHero from './portfolio-hero';
import PosterStage from './poster-stage';
import EsportsBroadcast from './esports-broadcast';
import GamesThumbnails from './games-thumbnails';

const featuredBrands = [
  { name: 'Baiano', logo: '/logos/baiano.png', lines: ['STREAMER', 'E-SPORTS'], className: 'baiano', href: 'https://www.instagram.com/baianolol/', destination: 'Instagram' },
  { name: 'Ilha das Lendas', logo: '/logos/ilha-das-lendas.svg', lines: ['CREATORS', 'E-SPORTS'], className: 'idl', href: 'https://www.instagram.com/ilhadaslendas/', destination: 'Instagram' },
  { name: 'Omelete & Co', logo: '/logos/omelete-co.png', lines: ['ENTRETENIMENTO', 'E-SPORTS'], className: 'omelete', href: 'https://omeletecompany.com/home/', destination: 'site oficial' },
  { name: 'Minerva', logo: '/logos/minerva-logo-new.png', lines: ['ENTRETENIMENTO', 'GAMING'], className: 'minerva', href: 'https://www.instagram.com/gustavominerva/', destination: 'Instagram' },
];

const campaignPartners = [
  { name: 'Riot Games', logo: '/logos/riot-games.png', className: 'riot', href: 'https://www.riotgames.com/' },
  { name: 'Heineken', logo: '/logos/heineken.png', className: 'heineken', href: 'https://www.heineken.com/br/pt/pagina-inicial' },
  { name: 'Snapdragon', logo: '/logos/snapdragon.png', className: 'snapdragon', href: 'https://www.qualcomm.com/snapdragon/overview' },
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
  const motionScopeRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [impactImage, setImpactImage] = useState<number | null>(null);
  const [impactTouchStart, setImpactTouchStart] = useState<number | null>(null);
  const galleryTouchStart = useRef<{ x: number; y: number } | null>(null);
  const visible = projects;
  const openProject = (project: Project) => { setSelected(project); setActiveImage(0); setExpanded(project.id === 'drew'); };
  const step = (direction: number) => {
    if (selected) { setActiveImage(i => (i + direction + selected.images.length) % selected.images.length); setExpanded(false); }
  };
  const stepImpact = (direction: number) => setImpactImage(index => index === null ? null : (index + direction + impactThumbs.length) % impactThumbs.length);
  const startGallerySwipe = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) return;
    galleryTouchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };
  const endGallerySwipe = (event: TouchEvent<HTMLDivElement>) => {
    if (!galleryTouchStart.current) return;
    const distanceX = event.changedTouches[0].clientX - galleryTouchStart.current.x;
    const distanceY = event.changedTouches[0].clientY - galleryTouchStart.current.y;
    galleryTouchStart.current = null;
    if (!selected || selected.images.length < 2) return;
    if (Math.abs(distanceX) >= 55 && Math.abs(distanceX) > Math.abs(distanceY) * 1.25) step(distanceX < 0 ? 1 : -1);
  };
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
  useLayoutEffect(() => {
    const scope = motionScopeRef.current;
    if (!scope) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-motion-reveal]').forEach((element, index) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: index % 3 === 0 ? 54 : 38,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-motion-stagger]').forEach(group => {
          gsap.from(Array.from(group.children), {
            autoAlpha: 0,
            y: 42,
            duration: .9,
            stagger: .1,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-impact-count]').forEach(element => {
          const target = Number(element.dataset.impactCount);
          const suffix = element.dataset.impactSuffix ?? '';
          if (!Number.isFinite(target)) return;

          const counter = { value: 0 };
          const format = (value: number) => target < 10
            ? value.toFixed(1).replace(/\.0$/, '')
            : String(Math.round(value));
          element.textContent = `0${suffix}`;
          gsap.to(counter, {
            value: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => { element.textContent = `${format(counter.value)}${suffix}`; },
            onComplete: () => { element.textContent = `${target}${suffix}`; },
            scrollTrigger: { trigger: element.parentElement, start: 'top 86%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-project-parallax]').forEach((mediaElement, index) => {
          gsap.fromTo(mediaElement,
            { yPercent: index % 2 === 0 ? -10 : -12 },
            {
              yPercent: index % 2 === 0 ? 10 : 12,
              ease: 'none',
              scrollTrigger: {
                trigger: mediaElement.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: .65,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-motion-drift]').forEach((element, index) => {
          const distance = Number(element.dataset.motionDrift ?? 45);
          gsap.fromTo(element,
            { y: index % 2 === 0 ? distance : distance * .55 },
            {
              y: index % 2 === 0 ? -distance : -distance * .55,
              ease: 'none',
              scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-motion-watermark]').forEach(element => {
          gsap.fromTo(element, { yPercent: -8 }, {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-motion-stage]').forEach((stage, index) => {
          const distance = Number(stage.dataset.motionStage ?? 28);
          gsap.fromTo(stage,
            { y: index % 2 === 0 ? distance : distance * .7 },
            {
              y: index % 2 === 0 ? -distance : -distance * .7,
              ease: 'none',
              scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: .9 },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-motion-image-group]').forEach(group => {
          const images = Array.from(group.querySelectorAll<HTMLElement>('[data-motion-card-image]'));
          gsap.fromTo(images,
            { yPercent: index => index % 2 === 0 ? -5 : -3.5 },
            {
              yPercent: index => index % 2 === 0 ? 5 : 3.5,
              ease: 'none',
              scrollTrigger: { trigger: group, start: 'top bottom', end: 'bottom top', scrub: .8 },
            },
          );
        });
      }, scope);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <>
      <a className="skip-link" href="#projetos">Ir para os projetos</a>
      <main ref={motionScopeRef}>
        <PortfolioHero />
        <PosterStage layout="spread" />
        <section className="impact-section" id="impacto" aria-labelledby="impact-heading">
          <div className="impact-wrap">
            <div className="impact-top" data-motion-reveal><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>IMPACTO &amp; ESCALA — 03</span></div>
            <h2 className="impact-pill" id="impact-heading" data-motion-reveal>Visualizações e impressões acumuladas</h2>
            <div className="impact-metrics" data-motion-stagger>
              <div className="impact-metric"><strong data-impact-count="300" data-impact-suffix="M+" aria-label="Mais de 300 milhões">300M+</strong><p>Visualizações em vídeos<br />com minhas thumbnails</p></div>
              <div className="impact-metric"><strong data-impact-count="2" data-impact-suffix="B+" aria-label="Mais de 2 bilhões">2B+</strong><p>Impressões nas redes somando<br />capas, imagens e pôsteres</p></div>
              <div className="impact-metric"><strong data-impact-count="5" data-impact-suffix="K+" aria-label="Mais de 5 mil">5K+</strong><p>Peças diferentes<br />produzidas</p></div>
            </div>
          </div>
          <div className="impact-gallery" data-motion-stage="24" aria-label="Galeria de thumbnails">
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
        <EsportsBroadcast />
        <GamesThumbnails />
        <section className="work-section wrap" id="projetos" aria-labelledby="work-heading">
          <div className="section-top" data-motion-reveal><span className="eyebrow">PORTFÓLIO / JONATHAN BOLANLE</span><span className="section-note">OUTROS TRABALHOS — 06</span></div>
          <div className="work-title" data-motion-reveal><h2 id="work-heading">Outros trabalhos</h2><p>Uma seleção de projetos em música, identidade visual e game design.</p></div>
          <output className="sr-only">{visible.length} outros trabalhos e contribuições</output>
          <div className="project-grid curated-grid" data-motion-stagger>
            {visible.map((project,index) => <button className={`project-card ${project.coverLayout}-card`} key={project.id} onClick={() => openProject(project)} aria-label={`Ver projeto ${project.title}`}>
              <div className="project-cover"><div className="project-parallax-media" data-project-parallax>{project.coverImages.length > 1 ? <div className={`cover-composition ${project.coverLayout}-composition`}>{project.coverImages.map((image,i) => <img key={image.src} src={image.src} alt={`${project.title}, peça ${i+1}`} width={image.width} height={image.height} loading="lazy" />)}</div> : <img src={project.coverImages[0].src} alt={project.title} width={project.coverImages[0].width} height={project.coverImages[0].height} loading="lazy" />}</div><span className="card-number">{String(index+1).padStart(2,'0')}</span><span className="card-open"><Plus size={25} /></span>{project.images.length > 1 && <span className="image-count">{project.images.length} IMAGENS</span>}</div>
              <div className="project-info"><div><span className="project-kind">{project.kind}</span><h3>{project.title}</h3></div><ArrowUpRight size={23} /></div>
            </button>)}
          </div>
        </section>
        <section className="brand-section" id="marcas" aria-labelledby="brand-heading">
          <div className="brand-wrap">
            <div className="brand-top" data-motion-reveal><span>PORTFÓLIO / JONATHAN BOLANLE</span><span>MARCAS E PARCEIROS — 07</span></div>
            <h2 className="brand-pill" id="brand-heading" data-motion-reveal>MARCAS E CRIADORES COM QUEM COLABOREI</h2>
            <div className="featured-brands" data-motion-stagger>
              {featuredBrands.map(brand => <article className={`featured-brand ${brand.className}`} key={brand.name}>
                <a className="featured-logo" href={brand.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${brand.name} no ${brand.destination} (nova aba)`}><img src={brand.logo} alt="" loading="lazy" /></a>
                <p>{brand.lines.map(line => <span key={line}>{line}</span>)}</p>
              </article>)}
            </div>
            <div className="partner-block" data-motion-reveal>
              <p className="partner-intro">*PEÇAS PARA CAMPANHAS DE PARCEIROS NACIONAIS E GLOBAIS:</p>
              <div className="partner-logos">
                {campaignPartners.map(partner => <a className={`partner-logo ${partner.className}`} key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir site oficial da ${partner.name} (nova aba)`}><img src={partner.logo} alt="" loading="lazy" /></a>)}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-heading">
          <div className="wrap about-grid"><div data-motion-reveal><span className="eyebrow">08 / POR TRÁS DAS PEÇAS</span><h2 id="about-heading">Design com<br /><span>repertório.</span></h2><span className="about-sign">DESIGN, CULTURA &amp; RESULTADO.</span></div>
            <div className="about-copy" data-motion-reveal><p className="about-lead">Há 5 anos, transformo ideias em imagens para criadores de conteúdo, games e esports.</p><p>Minha trajetória inclui a liderança de design para Ilha das Lendas e Baiano, além de colaborações em eventos e campanhas junto à Omelete Company, como o CBOLÃO na CCXP Brasil, em 2023 e 2024.</p><p>Como designer e profissional audiovisual, conduzo projetos variados, pôsteres para campanhas, identidade visual, thumbnails e outros. Também trabalho com edição de vídeo, somando movimento ao meu repertório de criação.</p><div className="skill-list"><span>THUMBNAILS & CONTEÚDO</span><span>CAMPANHAS & KEY ART</span><span>IDENTIDADE VISUAL</span><span>EDIÇÃO DE VÍDEO</span></div></div></div>
        </section>

        <section className="contact-section wrap" id="contato" aria-labelledby="contact-heading">
          <div className="section-top" data-motion-reveal><span className="eyebrow"><i /> ABERTO A NOVOS PROJETOS</span><span className="section-note">09 / CONTATO</span></div>
          <a className="contact-big" href="mailto:jotabolanle@gmail.com" data-motion-reveal><h2 id="contact-heading">Vamos criar<br /><span>algo juntos?</span></h2><ArrowUpRight aria-hidden="true" /></a>
          <div className="contact-bottom">
            <p>Projetos pontuais, parcerias recorrentes<br />e oportunidades em equipes de criação.</p>
            <a href="mailto:jotabolanle@gmail.com"><Mail size={19}/> jotabolanle@gmail.com</a>
            <div className="contact-socials">
              <a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={18}/></a>
              <a href="https://www.instagram.com/osuperjohn/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={18}/></a>
              <a href="https://x.com/osuperjohn" target="_blank" rel="noopener noreferrer">X / Twitter <ArrowUpRight size={18}/></a>
            </div>
          </div>
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
              <div className="gallery-stage"><div className={`gallery-image ${expanded ? 'expanded' : ''}`} key={`${selected.id}-${activeImage}`} onTouchStart={startGallerySwipe} onTouchEnd={endGallerySwipe} onTouchCancel={() => { galleryTouchStart.current = null; }}><img src={selected.images[activeImage].src} width={selected.images[activeImage].width} height={selected.images[activeImage].height} alt={`${selected.title}, imagem ${activeImage+1} de ${selected.images.length}`} /></div><div className="gallery-controls"><button className="icon-button" aria-label="Imagem anterior" disabled={selected.images.length < 2} onClick={() => step(-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{String(activeImage+1).padStart(2,'0')} / {String(selected.images.length).padStart(2,'0')}</span><button className="icon-button" aria-label={expanded ? 'Ajustar imagem à tela' : 'Ampliar imagem'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}</button><button className="icon-button" aria-label="Próxima imagem" disabled={selected.images.length < 2} onClick={() => step(1)}><ArrowRight size={20}/></button></div></div>
              <div className="project-context"><DialogDescription className="dialog-description">{selected.description}</DialogDescription><dl><div><dt>CRIAÇÃO</dt><dd>{selected.creator ?? 'Jonathan Bolanle'}</dd></div>{selected.contributor && <div><dt>COLABORAÇÃO</dt><dd>{selected.contributor}</dd></div>}<div><dt>ESPECIALIDADE</dt><dd>{selected.kind}</dd></div></dl><div className="gallery-thumbs" aria-label="Escolher imagem">{selected.images.map((image,i) => <button key={image.src} className={i === activeImage ? 'thumb selected' : 'thumb'} aria-label={`Ver imagem ${i+1}`} aria-pressed={i === activeImage} onClick={() => {setActiveImage(i);setExpanded(false);}}><img src={image.src} alt="" loading="lazy" /></button>)}</div><a className="project-enquiry" href={`mailto:jotabolanle@gmail.com?subject=${encodeURIComponent('Projeto de design - ' + selected.kind)}`}>Tem um projeto em mente? <ArrowUpRight size={18}/></a></div>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
