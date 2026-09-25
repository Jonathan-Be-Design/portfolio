import catalog from './projects.json';
import type { Locale } from './i18n';

export type ProjectImage = { src: string; width: number; height: number };
export type Project = {
  id: string;
  title: string;
  category: string;
  kind: string;
  description: string;
  images: ProjectImage[];
  source: string;
  coverImages: ProjectImage[];
  coverLayout: 'wide' | 'worlds' | 'drew' | 'game';
  creator?: string;
  contributor?: string;
};

function original(id: string) {
  const project = catalog.find(project => project.id === id);
  if (!project) throw new Error(`Projeto desconhecido: ${id}`);
  return project;
}

function selectImages(id: string, numbers: number[]) {
  return numbers.map(number => {
    const image = original(id).images[number - 1];
    if (!image) throw new Error(`Peça não encontrada: ${id}/${number}`);
    return image;
  });
}

function project(id: string, numbers: number[] | null, overrides: Partial<Project>): Project {
  const source = original(id);
  return { ...source, images: numbers ? selectImages(id, numbers) : source.images,
    coverImages: [source.images[0]], coverLayout: 'wide', ...overrides };
}

// Outros trabalhos e contribuições selecionados por Jonathan.
const projectsPt: Project[] = [
  project('west-reis', null, { title: 'West Reis', kind: 'Música · Media kit' }),
  project('drew', null, {
    title: 'DREW', coverLayout: 'drew', creator: 'André Ferreira Carneiro', contributor: 'Jonathan Bolanle',
    description: 'Projeto de branding e identidade visual desenvolvido por André Ferreira Carneiro, com colaboração de Jonathan Bolanle.',
  }),
  project('1936', [13, 1, 6, 7, 11, 12, 8, 9, 10], {
    coverLayout: 'game', coverImages: selectImages('1936', [1, 13]),
    creator: 'André Ferreira Carneiro', contributor: 'Jonathan Bolanle',
    description: 'Projeto conceitual de game design criado por André Ferreira Carneiro, com colaboração de Jonathan Bolanle. Identidade, interface, ilustração e tipografia compõem a apresentação de um universo visual próprio.',
  }),
];

export function getProjects(locale: Locale): Project[] {
  if (locale === 'pt') return projectsPt;
  return projectsPt.map(project => {
    if (project.id === 'west-reis') return { ...project, category: 'Editorial & more', kind: 'Music · Media kit',
      description: 'A visual presentation for West Reis. Photography, contrast and typography bring structure to the artist’s visual identity.' };
    if (project.id === 'drew') return { ...project, category: 'Visual identity', kind: 'Branding & visual identity',
      description: 'Branding and visual identity project created by André Ferreira Carneiro, with contributions from Jonathan Bolanle.' };
    if (project.id === '1936') return { ...project, category: 'Editorial & more',
      description: 'Concept game design project created by André Ferreira Carneiro, with contributions from Jonathan Bolanle. Identity, interface, illustration and typography shape the presentation of its visual world.' };
    return project;
  });
}
