'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Mail } from 'lucide-react';
import { tr, type Locale } from './i18n';
import { CONTACT_EMAIL, WhatsappIcon, whatsappLink } from './contact-links';
import EyeMark from './eye-mark';
import SignatureName from './signature-name';

// O not-found não recebe params, então o idioma vem do endereço que a pessoa tentou abrir.
export default function NotFoundPage() {
  const pathname = usePathname() ?? '';
  const locale: Locale = /^\/en(\/|$)/.test(pathname) ? 'en' : 'pt';
  return <>
    <header className="cinema-header is-floating is-page">
      <Link className="signature" href={`/${locale}`} aria-label={tr(locale, 'Jonathan Bolanle, início', 'Jonathan Bolanle, home')}>
        <EyeMark />
        <SignatureName />
      </Link>
      <div className="hero-nav-shell">
        <Link className="hero-contact nav-pill" href={`/${locale}#contato`}><span className="cta-long">{tr(locale, 'Pedir orçamento', 'Get a quote')}</span><span className="cta-short">{tr(locale, 'Orçamento', 'Quote')}</span> <ArrowUpRight size={17}/></Link>
      </div>
    </header>

    <main className="project-page not-found-page">
      <section className="project-hero wrap">
        <span className="eyebrow">{tr(locale, 'Erro 404', 'Error 404')}</span>
        <h1>{tr(locale, 'Essa cena', 'This scene')}<br /><span>{tr(locale, 'ficou de fora do corte.', 'didn’t make the cut.')}</span></h1>
        <p>{tr(locale, 'A página que você procura não existe ou mudou de endereço. Os trabalhos continuam todos no portfólio.', 'The page you’re looking for doesn’t exist or has moved. All the work is still in the portfolio.')}</p>
      </section>

      <section className="project-next wrap">
        <Link href={`/${locale}#projetos`}>
          <span className="eyebrow">{tr(locale, 'Voltar para', 'Back to')}</span>
          <strong>{tr(locale, 'Ver os trabalhos', 'See the work')}</strong>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <section className="contact-section wrap">
        <div className="contact-bottom">
          <p>{tr(locale, 'Procurava algo específico?', 'Looking for something specific?')}<br />{tr(locale, 'Me chama que eu te mando.', 'Get in touch and I’ll send it over.')}</p>
          <div className="contact-socials"><a href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer"><WhatsappIcon/> WhatsApp</a><a href={`mailto:${CONTACT_EMAIL}`}><Mail size={19}/> {CONTACT_EMAIL}</a></div>
        </div>
      </section>
    </main>
    <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><Link href={`/${locale}`}>{tr(locale, 'VOLTAR AO INÍCIO', 'BACK TO HOME')} ↑</Link></footer>
  </>;
}
