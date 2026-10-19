// Propostas comerciais. Cada proposta vira uma página em /proposta/<slug>,
// fora do menu e do Google: só abre quem recebe o link.

export type Proposal = {
  slug: string;
  client: string;
  project: string;
  date: string;
  validUntil: string;
  intro: string;
  goals: string[];
  scope: { title: string; description: string; items: string[] }[];
  timeline: { phase: string; duration: string; description: string }[];
  investment: {
    items: { label: string; description?: string; value?: string }[];
    total?: string;
    payment: string[];
  };
  includes: string[];
  notIncluded: string[];
  // Trabalhos mostrados em "Quem assina". Sem isso, a página usa a seleção padrão.
  work?: { src: string; width: number; height: number; title: string }[];
};

export const proposals: Proposal[] = [
  {
    slug: 'narrativas-invisiveis',
    client: 'Damaris Lago',
    project: 'Narrativas Invisíveis no Instagram e TikTok',
    date: '19 de outubro de 2026',
    validUntil: '2 de novembro de 2026',
    intro: 'Um perfil que pareça um lugar onde alguém entra para pensar: editorial, limpo, cinematográfico e com pouco ruído visual, do primeiro cartaz ao último vídeo.',
    goals: [
      'Lançar o @narrativas.invisiveiss com uma linguagem visual própria, sofisticada e fácil de reconhecer.',
      'Manter presença constante, com 3 a 4 publicações por semana entre cartazes, carrosséis e reels.',
      'Apresentar a autora sem enfraquecer a estrategista: o livro aparece como mais uma frente, não como mudança de área.',
    ],
    scope: [
      {
        title: 'Linha visual do perfil',
        description: 'Pesquisa e criação da identidade que todos os conteúdos vão seguir.',
        items: ['Pesquisa de referências e direção de arte', 'Tipografia, cores e tratamento de imagem', 'Modelos-base de cartaz, carrossel e vídeo'],
      },
      {
        title: 'Cartazes editoriais',
        description: 'Posts tipográficos com frases autorais e de referência, feitos para serem salvos e compartilhados.',
        items: ['15 cartazes de lâmina única', 'Tipografia e composição editoriais', 'Versões para feed e story'],
      },
      {
        title: 'Carrosséis',
        description: 'Ideias desenvolvidas em sequência, no mesmo padrão visual dos cartazes.',
        items: ['10 carrosséis de até 7 lâminas', 'Capa pensada para parar o scroll', 'Diagramação dos textos enviados'],
      },
      {
        title: 'Vídeos âncora',
        description: 'Narração em off sobre montagem de imagens, sons e música, no formato do vídeo sobre homens.',
        items: ['10 vídeos de até 3 minutos', 'Montagem, trilha e desenho de som', 'Legendas e versões para Reels e TikTok'],
      },
      {
        title: 'Edição de vídeos',
        description: 'Tratamento dos vídeos gravados pela Damaris, como os de escrita e leitura de trechos.',
        items: ['5 edições de até 1 minuto', 'Corte, ritmo, cor e legendas', 'Mesma identidade dos demais conteúdos'],
      },
    ],
    timeline: [
      { phase: 'Linha visual', duration: 'Semana 1', description: 'Definição de tipografia, cores e modelos de cartaz, carrossel e vídeo para aprovação.' },
      { phase: 'Primeiro lote', duration: 'Semana 2', description: 'Conteúdos das primeiras semanas prontos antes do lançamento do perfil.' },
      { phase: 'Produção contínua', duration: 'Semanas 3 a 12', description: 'Entregas por lote, acompanhando o ritmo de 3 a 4 publicações por semana.' },
      { phase: 'Fechamento', duration: 'Ao fim do pacote', description: 'Arquivos finais organizados e conversa sobre os próximos formatos.' },
    ],
    investment: {
      items: [
        { label: 'Linha visual do perfil', description: 'Pesquisa, direção de arte e modelos-base' },
        { label: '15 cartazes editoriais', description: 'Lâmina única' },
        { label: '10 carrosséis', description: 'Até 7 lâminas cada' },
        { label: '10 vídeos âncora', description: 'Narração em off, até 3 minutos' },
        { label: '5 edições de vídeo', description: 'Material enviado, até 1 minuto' },
      ],
      payment: ['Condições a combinar', 'Pix ou transferência', 'Emissão de nota fiscal', 'Contrato assinado antes do início'],
    },
    includes: ['Até 2 rodadas de ajustes por peça', 'Arquivos nos formatos de Instagram e TikTok', 'Trilhas de bancos licenciados para uso nas redes'],
    notIncluded: ['Captação e gravação de vídeos', 'Roteiros e textos, que vêm da Damaris', 'Publicação e gestão dos perfis', 'Minifilmes, micronarrativas e minidocs, que podem ser orçados à parte'],
    work: [
      { src: '/trabalhos/cinema-02.jpg', width: 856, height: 1024, title: 'Design editorial · Festival de Cinema' },
      { src: '/trabalhos/moon-01.jpg', width: 1200, height: 1477, title: 'Identidade visual · Moon Store' },
      { src: '/trabalhos/desenvolva-01.webp', width: 1200, height: 675, title: 'Identidade visual · Desenvolva-se' },
    ],
  },
];

export const getProposal = (slug: string) => proposals.find(item => item.slug === slug);
