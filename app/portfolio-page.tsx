'use client';

import { useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowLeft, ArrowRight, Plus, X, Mail, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { getProjects, type Project } from './selected-projects';
import { tr, type Locale } from './i18n';
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

const englishImpactTitles: Record<string, string> = {
  'Baiano × Heineken — Show do Djonga': 'Baiano × Heineken — Djonga’s performance',
  'Faker vs BDD — Resumo LCK': 'Faker vs BDD — LCK highlights',
  'Final Worlds — Faker × Chovy': 'Worlds Final — Faker × Chovy',
  'Ilha das Lendas em Londres': 'Ilha das Lendas in London',
  'Robo de Camille — CBLOL': 'Robo on Camille — CBLOL',
};

export default function Home({ locale }: { locale: Locale }) {
  const impactTitle = (title: string) => locale === 'en' ? englishImpactTitles[title] ?? title : title;
  const motionScopeRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [impactImage, setImpactImage] = useState<number | null>(null);
  const [impactTouchStart, setImpactTouchStart] = useState<number | null>(null);
  const galleryTouchStart = useRef<{ x: number; y: number } | null>(null);
  const visible = getProjects(locale);
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
      <a className="skip-link" href="#projetos">{tr(locale, 'Ir para os projetos', 'Skip to projects')}</a>
      <main ref={motionScopeRef}>
        <PortfolioHero locale={locale} />
        <PosterStage layout="spread" locale={locale} />
        <section className="impact-section" id="impacto" aria-labelledby="impact-heading">
          <div className="impact-wrap">
            <div className="impact-top" data-motion-reveal><span>{tr(locale, 'PORTFÓLIO', 'PORTFOLIO')} / JONATHAN BOLANLE</span><span>{tr(locale, 'IMPACTO & ESCALA', 'IMPACT & REACH')} — 03</span></div>
            <h2 className="impact-pill" id="impact-heading" data-motion-reveal>{tr(locale, 'Visualizações e impressões acumuladas', 'Combined views and impressions')}</h2>
            <div className="impact-metrics" data-motion-stagger>
              <div className="impact-metric"><strong data-impact-count="300" data-impact-suffix="M+" aria-label={tr(locale, 'Mais de 300 milhões', 'More than 300 million')}>300M+</strong><p>{tr(locale, 'Visualizações em vídeos', 'Video views')}<br />{tr(locale, 'com minhas thumbnails', 'featuring my thumbnails')}</p></div>
              <div className="impact-metric"><strong data-impact-count="2" data-impact-suffix="B+" aria-label={tr(locale, 'Mais de 2 bilhões', 'More than 2 billion')}>2B+</strong><p>{tr(locale, 'Impressões nas redes somando', 'Social media impressions across')}<br />{tr(locale, 'capas, imagens e pôsteres', 'covers, images and posters')}</p></div>
              <div className="impact-metric"><strong data-impact-count="5" data-impact-suffix="K+" aria-label={tr(locale, 'Mais de 5 mil', 'More than 5 thousand')}>5K+</strong><p>{tr(locale, 'Peças diferentes', 'Individual pieces')}<br />{tr(locale, 'produzidas', 'produced')}</p></div>
            </div>
          </div>
          <div className="impact-gallery" data-motion-stage="24" aria-label={tr(locale, 'Galeria de thumbnails', 'Thumbnail gallery')}>
            <div className="impact-row impact-row-esports" aria-label={tr(locale, 'Thumbnails de esports', 'Esports thumbnails')}>
              <div className="impact-track impact-track-left">
                {[0, 1].map(copy => <div className="impact-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
                  {esportsThumbs.map((thumb, index) => <button className="impact-thumb" key={`${copy}-${thumb.src}`} tabIndex={copy === 1 ? -1 : 0} onClick={() => setImpactImage(index)} aria-label={`${tr(locale, 'Ampliar', 'Enlarge')} ${impactTitle(thumb.title)}`}>
                    <img src={thumb.src} alt={copy === 0 ? impactTitle(thumb.title) : ''} loading="lazy" /><span className="impact-zoom"><ZoomIn size={19} /></span>
                  </button>)}
                </div>)}
              </div>
            </div>
            <div className="impact-row impact-row-gaming" aria-label={tr(locale, 'Thumbnails de gaming', 'Gaming thumbnails')}>
              <div className="impact-track impact-track-right">
                {[0, 1].map(copy => <div className="impact-group" aria-hidden={copy === 1 ? true : undefined} key={copy}>
                  {gamingThumbs.map((thumb, index) => <button className="impact-thumb" key={`${copy}-${thumb.src}`} tabIndex={copy === 1 ? -1 : 0} onClick={() => setImpactImage(esportsThumbs.length + index)} aria-label={`${tr(locale, 'Ampliar', 'Enlarge')} ${impactTitle(thumb.title)}`}>
                    <img src={thumb.src} alt={copy === 0 ? impactTitle(thumb.title) : ''} loading="lazy" /><span className="impact-zoom"><ZoomIn size={18} /></span>
                  </button>)}
                </div>)}
              </div>
            </div>
          </div>
        </section>
        <EsportsBroadcast locale={locale} />
        <GamesThumbnails locale={locale} />
        <section className="work-section wrap" id="projetos" aria-labelledby="work-heading">
          <div className="section-top" data-motion-reveal><span className="eyebrow">{tr(locale, 'PORTFÓLIO', 'PORTFOLIO')} / JONATHAN BOLANLE</span><span className="section-note">{tr(locale, 'OUTROS TRABALHOS', 'OTHER WORK')} — 06</span></div>
          <div className="work-title" data-motion-reveal><h2 id="work-heading">{tr(locale, 'Outros trabalhos', 'Other work')}</h2><p>{tr(locale, 'Uma seleção de projetos em música, identidade visual e game design.', 'A selection of projects in music, visual identity and game design.')}</p></div>
          <output className="sr-only">{visible.length} {tr(locale, 'outros trabalhos e contribuições', 'other projects and contributions')}</output>
          <div className="project-grid curated-grid" data-motion-stagger>
            {visible.map((project,index) => <button className={`project-card ${project.coverLayout}-card`} key={project.id} onClick={() => openProject(project)} aria-label={`${tr(locale, 'Ver projeto', 'View project')} ${project.title}`}>
              <div className="project-cover"><div className="project-parallax-media" data-project-parallax>{project.coverImages.length > 1 ? <div className={`cover-composition ${project.coverLayout}-composition`}>{project.coverImages.map((image,i) => <img key={image.src} src={image.src} alt={`${project.title}, ${tr(locale, 'peça', 'piece')} ${i+1}`} width={image.width} height={image.height} loading="lazy" />)}</div> : <img src={project.coverImages[0].src} alt={project.title} width={project.coverImages[0].width} height={project.coverImages[0].height} loading="lazy" />}</div><span className="card-number">{String(index+1).padStart(2,'0')}</span><span className="card-open"><Plus size={25} /></span>{project.images.length > 1 && <span className="image-count">{project.images.length} {tr(locale, 'IMAGENS', 'IMAGES')}</span>}</div>
              <div className="project-info"><div><span className="project-kind">{project.kind}</span><h3>{project.title}</h3></div><ArrowUpRight size={23} /></div>
            </button>)}
          </div>
        </section>
        <section className="brand-section" id="marcas" aria-labelledby="brand-heading">
          <div className="brand-wrap">
            <div className="brand-top" data-motion-reveal><span>{tr(locale, 'PORTFÓLIO', 'PORTFOLIO')} / JONATHAN BOLANLE</span><span>{tr(locale, 'MARCAS E PARCEIROS', 'BRANDS & PARTNERS')} — 07</span></div>
            <h2 className="brand-pill" id="brand-heading" data-motion-reveal>{tr(locale, 'MARCAS E CRIADORES COM QUEM COLABOREI', 'BRANDS AND CREATORS I HAVE WORKED WITH')}</h2>
            <div className="featured-brands" data-motion-stagger>
              {featuredBrands.map(brand => <article className={`featured-brand ${brand.className}`} key={brand.name}>
                <a className="featured-logo" href={brand.href} target="_blank" rel="noopener noreferrer" aria-label={`${tr(locale, 'Abrir', 'Open')} ${brand.name} ${tr(locale, 'no', 'on')} ${tr(locale, brand.destination, brand.destination === 'site oficial' ? 'official website' : brand.destination)} ${tr(locale, '(nova aba)', '(new tab)')}`}><img src={brand.logo} alt="" loading="lazy" /></a>
                <p>{brand.lines.map(line => <span key={line}>{tr(locale, line, line === 'ENTRETENIMENTO' ? 'ENTERTAINMENT' : line === 'E-SPORTS' ? 'ESPORTS' : line === 'CREATORS' ? 'CREATORS' : line)}</span>)}</p>
              </article>)}
            </div>
            <div className="partner-block" data-motion-reveal>
              <p className="partner-intro">{tr(locale, '*PEÇAS PARA CAMPANHAS DE PARCEIROS NACIONAIS E GLOBAIS:', '*DESIGNS FOR CAMPAIGNS BY NATIONAL AND GLOBAL PARTNERS:')}</p>
              <div className="partner-logos">
                {campaignPartners.map(partner => <a className={`partner-logo ${partner.className}`} key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={`${tr(locale, 'Abrir site oficial da', 'Open the official website of')} ${partner.name} ${tr(locale, '(nova aba)', '(new tab)')}`}><img src={partner.logo} alt="" loading="lazy" /></a>)}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-heading">
          <div className="wrap about-grid"><div data-motion-reveal><span className="eyebrow">08 / {tr(locale, 'POR TRÁS DAS PEÇAS', 'BEHIND THE WORK')}</span><h2 id="about-heading">{tr(locale, 'Design com', 'Design with')}<br /><span>{tr(locale, 'repertório.', 'perspective.')}</span></h2><span className="about-sign">{tr(locale, 'DESIGN, CULTURA & RESULTADO.', 'DESIGN, CULTURE & IMPACT.')}</span></div>
            <div className="about-copy" data-motion-reveal><p className="about-lead">{tr(locale, 'Há 5 anos, transformo ideias em imagens para criadores de conteúdo, games e esports.', 'For five years, I have turned ideas into visuals for content creators, gaming and esports.')}</p><p>{tr(locale, 'Minha trajetória inclui a liderança de design para Ilha das Lendas e Baiano, além de colaborações em eventos e campanhas junto à Omelete Company, como o CBOLÃO na CCXP Brasil, em 2023 e 2024.', 'My experience includes leading design for Ilha das Lendas and Baiano, as well as collaborating on events and campaigns with Omelete Company, including CBOLÃO at CCXP Brasil in 2023 and 2024.')}</p><p>{tr(locale, 'Como designer e profissional audiovisual, conduzo projetos variados, pôsteres para campanhas, identidade visual, thumbnails e outros. Também trabalho com edição de vídeo, somando movimento ao meu repertório de criação.', 'As a designer and audiovisual professional, I work across campaign posters, visual identity, thumbnails and other projects. I also edit video, bringing motion into my creative practice.')}</p><div className="skill-list"><span>{tr(locale, 'THUMBNAILS & CONTEÚDO', 'THUMBNAILS & CONTENT')}</span><span>{tr(locale, 'CAMPANHAS & KEY ART', 'CAMPAIGNS & KEY ART')}</span><span>{tr(locale, 'IDENTIDADE VISUAL', 'VISUAL IDENTITY')}</span><span>{tr(locale, 'EDIÇÃO DE VÍDEO', 'VIDEO EDITING')}</span></div></div></div>
        </section>

        <section className="contact-section wrap" id="contato" aria-labelledby="contact-heading">
          <div className="section-top" data-motion-reveal><span className="eyebrow"><i /> {tr(locale, 'ABERTO A NOVOS PROJETOS', 'OPEN TO NEW PROJECTS')}</span><span className="section-note">09 / {tr(locale, 'CONTATO', 'CONTACT')}</span></div>
          <a className="contact-big" href="mailto:jotabolanle@gmail.com" data-motion-reveal><h2 id="contact-heading">{tr(locale, 'Vamos criar', 'Let’s create')}<br /><span>{tr(locale, 'algo juntos?', 'something together?')}</span></h2><ArrowUpRight aria-hidden="true" /></a>
          <div className="contact-bottom">
            <p>{tr(locale, 'Projetos pontuais, parcerias recorrentes', 'One-off projects, ongoing partnerships')}<br />{tr(locale, 'e oportunidades em equipes de criação.', 'and opportunities with creative teams.')}</p>
            <a href="mailto:jotabolanle@gmail.com"><Mail size={19}/> jotabolanle@gmail.com</a>
            <div className="contact-socials">
              <a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={18}/></a>
              <a href="https://www.instagram.com/osuperjohn/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={18}/></a>
              <a href="https://x.com/osuperjohn" target="_blank" rel="noopener noreferrer">X / Twitter <ArrowUpRight size={18}/></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><span>RIO DE JANEIRO, {tr(locale, 'BRASIL', 'BRAZIL')}</span><a href="#inicio">{tr(locale, 'VOLTAR AO TOPO', 'BACK TO TOP')} ↑</a></footer>

      <Dialog open={impactImage !== null} onOpenChange={open => { if (!open) setImpactImage(null); }}>
        <DialogContent className="impact-dialog" showCloseButton={false}>
          {impactImage !== null && <div className="impact-lightbox" onTouchStart={event => setImpactTouchStart(event.changedTouches[0].clientX)} onTouchEnd={event => { if (impactTouchStart !== null) { const distance = event.changedTouches[0].clientX - impactTouchStart; if (Math.abs(distance) > 55) stepImpact(distance < 0 ? 1 : -1); } setImpactTouchStart(null); }}>
            <DialogTitle className="sr-only">{impactTitle(impactThumbs[impactImage].title)}</DialogTitle>
            <DialogDescription className="sr-only">{tr(locale, 'Thumbnail ampliada. Use as setas para navegar entre as peças.', 'Enlarged thumbnail. Use the arrow buttons to browse the images.')}</DialogDescription>
            <img src={impactThumbs[impactImage].src} alt={impactTitle(impactThumbs[impactImage].title)} />
            <div className="impact-lightbox-bar">
              <button className="impact-lightbox-button" onClick={() => stepImpact(-1)} aria-label={tr(locale, 'Thumbnail anterior', 'Previous thumbnail')}><ArrowLeft size={21} /></button>
              <div><span>{String(impactImage + 1).padStart(2, '0')} / {String(impactThumbs.length).padStart(2, '0')}</span><p>{impactTitle(impactThumbs[impactImage].title)}</p></div>
              <button className="impact-lightbox-button" onClick={() => stepImpact(1)} aria-label={tr(locale, 'Próxima thumbnail', 'Next thumbnail')}><ArrowRight size={21} /></button>
            </div>
            <DialogClose className="impact-lightbox-close" aria-label={tr(locale, 'Fechar imagem', 'Close image')}><X size={23} /></DialogClose>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selected)} onOpenChange={open => { if(!open) setSelected(null); }}>
        <DialogContent className="project-dialog" showCloseButton={false}>
          {selected && <>
            <div className="dialog-heading"><div><span className="project-kind">{selected.kind}</span><DialogTitle className="dialog-title">{selected.title}</DialogTitle></div><DialogClose className="icon-button" aria-label={tr(locale, 'Fechar projeto', 'Close project')}><X size={25}/></DialogClose></div>
            <div className="dialog-body">
              <div className="gallery-stage"><div className={`gallery-image ${expanded ? 'expanded' : ''}`} key={`${selected.id}-${activeImage}`} onTouchStart={startGallerySwipe} onTouchEnd={endGallerySwipe} onTouchCancel={() => { galleryTouchStart.current = null; }}><img src={selected.images[activeImage].src} width={selected.images[activeImage].width} height={selected.images[activeImage].height} alt={`${selected.title}, ${tr(locale, 'imagem', 'image')} ${activeImage+1} ${tr(locale, 'de', 'of')} ${selected.images.length}`} /></div><div className="gallery-controls"><button className="icon-button" aria-label={tr(locale, 'Imagem anterior', 'Previous image')} disabled={selected.images.length < 2} onClick={() => step(-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{String(activeImage+1).padStart(2,'0')} / {String(selected.images.length).padStart(2,'0')}</span><button className="icon-button" aria-label={expanded ? tr(locale, 'Ajustar imagem à tela', 'Fit image to screen') : tr(locale, 'Ampliar imagem', 'Enlarge image')} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}</button><button className="icon-button" aria-label={tr(locale, 'Próxima imagem', 'Next image')} disabled={selected.images.length < 2} onClick={() => step(1)}><ArrowRight size={20}/></button></div></div>
              <div className="project-context"><DialogDescription className="dialog-description">{selected.description}</DialogDescription><dl><div><dt>{tr(locale, 'CRIAÇÃO', 'CREATED BY')}</dt><dd>{selected.creator ?? 'Jonathan Bolanle'}</dd></div>{selected.contributor && <div><dt>{tr(locale, 'COLABORAÇÃO', 'CONTRIBUTION')}</dt><dd>{selected.contributor}</dd></div>}<div><dt>{tr(locale, 'ESPECIALIDADE', 'SPECIALTY')}</dt><dd>{selected.kind}</dd></div></dl><div className="gallery-thumbs" aria-label={tr(locale, 'Escolher imagem', 'Choose image')}>{selected.images.map((image,i) => <button key={image.src} className={i === activeImage ? 'thumb selected' : 'thumb'} aria-label={`${tr(locale, 'Ver imagem', 'View image')} ${i+1}`} aria-pressed={i === activeImage} onClick={() => {setActiveImage(i);setExpanded(false);}}><img src={image.src} alt="" loading="lazy" /></button>)}</div><a className="project-enquiry" href={`mailto:jotabolanle@gmail.com?subject=${encodeURIComponent(tr(locale, 'Projeto de design - ', 'Design project - ') + selected.kind)}`}>{tr(locale, 'Tem um projeto em mente?', 'Have a project in mind?')} <ArrowUpRight size={18}/></a></div>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
