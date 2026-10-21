import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '../../../i18n';
import { getService, say, services } from '../../../services';
import { ServicePage } from '../../../service-pages';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return (['pt', 'en'] as const).flatMap(locale => services.map(service => ({ locale, slug: service.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  const title = `${say(locale, service.name)} | Jonathan Bolanle`;
  const description = say(locale, service.lead);
  const image = service.examples.images[0].src;
  return {
    metadataBase: new URL('https://jonathanbolanle.studio'),
    title,
    description,
    alternates: { canonical: `/${locale}/servicos/${slug}`, languages: { 'pt-BR': `/pt/servicos/${slug}`, en: `/en/servicos/${slug}` } },
    openGraph: { title, description, url: `/${locale}/servicos/${slug}`, images: [{ url: image }] },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) notFound();
  return <ServicePage locale={locale} service={service} />;
}
