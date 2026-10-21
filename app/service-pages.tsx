import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Mail } from 'lucide-react';
import { tr, type Locale } from './i18n';
import { CONTACT_EMAIL, WhatsappIcon, whatsappLink } from './contact-links';
import { faq, monthlyIncludes, packages, process, say, services, type Service } from './services';
import EyeMark from './eye-mark';
import SignatureName from './signature-name';
import styles from './services.module.css';

function Shell({ locale, path, children }: { locale: Locale; path: string; children: React.ReactNode }) {
  const other: Locale = locale === 'pt' ? 'en' : 'pt';
  return <div className={styles.page}>
    <header className="cinema-header is-floating is-page">
      <Link className="signature" href={`/${locale}`} aria-label={tr(locale, 'Jonathan Bolanle, início', 'Jonathan Bolanle, home')}>
        <EyeMark />
        <SignatureName />
      </Link>
      <div className="hero-nav-shell">
        <a className="hero-contact nav-pill" href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer"><span className="cta-long">{tr(locale, 'Pedir orçamento', 'Get a quote')}</span><span className="cta-short">{tr(locale, 'Orçamento', 'Quote')}</span> <ArrowUpRight size={17}/></a>
        <Link className="hero-menu nav-pill" href={path === '/servicos' ? `/${locale}` : `/${locale}/servicos`} aria-label={tr(locale, 'Voltar', 'Back')}><ArrowLeft size={18}/></Link>
      </div>
    </header>
    <main>{children}</main>
    <section className={`${styles.closing} ${styles.wrap}`}>
      <span className={styles.kicker}>{tr(locale, 'Próximo passo', 'Next step')}</span>
      <h2>{tr(locale, 'Me conta o que você publica', 'Tell me what you publish')}<br /><span>{tr(locale, 'e eu monto a proposta.', 'and I’ll put together a proposal.')}</span></h2>
      <div className={styles.closingActions}>
        <a className={styles.primary} href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer"><WhatsappIcon /> {tr(locale, 'Chamar no WhatsApp', 'Message on WhatsApp')}</a>
        <a className={styles.secondary} href={`mailto:${CONTACT_EMAIL}`}><Mail size={18} /> {CONTACT_EMAIL}</a>
      </div>
    </section>
    <footer className="site-footer wrap"><span>© {new Date().getFullYear()} JONATHAN BOLANLE</span><Link href={`/${other}${path}`} hrefLang={other === 'pt' ? 'pt-BR' : 'en'}>{tr(locale, 'ENGLISH VERSION', 'VERSÃO EM PORTUGUÊS')}</Link><Link href={`/${locale}`}>{tr(locale, 'VER PORTFÓLIO', 'SEE PORTFOLIO')} ↑</Link></footer>
  </div>;
}

function ServiceLinks({ locale, current }: { locale: Locale; current?: string }) {
  return <ul className={styles.serviceLinks}>
    {services.filter(service => service.slug !== current).map((service, index) => <li key={service.slug}>
      <Link href={`/${locale}/servicos/${service.slug}`}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{say(locale, service.name)}</strong>
        <em>{say(locale, service.price)}</em>
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </li>)}
  </ul>;
}

export function ServicesHub({ locale }: { locale: Locale }) {
  return <Shell locale={locale} path="/servicos">
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <span className={styles.kicker}>{tr(locale, 'Serviços e pacotes', 'Services and packages')}</span>
        <h1>{tr(locale, 'Identidade e conteúdo para quem publica toda semana.', 'Identity and content for people who post every week.')}</h1>
        <p className={styles.lead}>{tr(locale, 'Design, thumbnails e edição de vídeo no mesmo padrão visual, com preço fechado por mês ou por projeto.', 'Design, thumbnails and video editing in one visual system, with a fixed monthly or per-project price.')}</p>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>01 / {tr(locale, 'Pacotes', 'Packages')}</span><h2>{tr(locale, 'Três jeitos de trabalhar junto.', 'Three ways to work together.')}</h2></div>
        <div className={styles.packages}>
          {packages.map(item => {
            const copy = item[locale];
            return <article className={item.featured ? styles.featured : undefined} key={item.pt.title}>
              <span className={styles.tag}>{copy.tag}</span>
              <h3>{copy.title}</h3>
              <p>{copy.text}</p>
              <strong>{copy.price}</strong>
            </article>;
          })}
        </div>
      </div>
    </section>

    <section className={styles.dark} id="pacote-mensal">
      <div className={`${styles.wrap} ${styles.split}`}>
        <div className={styles.sectionHead}><span>02 / {tr(locale, 'Pacote mensal', 'Monthly package')}</span><h2>{tr(locale, 'R$ 2.500 por mês, 20 peças.', 'R$ 2,500 a month, 20 pieces.')}</h2></div>
        <ul className={styles.checks}>{monthlyIncludes.map(item => <li key={item.pt}><Check aria-hidden="true" />{say(locale, item)}</li>)}</ul>
      </div>
    </section>

    <section className={styles.light} id="avulsos">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>03 / {tr(locale, 'Serviços', 'Services')}</span><h2>{tr(locale, 'Também faço sob demanda.', 'Also available on demand.')}</h2></div>
        <ServiceLinks locale={locale} />
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>04 / {tr(locale, 'Como funciona', 'How it works')}</span><h2>{tr(locale, 'Da conversa ao arquivo pronto.', 'From the first call to final files.')}</h2></div>
        <ol className={styles.steps}>{process.map((step, index) => <li key={step.title.pt}><span>{String(index + 1).padStart(2, '0')}</span><h3>{say(locale, step.title)}</h3><p>{say(locale, step.text)}</p></li>)}</ol>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>05 / {tr(locale, 'Dúvidas', 'Questions')}</span><h2>{tr(locale, 'Antes de fechar.', 'Before we start.')}</h2></div>
        <div className={styles.faq}>{faq.map(item => <details key={item.q.pt}><summary>{say(locale, item.q)}</summary><p>{say(locale, item.a)}</p></details>)}</div>
      </div>
    </section>
  </Shell>;
}

