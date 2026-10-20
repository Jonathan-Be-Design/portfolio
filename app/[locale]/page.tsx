import { notFound } from 'next/navigation';
import { isLocale } from '../i18n';
import PortfolioPage from '../portfolio-page';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const personId = 'https://jonathanbolanle.studio/#person';
  const websiteId = 'https://jonathanbolanle.studio/#website';
  const url = `https://jonathanbolanle.studio/${locale}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Jonathan Bolanle',
        url: 'https://jonathanbolanle.studio/pt',
        jobTitle: locale === 'pt' ? 'Designer gráfico e editor de vídeo' : 'Graphic designer and video editor',
        sameAs: [
          'https://www.linkedin.com/in/johnbolanle/',
          'https://www.instagram.com/osuperjohn/',
          'https://x.com/osuperjohn',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: 'https://jonathanbolanle.studio/',
        name: 'Jonathan Bolanle — Portfolio',
        inLanguage: ['pt-BR', 'en'],
        author: { '@id': personId },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: locale === 'pt' ? 'Jonathan Bolanle | Design para criadores, games e esports' : 'Jonathan Bolanle | Design for creators, gaming and esports',
        inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
      },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <PortfolioPage locale={locale} />
  </>;
}
