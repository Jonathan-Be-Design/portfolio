import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';
import { tr, type Locale } from './i18n';
import type { Project } from './selected-projects';
import EyeMark from './eye-mark';

export default function ProjectPage({ locale, project, next }: { locale: Locale; project: Project; next: Project }) {
  const other: Locale = locale === 'pt' ? 'en' : 'pt';
  return <>
    <header className="cinema-header is-floating">
      <Link className="signature" href={`/${locale}`} aria-label={tr(locale, 'Jonathan Bolanle, início', 'Jonathan Bolanle, home')}>
        <EyeMark />
      </Link>
      <div className="hero-nav-shell">
        <Link className="hero-contact nav-pill" href={`/${locale}#contato`}><span className="cta-long">{tr(locale, 'Pedir orçamento', 'Get a quote')}</span><span className="cta-short">{tr(locale, 'Orçamento', 'Quote')}</span> <ArrowUpRight size={17}/></Link>
        <Link className="hero-menu nav-pill" href={`/${locale}#projetos`} aria-label={tr(locale, 'Voltar para os trabalhos', 'Back to all work')}><ArrowLeft size={18}/></Link>
      </div>
    </header>

    <main className="project-page">
      <section className="project-hero wrap">
        <span className="eyebrow">{tr(locale, 'Trabalhos', 'Work')} / {project.kind}</span>
        <h1>{project.title}</h1>
        <div className="project-meta">
          <p>{project.description}</p>
          <dl>
            <div><dt>{tr(locale, 'Criação', 'Created by')}</dt><dd>{project.creator ?? 'Jonathan Bolanle'}</dd></div>
            {project.contributor && <div><dt>{tr(locale, 'Colaboração', 'Contribution')}</dt><dd>{project.contributor}</dd></div>}
            <div><dt>{tr(locale, 'Especialidade', 'Specialty')}</dt><dd>{project.kind}</dd></div>
          </dl>
        </div>
      </section>

      <section className="project-gallery wrap" aria-label={tr(locale, 'Imagens do projeto', 'Project images')}>
        {project.images.map((image, i) => <figure key={image.src}>
          <Image src={image.src} width={image.width} height={image.height} sizes="(max-width: 700px) 100vw, 1400px" alt={`${project.title}, ${tr(locale, 'imagem', 'image')} ${i + 1} ${tr(locale, 'de', 'of')} ${project.images.length}`} priority={i === 0} />
        </figure>)}
      </section>

      <section className="project-next wrap">
        <Link href={`/${locale}/trabalhos/${next.id}`}>
          <span className="eyebrow">{tr(locale, 'Próximo projeto', 'Next project')}</span>
          <strong>{next.title}</strong>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="contact-section wrap">
        <a className="contact-big" href="mailto:jotabolanle@gmail.com"><h2>{tr(locale, 'Vamos criar', 'Let’s create')}<br /><span>{tr(locale, 'algo juntos?', 'something together?')}</span></h2><ArrowUpRight aria-hidden="true" /></a>
        <div className="contact-bottom">
          <p>{tr(locale, 'Projetos pontuais, parcerias recorrentes', 'One-off projects, ongoing partnerships')}<br />{tr(locale, 'e oportunidades em equipes de criação.', 'and opportunities with creative teams.')}</p>
          <a href="mailto:jotabolanle@gmail.com"><Mail size={19}/> jotabolanle@gmail.com</a>
        </div>
      </section>
    </main>
    <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><Link href={`/${other}/trabalhos/${project.id}`} hrefLang={other === 'pt' ? 'pt-BR' : 'en'}>{tr(locale, 'ENGLISH VERSION', 'VERSÃO EM PORTUGUÊS')}</Link><Link href={`/${locale}`}>{tr(locale, 'VOLTAR AO INÍCIO', 'BACK TO HOME')} ↑</Link></footer>
  </>;
}
