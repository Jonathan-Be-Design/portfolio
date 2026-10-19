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
    items: { label: string; description?: string; value: string }[];
    total: string;
    payment: string[];
  };
  includes: string[];
  notIncluded: string[];
};

export const proposals: Proposal[] = [
  {
    slug: 'exemplo',
    client: 'Nome da cliente',
    project: 'Identidade visual e kit para redes sociais',
    date: '19 de outubro de 2026',
    validUntil: '2 de novembro de 2026',
    intro: 'Uma identidade que funcione do perfil à campanha: reconhecível no feed, consistente em qualquer peça e pronta para crescer junto com a marca.',
    goals: [
      'Dar à marca uma presença visual própria e fácil de reconhecer.',
      'Padronizar as peças do dia a dia para ganhar tempo na produção.',
      'Preparar a marca para campanhas e parcerias maiores.',
    ],
    scope: [
      {
        title: 'Identidade visual',
        description: 'A base de tudo: o que a marca é e como ela aparece.',
        items: ['Logo principal e versões reduzidas', 'Paleta de cores e tipografia', 'Mini guia de uso da marca'],
      },
      {
        title: 'Kit para redes sociais',
        description: 'Modelos editáveis para manter o padrão sem depender de mim a cada post.',
        items: ['6 modelos de post para feed', '4 modelos de story', 'Capas de destaque e foto de perfil'],
      },
      {
        title: 'Peça de lançamento',
        description: 'Uma arte de campanha para apresentar a nova identidade.',
        items: ['Key art principal', 'Adaptações para feed, story e banner'],
      },
    ],
    timeline: [
      { phase: 'Imersão', duration: '2 dias', description: 'Conversa inicial, referências e definição do caminho visual.' },
      { phase: 'Conceito', duration: '5 dias', description: 'Apresentação de duas direções de identidade para escolha.' },
      { phase: 'Desenvolvimento', duration: '7 dias', description: 'Refinamento da direção escolhida e criação do kit.' },
      { phase: 'Entrega', duration: '2 dias', description: 'Arquivos finais, guia de uso e ajustes finais.' },
    ],
    investment: {
      items: [
        { label: 'Identidade visual', description: 'Logo, paleta, tipografia e guia', value: 'R$ 0.000' },
        { label: 'Kit para redes sociais', description: '10 modelos editáveis e capas', value: 'R$ 0.000' },
        { label: 'Peça de lançamento', description: 'Key art e adaptações', value: 'R$ 000' },
      ],
      total: 'R$ 0.000',
      payment: ['50% na aprovação da proposta', '50% na entrega dos arquivos finais', 'Pix ou transferência'],
    },
    includes: ['Até 2 rodadas de ajustes por etapa', 'Arquivos abertos e exportados (PNG, PDF e SVG)', 'Modelos editáveis no Canva ou Photoshop'],
    notIncluded: ['Impressão e produção gráfica', 'Fotos e banco de imagens pagos', 'Gestão e publicação das redes'],
  },
];

export const getProposal = (slug: string) => proposals.find(item => item.slug === slug);
