import type { MetadataRoute } from 'next';
import { getProjects } from './selected-projects';
import { SITE_URL } from './site-url';

const languages = (path: string) => ({ 'pt-BR': `${SITE_URL}/pt${path}`, en: `${SITE_URL}/en${path}`, 'x-default': `${SITE_URL}/pt${path}` });

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...getProjects('pt').map(project => `/trabalhos/${project.id}`)];
  return paths.flatMap(path => (['pt', 'en'] as const).map(locale => ({
    url: `${SITE_URL}/${locale}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
    alternates: { languages: languages(path) },
  })));
}
