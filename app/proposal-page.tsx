import { ArrowUpRight, Check, Minus, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import EyeMark from './eye-mark';
import { CONTACT_EMAIL, WhatsappIcon } from './contact-links';
import type { Proposal } from './proposals';
import styles from './proposal.module.css';

const WHATSAPP_NUMBER = '5521965729594';

const metrics = [
  { value: '300M+', label: 'visualizações totais' },
  { value: '2B+', label: 'impressões nas redes' },
  { value: '5K+', label: 'peças produzidas' },
];

const brands = [
  { name: 'Baiano', logo: '/logos/baiano.png', width: 1366, height: 338 },
  { name: 'Ilha das Lendas', logo: '/logos/ilha-das-lendas.svg', width: 1500, height: 514 },
  { name: 'Omelete & Co', logo: '/logos/omelete-co.png', width: 1700, height: 198 },
  { name: 'Riot Games', logo: '/logos/riot-games.png', width: 5275, height: 682 },
  { name: 'Heineken', logo: '/logos/heineken.png', width: 1280, height: 308 },
];

const work = [
  { src: '/posters/final-worlds-2024.webp', width: 1620, height: 2025, title: 'Key art · Worlds 2024' },
  { src: '/impact/baiano-heineken-djonga.webp', width: 1280, height: 720, title: 'Campanha · Baiano × Heineken' },
  { src: '/trabalhos/west-reis-hero.jpg', width: 1920, height: 1262, title: 'Mídia kit · West Reis' },
];

export default function ProposalPage({ proposal }: { proposal: Proposal }) {
  const approveText = `Olá, Jonathan! Li a proposta "${proposal.project}" e quero seguir.`;
  const approveLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(approveText)}`;
  const n = (i: number) => String(i).padStart(2, '0');

  return <main className={styles.page}>
    <section className={styles.cover}>
      <header className={styles.coverTop}>
        <Link href="/pt" className={styles.brand}><EyeMark /><span>Jonathan Bolanle</span></Link>
        <span className={styles.tag}>Proposta comercial</span>
      </header>
      <div className={styles.coverBody}>
        <p className={styles.kicker}>Para {proposal.client}</p>
        <h1>{proposal.project}</h1>
        <p className={styles.lead}>{proposal.intro}</p>
      </div>
      <dl className={styles.coverMeta}>
        <div><dt>Data</dt><dd>{proposal.date}</dd></div>
        <div><dt>Válida até</dt><dd>{proposal.validUntil}</dd></div>
        <div><dt>Investimento</dt><dd>{proposal.investment.total}</dd></div>
      </dl>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>01 / Objetivo</span><h2>O que esse projeto precisa resolver</h2></div>
        <ol className={styles.goals}>
          {proposal.goals.map((goal, i) => <li key={goal}><span>{n(i + 1)}</span><p>{goal}</p></li>)}
        </ol>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>02 / Escopo</span><h2>O que será entregue</h2></div>
        <div className={styles.scope}>
          {proposal.scope.map((block, i) => <article key={block.title}>
            <span className={styles.index}>{n(i + 1)}</span>
            <h3>{block.title}</h3>
            <p>{block.description}</p>
            <ul>{block.items.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <section className={styles.light}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>03 / Etapas</span><h2>Como vamos trabalhar</h2></div>
        <ol className={styles.timeline}>
          {proposal.timeline.map((step, i) => <li key={step.phase}>
            <div className={styles.stepTop}><span>{n(i + 1)}</span><em>{step.duration}</em></div>
            <h3>{step.phase}</h3>
            <p>{step.description}</p>
          </li>)}
        </ol>
      </div>
    </section>

    <section className={styles.dark}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>04 / Investimento</span><h2>Valores e condições</h2></div>
        <div className={styles.investment}>
          <div className={styles.priceTable}>
            {proposal.investment.items.map(item => <div className={styles.priceRow} key={item.label}>
              <div><strong>{item.label}</strong>{item.description && <p>{item.description}</p>}</div>
              <span>{item.value}</span>
            </div>)}
            <div className={styles.priceTotal}><strong>Total</strong><span>{proposal.investment.total}</span></div>
          </div>
          <div className={styles.terms}>
            <h3>Pagamento</h3>
            <ul>{proposal.investment.payment.map(item => <li key={item}>{item}</li>)}</ul>
            <h3>Incluso</h3>
            <ul className={styles.yes}>{proposal.includes.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
            <h3>Não incluso</h3>
            <ul className={styles.no}>{proposal.notIncluded.map(item => <li key={item}><Minus size={15} />{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.dark}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><span>05 / Quem assina</span><h2>Cinco anos criando para quem precisa ser visto</h2></div>
        <div className={styles.metrics}>
          {metrics.map(metric => <div key={metric.value}><strong>{metric.value}</strong><p>{metric.label}</p></div>)}
        </div>
        <div className={styles.work}>
          {work.map(item => <figure key={item.src}>
            <Image src={item.src} alt={item.title} width={item.width} height={item.height} sizes="(max-width: 800px) 90vw, 30vw" />
            <figcaption>{item.title}</figcaption>
          </figure>)}
        </div>
        <div className={styles.brands} aria-label="Marcas com quem já trabalhei">
          {brands.map(brand => <Image key={brand.name} src={brand.logo} alt={brand.name} width={brand.width} height={brand.height} sizes="160px" unoptimized={brand.logo.endsWith('.svg')} />)}
        </div>
        <Link className={styles.portfolioLink} href="/pt">Ver portfólio completo <ArrowUpRight size={17} /></Link>
      </div>
    </section>

    <section className={styles.cta}>
      <div className={styles.wrap}>
        <span className={styles.kicker}>06 / Próximo passo</span>
        <h2>Vamos começar?</h2>
        <p>Para aprovar, é só me chamar. Depois da confirmação envio o contrato e marcamos a conversa de imersão.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={approveLink} target="_blank" rel="noopener noreferrer"><WhatsappIcon /> Aprovar pelo WhatsApp <ArrowUpRight size={17} /></a>
          <a className={styles.secondary} href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Proposta: ${proposal.project}`)}`}><Mail size={17} /> {CONTACT_EMAIL}</a>
        </div>
      </div>
    </section>

    <footer className={styles.footer}><span>© {new Date().getFullYear()} Jonathan Bolanle</span><span>Rio de Janeiro, Brasil</span><span>jonathanbolanle.studio</span></footer>
  </main>;
}
