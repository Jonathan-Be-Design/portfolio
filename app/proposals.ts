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
    totalLabel?: string;
    payment: string[];
  };
  includes: string[];
  notIncluded: string[];
};

export const proposals: Proposal[] = [
  {
    slug: 'narrativas-invisiveis',
    client: 'Damaris Lago',
    project: 'Narrativas Invisíveis no Instagram, TikTok e YouTube',
    date: '19 de outubro de 2026',
    validUntil: '3 de novembro de 2026',
    intro: 'Identidade visual e um pacote mensal de 20 peças para o Instagram, o TikTok e o YouTube. Um perfil editorial, limpo e cinematográfico, do primeiro cartaz ao último vídeo.',
    goals: [
      'Lançar o @narrativasinvisiveiss com uma identidade fixa: poucas cores e duas fontes, sempre as mesmas.',
      'Manter presença constante, com 20 peças por mês entre cartazes, carrosséis e vídeos.',
      'Fazer cartaz, carrossel e vídeo variarem entre si, mas parecerem da mesma família.',
    ],
    scope: [
      {
        title: 'Identidade visual do perfil',
        description: 'A base de tudo. O que for aprovado aqui vira o padrão de todos os meses.',
        items: ['Paleta fixa de 5 cores, com a regra de uso de cada uma', '2 famílias de fontes e o padrão das chamadas de capa', 'Modelos de cartaz, carrossel e vídeo', '3 a 4 peças de teste com os seus textos'],
      },
      {
        title: 'Cartazes',
        description: 'Uma lâmina só, com uma frase forte. É o post mais rápido de ler e o que mais circula.',
        items: ['As frases marcadas em verde entram no primeiro mês', 'Tipografia e composição editoriais', 'Versões para feed e story'],
      },
      {
        title: 'Carrosséis',
        description: 'O formato para explicar a tese com calma e trazer a pesquisa, sempre com a mesma estrutura.',
        items: ['Até 7 lâminas cada', 'Capa, desenvolvimento, nota de pesquisa e pergunta final', 'Os 4 com texto pronto entram no primeiro mês'],
      },
      {
        title: 'Vídeos Âncora',
        description: 'Narração em off sobre uma montagem de imagens, som e música, no formato do vídeo "O que é ser homem".',
        items: ['Até 3 minutos cada', 'Locução via IA ou com a sua voz', 'Montagem, trilha, legendas, capa e cartela final'],
      },
      {
        title: 'Edição dos seus vídeos',
        description: 'Os vídeos que você mesma grava ganham o mesmo acabamento dos outros formatos.',
        items: ['Até 1 minuto cada', 'Cortes, ritmo e legendas no padrão do perfil', 'Capa e cartela final'],
      },
    ],
    timeline: [
      { phase: 'Identidade visual', duration: 'Até 7 dias úteis', description: 'Paleta, fontes, modelos e peças de teste, contados a partir da aprovação e do envio das referências.' },
      { phase: 'Primeiro mês', duration: 'Novembro', description: 'Estoque inicial antes do lançamento: os cartazes em verde e os carrosséis com texto pronto.' },
      { phase: 'Produção mensal', duration: 'Todo mês', description: '20 peças por mês, combinando os formatos conforme chegam os textos, roteiros e vídeos.' },
      { phase: 'Revisão do pacote', duration: 'A cada mês', description: 'Conversa rápida para ajustar a mistura de formatos do mês seguinte.' },
    ],
    investment: {
      items: [
        { label: 'Identidade visual do perfil', description: 'Entrega única · paleta, fontes, modelos e peças de teste', value: 'R$ 1.200' },
        { label: 'Pacote mensal · 20 peças', description: 'Cartazes, carrosséis, vídeos Âncora e edições, na mistura que o mês pedir', value: 'R$ 2.500/mês' },
      ],
      totalLabel: 'Por mês',
      total: 'R$ 2.500',
      payment: [
        'Identidade visual: R$ 1.200, na entrega',
        'Pacote mensal: R$ 2.500, na entrega de cada mês',
        'Pix ou transferência em até 5 dias após cada entrega',
        'Contrato assinado e nota fiscal emitida',
      ],
    },
    includes: ['Criação e arte final nos formatos do Instagram, do TikTok e do YouTube', 'Locução via IA ou com a sua própria voz', 'Imagens e músicas licenciadas, inclusive de bancos pagos', '2 rodadas de ajuste por peça', 'Arquivos finais prontos para postar'],
    notIncluded: ['Texto e roteiro dos conteúdos, que vêm de você e da sua equipe', 'Captação, filmagem, fotos, minidocumentários e minifilmes', 'Postagem, legendas de post e gestão do perfil', 'Conteúdos para o @atryabooks'],
  },
];

export const getProposal = (slug: string) => proposals.find(item => item.slug === slug);