export function ServicePage({ locale, service }: { locale: Locale; service: Service }) {
  return <Shell locale={locale} path={`/servicos/${service.slug}`}>
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <span className={styles.kicker}><Link href={`/${locale}/servicos`}>{tr(locale, 'Serviços', 'Services')}</Link> / {say(locale, service.name)}</span>
        <h1>{say(locale, service.title)}</h1>
        <p className={styles.lead}>{say(locale, service.lead)}</p>
        <dl className={styles.heroMeta}>
          <div><dt>{tr(locale, 'Investimento', 'Investment')}</dt><dd>{say(locale, service.price)}</dd></div>
          <div><dt>{tr(locale, 'Nota fiscal', 'Invoice')}</dt><dd>{tr(locale, 'Emitida em todos os projetos', 'Issued for every project')}</dd></div>
        </dl>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>01 / {say(locale, service.problem.title)}</span><h2>{tr(locale, 'Se algum destes soa familiar.', 'If any of these sound familiar.')}</h2></div>
        <ol className={styles.problems}>{service.problem.points.map(point => <li key={point.pt}>{say(locale, point)}</li>)}</ol>
      </div>
    </section>

    <section className={styles.dark}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>02 / {tr(locale, 'Exemplos', 'Examples')}</span><h2>{say(locale, service.examples.title)}</h2></div>
        <div className={`${styles.examples} ${styles[service.examples.frame]}`}>
          {service.examples.images.map(image => {
            const figure = <figure><div><Image src={image.src} width={image.width} height={image.height} alt={say(locale, image.title)} sizes="(max-width: 700px) 90vw, 33vw" /></div><figcaption>{say(locale, image.title)}{image.href && <ArrowUpRight aria-hidden="true" />}</figcaption></figure>;
            return image.href ? <a key={image.src} href={image.href} target="_blank" rel="noopener noreferrer">{figure}</a> : <div key={image.src}>{figure}</div>;
          })}
        </div>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>03 / {tr(locale, 'Como funciona', 'How it works')}</span><h2>{tr(locale, 'Quatro etapas, sem surpresa.', 'Four steps, no surprises.')}</h2></div>
        <ol className={styles.steps}>{service.steps.map((step, index) => <li key={step.title.pt}><span>{String(index + 1).padStart(2, '0')}</span><h3>{say(locale, step.title)}</h3><p>{say(locale, step.text)}</p></li>)}</ol>
      </div>
    </section>

    <section className={styles.light}>
      <div className={`${styles.wrap} ${styles.split}`}>
        <div className={styles.sectionHead}><span>04 / {tr(locale, 'O que está incluso', 'What’s included')}</span><h2>{say(locale, service.price)}</h2></div>
        <ul className={styles.checks}>{service.includes.map(item => <li key={item.pt}><Check aria-hidden="true" />{say(locale, item)}</li>)}</ul>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>05 / {tr(locale, 'Outros serviços', 'Other services')}</span><h2><Link href={`/${locale}/servicos`}>{tr(locale, 'Ver pacotes e preços', 'See packages and prices')} <ArrowUpRight aria-hidden="true" /></Link></h2></div>
        <ServiceLinks locale={locale} current={service.slug} />
      </div>
    </section>
  </Shell>;
}
