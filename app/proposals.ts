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
        { label: '15 cartazes editoriais', description: 'Lâmina única' },
        { label: '10 carrosséis', description: 'Até 7 lâminas cada' },
        { label: '10 vídeos âncora', description: 'Narração em off, até 3 minutos' },
        { label: '5 edições de vídeo', description: 'Material enviado, até 1 minuto' },
      ],
      payment: ['Condições a combinar', 'Pix ou transferência'],
    },
    includes: ['Linha visual do perfil, sem custo extra', 'Até 2 rodadas de ajustes por peça', 'Arquivos nos formatos de Instagram e TikTok', 'Trilhas de bancos licenciados para uso nas redes'],
    notIncluded: ['Captação e gravação de vídeos', 'Roteiros e textos, que vêm da Damaris', 'Publicação e gestão dos perfis', 'Minifilmes, micronarrativas e minidocs, que podem ser orçados à parte'],
  },
];

export const getProposal = (slug: string) => proposals.find(item => item.slug === slug);
