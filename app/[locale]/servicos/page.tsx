import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '../../i18n';
import { ServicesHub } from '../../service-pages';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = locale === 'en' ? 'Services and packages | Jonathan Bolanle' : 'Serviços e pacotes | Jonathan Bolanle';
  const description = locale === 'en'
    ? 'Visual identity, thumbnails, key art and video editing for creators. Monthly package of 20 pieces for R$ 2,500.'
    : 'Identidade visual, thumbnails, key art e edição de vídeo para criadores. Pacote mensal de 20 peças por R$ 2.500.';
  return {
    metadataBase: new URL('https://jonathanbolanle.studio'),
    title,
    description,
    alternates: { canonical: `/${locale}/servicos`, languages: { 'pt-BR': '/pt/servicos', en: '/en/servicos' } },
    openGraph: { title, description, url: `/${locale}/servicos` },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ServicesHub locale={locale} />;
}
