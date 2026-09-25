import type { Metadata } from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio.jotabolanle.workers.dev'),
  title: 'Jonathan Bolanle | Design para criadores, games e esports',
  description: 'Portfólio de Jonathan Bolanle: thumbnails para YouTube, campanhas, pôsteres e identidade visual. Rio de Janeiro, atendimento remoto.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Jonathan Bolanle — Portfólio',
    title: 'Jonathan Bolanle | Design para criadores, games e esports',
    description: 'Thumbnails para YouTube, campanhas, pôsteres e identidade visual. Conheça meus trabalhos para criadores, games e esports.',
    images: [{
      url: '/thumbnails-2/palco/baiano-worlds-capa-azul.jpg',
      width: 1920,
      height: 1080,
      type: 'image/jpeg',
      alt: 'Projeto visual Worlds 2024 apresentado no portfólio de Jonathan Bolanle',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonathan Bolanle | Design para criadores, games e esports',
    description: 'Thumbnails para YouTube, campanhas, pôsteres e identidade visual.',
    images: ['/thumbnails-2/palco/baiano-worlds-capa-azul.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
