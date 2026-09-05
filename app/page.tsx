'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Plus, X, Download, Mail, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import projectsData from './projects.json';

type Project = { id: string; title: string; category: string; kind: string; description: string; images: { src: string; width: number; height: number }[]; source: string };
const projects = projectsData as Project[];
const categories = ['Todos', 'Thumbnails', 'Campanhas', 'Identidade', 'Editorial & outros'];

export default function Home() {
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const visible = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);
  const worlds = projects.find(p => p.id === 'worlds-2023')!;
  const openProject = (project: Project) => { setSelected(project); setActiveImage(0); setExpanded(false); };
  const step = (direction: number) => {
    if (selected) { setActiveImage(i => (i + direction + selected.images.length) % selected.images.length); setExpanded(false); }
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

  return (
    <>
      <a className="skip-link" href="#projetos">Ir para os projetos</a>
      <header className="site-header">
        <a href="#inicio" className="wordmark" aria-label="Jonathan Bolanle, início">JB<span>✳</span></a>
        <span className="header-name">JONATHAN<br />BOLANLE</span>
        <nav aria-label="Navegação principal">
          <a href="#projetos">Trabalhos</a><a href="#sobre">Sobre</a>
          <a className="nav-contact" href="#contato" aria-label="Vamos conversar">Vamos conversar <ArrowUpRight size={17} /></a>
        </nav>
      </header>
      <main>
        <section className="hero wrap" id="inicio" aria-labelledby="hero-heading">
          <div className="hero-topline"><span className="eyebrow"><i /> DESIGNER GRÁFICO & EDITOR DE VÍDEO</span><span className="hero-location">RIO DE JANEIRO ↗ REMOTO</span></div>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 id="hero-heading">IMAGENS<br />QUE DÃO<br /><span>O TOM.</span></h1>
              <p>Thumbnails, campanhas e identidades visuais para quem cria conteúdo e constrói sua própria audiência.</p>
              <a className="primary-link" href="#projetos">Explore os trabalhos <ArrowDown size={19} /></a>
            </div>
            <button className="hero-art" onClick={() => openProject(worlds)} aria-label="Explorar o projeto Worlds 2023">
              <div className="poster-stage">
                {worlds.images.slice(0,3).map((image,i) => <img key={image.src} className={`hero-poster poster-${i}`} src={image.src} alt={`Worlds 2023: pôster ${i+1}`} width={image.width} height={image.height} fetchPriority={i === 0 ? 'high' : 'auto'} />)}
                <span className="art-open"><ArrowUpRight size={29} /></span>
              </div>
              <span className="hero-caption"><span>EM DESTAQUE / WORLDS 2023</span><span>KEY ART & PÔSTERES ↗</span></span>
            </button>
          </div>
          <div className="experience-strip"><span>EXPERIÊNCIA COM</span><strong>ILHA DAS LENDAS</strong><strong>BAIANO</strong><strong>OMELETE COMPANY</strong><span className="experience-years">5 ANOS DE DESIGN</span></div>
        </section>

        <section className="work-section wrap" id="projetos" aria-labelledby="work-heading">
          <div className="section-top"><span className="eyebrow">01 / PORTFÓLIO</span><span className="section-note">CRIAÇÃO DO CONCEITO À PEÇA FINAL.</span></div>
          <div className="work-title"><h2 id="work-heading">TRABALHOS<br /><span>SELECIONADOS.</span></h2><p>Entre o universo dos games,<br />a cultura e novas identidades.</p></div>
          <div className="filter-bar" aria-label="Filtrar projetos por categoria">
            {categories.map(category => <button key={category} className={filter === category ? 'filter active' : 'filter'} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === 'Todos' && <sup>{projects.length}</sup>}</button>)}
          </div>
          <p className="sr-only" role="status">{visible.length} projetos na categoria {filter}</p>
          <div className="project-grid">
            {visible.map((project,index) => <button className={`project-card ${project.category === 'Campanhas' ? 'campaign-card' : ''}`} key={project.id} onClick={() => openProject(project)} aria-label={`Ver projeto ${project.title}`}>
              <div className="project-cover"><img src={project.images[0].src} alt={project.title} width={project.images[0].width} height={project.images[0].height} loading="lazy" /><span className="card-number">{String(index+1).padStart(2,'0')}</span><span className="card-open"><Plus size={25} /></span>{project.images.length > 1 && <span className="image-count">{project.images.length} IMAGENS</span>}</div>
              <div className="project-info"><div><span className="project-kind">{project.kind}</span><h3>{project.title}</h3></div><ArrowUpRight size={23} /></div>
            </button>)}
          </div>
        </section>

        <section className="about-section" id="sobre" aria-labelledby="about-heading">
          <div className="wrap about-grid"><div><span className="eyebrow">02 / POR TRÁS DAS PEÇAS</span><h2 id="about-heading">PRAZER,<br />JONATHAN<br /><span>BOLANLE.</span></h2><span className="about-sign">DESIGN, CULTURA & UM BOM REPERTÓRIO.</span></div>
            <div className="about-copy"><p className="about-lead">Há 5 anos, transformo ideias em imagens para criadores de conteúdo, games e esports.</p><p>Minha trajetória inclui a liderança de design para Ilha das Lendas e Baiano, além de trabalhos com a Omelete Company em campanhas e eventos como a CCXP Brasil.</p><p>Na Jonathan BeDesign, conduzo projetos de identidade visual do briefing à entrega. Também trabalho com edição de vídeo, somando movimento ao meu repertório de criação.</p><div className="skill-list"><span>THUMBNAILS & CONTEÚDO</span><span>CAMPANHAS & KEY ART</span><span>IDENTIDADE VISUAL</span><span>EDIÇÃO DE VÍDEO</span></div><div className="resume-links"><a href="/curriculo-pt.pdf" target="_blank" rel="noreferrer">Currículo em português <Download size={16}/></a><a href="/curriculo-en.pdf" target="_blank" rel="noreferrer">Résumé in English <Download size={16}/></a></div></div></div>
        </section>

        <section className="contact-section wrap" id="contato" aria-labelledby="contact-heading">
          <div className="section-top"><span className="eyebrow"><i /> ABERTO A NOVOS PROJETOS</span><span className="section-note">03 / CONTATO</span></div>
          <a className="contact-big" href="mailto:jotabolanle@gmail.com"><h2 id="contact-heading">VAMOS CRIAR<br /><span>ALGO JUNTOS?</span></h2><ArrowUpRight aria-hidden="true" /></a>
          <div className="contact-bottom"><p>Projetos pontuais, parcerias recorrentes<br />e oportunidades em equipes de criação.</p><a href="mailto:jotabolanle@gmail.com"><Mail size={19}/> jotabolanle@gmail.com</a><a href="https://www.linkedin.com/in/johnbolanle/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={18}/></a></div>
        </section>
      </main>
      <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><span>RIO DE JANEIRO, BRASIL</span><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>

      <Dialog open={Boolean(selected)} onOpenChange={open => { if(!open) setSelected(null); }}>
        <DialogContent className="project-dialog" showCloseButton={false}>
          {selected && <>
            <div className="dialog-heading"><div><span className="project-kind">{selected.kind}</span><DialogTitle className="dialog-title">{selected.title}</DialogTitle></div><DialogClose className="icon-button" aria-label="Fechar projeto"><X size={25}/></DialogClose></div>
            <div className="dialog-body">
              <div className="gallery-stage"><div className={`gallery-image ${expanded ? 'expanded' : ''}`} key={`${selected.id}-${activeImage}`}><img src={selected.images[activeImage].src} width={selected.images[activeImage].width} height={selected.images[activeImage].height} alt={`${selected.title}, imagem ${activeImage+1} de ${selected.images.length}`} /></div><div className="gallery-controls"><button className="icon-button" aria-label="Imagem anterior" disabled={selected.images.length < 2} onClick={() => step(-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{String(activeImage+1).padStart(2,'0')} / {String(selected.images.length).padStart(2,'0')}</span><button className="icon-button" aria-label={expanded ? 'Ajustar imagem à tela' : 'Ampliar imagem'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}</button><button className="icon-button" aria-label="Próxima imagem" disabled={selected.images.length < 2} onClick={() => step(1)}><ArrowRight size={20}/></button></div></div>
              <div className="project-context"><DialogDescription className="dialog-description">{selected.description}</DialogDescription><dl><div><dt>CRIAÇÃO</dt><dd>Jonathan Bolanle</dd></div><div><dt>ESPECIALIDADE</dt><dd>{selected.kind}</dd></div></dl><div className="gallery-thumbs" aria-label="Escolher imagem">{selected.images.map((image,i) => <button key={image.src} className={i === activeImage ? 'thumb selected' : 'thumb'} aria-label={`Ver imagem ${i+1}`} aria-pressed={i === activeImage} onClick={() => {setActiveImage(i);setExpanded(false);}}><img src={image.src} alt="" loading="lazy" /></button>)}</div><a className="project-enquiry" href={`mailto:jotabolanle@gmail.com?subject=${encodeURIComponent('Projeto de design - ' + selected.kind)}`}>Tem um projeto em mente? <ArrowUpRight size={18}/></a></div>
            </div>
          </>}
        </DialogContent>
      </Dialog>
    </>
  );
}
