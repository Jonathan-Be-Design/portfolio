import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '../../../i18n';
import { getProjects } from '../../../selected-projects';
import ProjectPage from '../../../project-page';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return (['pt', 'en'] as const).flatMap(locale => getProjects(locale).map(project => ({ locale, slug: project.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProjects(locale).find(item => item.id === slug);
  if (!project) return {};
  return {
    metadataBase: new URL('https://jonathanbolanle.studio'),
    title: `${project.title} | Jonathan Bolanle`,
    description: project.description,
    alternates: { canonical: `/${locale}/trabalhos/${slug}`, languages: { 'pt-BR': `/pt/trabalhos/${slug}`, en: `/en/trabalhos/${slug}` } },
    openGraph: { title: `${project.title} | Jonathan Bolanle`, description: project.description, images: [{ url: project.images[0].src }] },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const projects = getProjects(locale);
  const index = projects.findIndex(item => item.id === slug);
  if (index === -1) notFound();
  return <ProjectPage locale={locale} project={projects[index]} next={projects[(index + 1) % projects.length]} />;
}
