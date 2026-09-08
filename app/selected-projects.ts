import catalog from './projects.json';

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

// Curadoria de seis projetos aprovada por Jonathan.
export const projects: Project[] = [
  project('worlds-2023', null, {
    id: 'worlds', title: 'Worlds / 2023–2024', coverLayout: 'worlds',
    description: 'Key art e pôsteres para as edições de 2023 e 2024 do Worlds. Uma seleção de composições que reúne jogadores, criadores e o universo competitivo de League of Legends.',
    images: [...selectImages('worlds-2023', [1, 2, 3]), ...selectImages('worlds-2024', [1, 3])],
    coverImages: [...selectImages('worlds-2024', [3]), ...selectImages('worlds-2023', [1])],
  }),
  project('esports', [4, 6, 7, 10, 11, 13], {
    coverImages: selectImages('esports', [13]),
    description: 'Design para conteúdo e transmissões de Ilha das Lendas e Baiano. Chamadas de programação, campeonatos e convidados, com composição e hierarquia adaptadas a cada publicação.',
  }),
  project('gaming', [1, 2, 5, 9, 10, 11], { title: 'Gaming Thumbnails' }),
  project('west-reis', null, { title: 'West Reis', kind: 'Música · Media kit' }),
  project('drew', null, { title: 'DREW', coverLayout: 'drew' }),
  project('1936', [13, 1, 6, 7, 11, 12, 8, 9, 10], {
    coverLayout: 'game', coverImages: selectImages('1936', [1, 13]),
    description: 'Projeto conceitual de game design. Identidade, interface, ilustração e tipografia compõem a apresentação de um universo visual próprio.',
  }),
];
