import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
import { isLocale } from '../i18n';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEnglish = locale === 'en';
  const title = isEnglish ? 'Jonathan Bolanle | Design for creators, gaming and esports' : 'Jonathan Bolanle | Design para criadores, games e esports';
  const description = isEnglish
    ? 'Jonathan Bolanle’s portfolio: YouTube thumbnails, campaigns, posters and visual identity. Based in Rio de Janeiro, available for remote work.'
    : 'Portfólio de Jonathan Bolanle: thumbnails para YouTube, campanhas, pôsteres e identidade visual. Rio de Janeiro, atendimento remoto.';
  const image = '/thumbnails-2/palco/baiano-worlds-capa-azul.jpg';
  return {
    metadataBase: new URL('https://portfolio.jotabolanle.workers.dev'),
    title,
    description,
    alternates: { canonical: `/${locale}`, languages: { 'pt-BR': '/pt', en: '/en', 'x-default': '/pt' } },
    openGraph: {
      type: 'website',
      locale: isEnglish ? 'en_US' : 'pt_BR',
      url: `/${locale}`,
      siteName: 'Jonathan Bolanle — Portfolio',
      title,
      description,
      images: [{ url: image, width: 1920, height: 1080, type: 'image/jpeg', alt: 'Worlds 2024 artwork featured in Jonathan Bolanle’s portfolio' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale === 'pt' ? 'pt-BR' : 'en'}><body className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}>{children}</body></html>;
}
