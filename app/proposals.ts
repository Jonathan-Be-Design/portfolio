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
    validUntil: '3 de novembro de 2026',
    intro: 'Identidade visual e 40 conteúdos para o Instagram e o TikTok, de novembro a janeiro. Um perfil editorial, limpo e cinematográfico, do primeiro cartaz ao último vídeo.',
    goals: [
      'Lançar o @narrativasinvisiveiss com uma identidade fixa: poucas cores e duas fontes, sempre as mesmas.',
      'Manter presença constante, com 3 a 4 publicações por semana entre cartazes, carrosséis e vídeos.',
      'Fazer cartaz, carrossel e vídeo variarem entre si, mas parecerem da mesma família.',
    ],
    scope: [
      {
        title: 'Identidade visual do perfil',
        description: 'A base de tudo. O que for aprovado aqui vira o padrão dos três meses.',
        items: ['Paleta fixa de 5 cores, com a regra de uso de cada uma', '2 famílias de fontes e o padrão das chamadas de capa', 'Modelos de cartaz, carrossel e vídeo', '3 a 4 peças de teste com os seus textos'],
      },
      {
        title: 'Cartazes',
        description: 'Uma lâmina só, com uma frase forte. É o post mais rápido de ler e o que mais circula.',
        items: ['15 cartazes no pacote', 'As 15 frases marcadas em verde entram no primeiro lote', 'Versões para feed e story'],
      },
      {
        title: 'Carrosséis',
        description: 'O formato para explicar a tese com calma e trazer a pesquisa, sempre com a mesma estrutura.',
        items: ['10 carrosséis de até 7 lâminas', 'Capa, desenvolvimento, nota de pesquisa e pergunta final', '4 já têm texto pronto e entram no primeiro lote'],
      },
      {
        title: 'Vídeos Âncora',
        description: 'Narração em off sobre uma montagem de imagens, som e música, no formato do vídeo "O que é ser homem".',
        items: ['10 vídeos de até 3 minutos', 'Montagem, trilha e efeitos de banco licenciado', 'Legendas, capa no padrão do perfil e cartela final'],
      },
      {
        title: 'Edição dos seus vídeos',
        description: 'Os vídeos que você mesma grava ganham o mesmo acabamento dos outros formatos.',
        items: ['5 edições de até 1 minuto', 'Cortes, ritmo e legendas no padrão do perfil', 'Capa e cartela final'],
      },
    ],
    timeline: [
      { phase: 'Identidade visual', duration: 'Até 7 dias úteis', description: 'Paleta, fontes, modelos e peças de teste, contados a partir da aprovação e do envio das referências.' },
      { phase: 'Lote de novembro', duration: 'Antes do lançamento', description: 'Estoque inicial: os 15 cartazes em verde e os 4 carrosséis com texto pronto.' },
      { phase: 'Lote de dezembro', duration: 'Ao longo de dezembro', description: 'Vídeos Âncora, edições e carrosséis, conforme chegam os textos, roteiros e vídeos.' },
      { phase: 'Lote de janeiro', duration: 'Ao longo de janeiro', description: 'O restante do pacote, fechando os 40 conteúdos.' },
    ],
    investment: {
      items: [
        { label: 'Identidade visual do perfil', description: 'Paleta, fontes, chamadas de capa, modelos e peças de teste', value: 'R$ 1.200' },
        { label: '15 cartazes', description: 'Lâmina única · R$ 90 cada', value: 'R$ 1.350' },
        { label: '10 carrosséis', description: 'Até 7 lâminas · R$ 250 cada', value: 'R$ 2.500' },
        { label: '10 vídeos Âncora', description: 'Narração em off, até 3 minutos · R$ 250 cada', value: 'R$ 2.500' },
        { label: '5 edições dos seus vídeos', description: 'Até 1 minuto · R$ 250 cada', value: 'R$ 1.250' },
      ],
      total: 'R$ 8.800',
      payment: [
        'Na entrega da identidade visual: R$ 1.200,00',
        'Na entrega do lote de novembro: R$ 2.533,34',
        'Na entrega do lote de dezembro: R$ 2.533,33',
        'Na entrega do lote de janeiro: R$ 2.533,33',
        'Pix ou transferência em até 5 dias após cada entrega',
        'Contrato assinado e nota fiscal emitida',
      ],
    },
    includes: ['Criação e arte final nos formatos do Instagram e do TikTok (4:5 e 9:16)', '2 rodadas de ajuste por peça', 'Trilha e efeitos de banco licenciado nos vídeos Âncora', 'Arquivos finais prontos para postar'],
    notIncluded: ['Texto e roteiro dos conteúdos, que vêm de você e da sua equipe', 'Locução, gravada por você ou por locutor contratado à parte', 'Captação, filmagem, fotos, minidocumentários e minifilmes', 'Imagens ou músicas pagas fora dos bancos que eu já uso', 'Postagem, legendas de post e gestão do perfil', 'Conteúdos para o YouTube e para o @atryabooks'],
    work: [
      { src: '/trabalhos/cinema-02.jpg', width: 856, height: 1024, title: 'Design editorial · Festival de Cinema' },
      { src: '/trabalhos/moon-01.jpg', width: 1200, height: 1477, title: 'Identidade visual · Moon Store' },
      { src: '/trabalhos/desenvolva-01.webp', width: 1200, height: 675, title: 'Identidade visual · Desenvolva-se' },
    ],
  },
];

export const getProposal = (slug: string) => proposals.find(item => item.slug === slug);
