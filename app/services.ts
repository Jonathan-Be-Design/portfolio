import catalog from './projects.json';
import type { Locale } from './i18n';

type Text = { pt: string; en: string };
type Frame = 'wide' | 'poster' | 'square';
export type ServiceImage = { src: string; width: number; height: number; title: Text; href?: string };
export type Service = {
  slug: string;
  name: Text;
  title: Text;
  lead: Text;
  price: Text;
  problem: { title: Text; points: Text[] };
  examples: { title: Text; frame: Frame; images: ServiceImage[] };
  steps: { title: Text; text: Text }[];
  includes: Text[];
};

const t = (pt: string, en: string): Text => ({ pt, en });
const wide = (src: string, pt: string, en = pt, href?: string): ServiceImage => ({ src, width: 1920, height: 1080, title: t(pt, en), href });
function work(id: string, pt: string, en = pt): ServiceImage {
  const project = catalog.find(item => item.id === id);
  if (!project) throw new Error(`Projeto desconhecido: ${id}`);
  return { ...project.images[0], title: t(pt, en), href: undefined };
}

// Pacotes exibidos na página inicial e na página de serviços.
export const packages = [
  { featured: false, href: '/servicos/identidade-visual',
    pt: { tag: 'Entrega única', title: 'Identidade do perfil', text: 'Paleta, fontes, chamadas de capa e modelos de cartaz, carrossel e vídeo, com peças de teste para aprovar.', price: 'A partir de R$ 1.200' },
    en: { tag: 'One-off', title: 'Profile identity', text: 'Palette, typefaces, cover headlines and templates for posters, carousels and video, with test pieces to approve.', price: 'From R$ 1,200' } },
  { featured: true, href: '/servicos#pacote-mensal',
    pt: { tag: 'Recomendado', title: 'Pacote mensal', text: '20 peças por mês entre cartazes, carrosséis, thumbnails e vídeos, sempre no mesmo padrão visual.', price: 'R$ 2.500 por mês' },
    en: { tag: 'Recommended', title: 'Monthly package', text: '20 pieces a month across posters, carousels, thumbnails and videos, always in the same visual system.', price: 'R$ 2,500 a month' } },
  { featured: false, href: '/servicos#avulsos',
    pt: { tag: 'Sob demanda', title: 'Peças avulsas', text: 'Thumbnails, key art, capas e edições de vídeo para lançamentos, campanhas e transmissões.', price: 'Orçamento por projeto' },
    en: { tag: 'On demand', title: 'Single pieces', text: 'Thumbnails, key art, covers and video edits for launches, campaigns and broadcasts.', price: 'Quoted per project' } },
];

export const monthlyIncludes: Text[] = [
  t('20 peças por mês, divididas entre os formatos que você mais usa', '20 pieces a month, split across the formats you use most'),
  t('Instagram, TikTok e YouTube: cartaz, carrossel, capa, thumbnail e vídeo curto', 'Instagram, TikTok and YouTube: posters, carousels, covers, thumbnails and short videos'),
  t('Locução por IA ou com a sua própria voz', 'AI voice-over or your own voice'),
  t('Imagens e músicas licenciadas, inclusive de bancos pagos', 'Licensed images and music, including paid stock libraries'),
  t('Duas rodadas de ajuste por peça', 'Two rounds of revisions per piece'),
  t('Arquivos finais prontos para postar', 'Final files ready to post'),
];

export const process = [
  { title: t('Conversa', 'Call'), text: t('Você conta o que publica, para quem e com que frequência. Eu volto com um formato e um preço fechado.', 'You tell me what you publish, for whom and how often. I come back with a format and a fixed price.') },
  { title: t('Direção visual', 'Visual direction'), text: t('Defino paleta, fontes e modelos, e mando peças de teste para você aprovar antes de produzir.', 'I define palette, typefaces and templates, and send test pieces for you to approve before production.') },
  { title: t('Produção', 'Production'), text: t('As peças saem no ritmo combinado, sempre no mesmo padrão, com duas rodadas de ajuste.', 'Pieces arrive at the agreed pace, always in the same system, with two rounds of revisions.') },
  { title: t('Entrega', 'Delivery'), text: t('Arquivos finais nos formatos de cada rede, organizados por data, prontos para postar.', 'Final files in each platform’s formats, organized by date, ready to post.') },
];

export const faq = [
  { q: t('Você emite nota fiscal?', 'Do you issue invoices?'), a: t('Sim, emito nota fiscal para todos os projetos.', 'Yes, every project is invoiced.') },
  { q: t('Escreve os textos e roteiros?', 'Do you write the copy and scripts?'), a: t('O texto e o roteiro vêm de você. Eu cuido do design, da edição e da adaptação para cada formato.', 'The copy and scripts come from you. I handle design, editing and adapting each format.') },
  { q: t('Posta nas minhas redes?', 'Do you post on my accounts?'), a: t('Não faço postagem nem gestão de perfil. Entrego os arquivos prontos e organizados para você publicar.', 'I don’t post or manage accounts. I deliver files ready and organized for you to publish.') },
  { q: t('Posso mudar o pacote depois?', 'Can I change the package later?'), a: t('Sim. O pacote é revisado todo mês e dá para trocar a divisão entre formatos conforme a demanda.', 'Yes. The package is reviewed every month and the mix of formats can change with demand.') },
];

export const services: Service[] = [
  {
    slug: 'identidade-visual',
    name: t('Identidade visual', 'Visual identity'),
    title: t('Uma cara própria para a sua marca ou perfil.', 'A look of your own for your brand or profile.'),
    lead: t('Logo, paleta, fontes e modelos prontos para o dia a dia, para que cada post pareça seu sem você precisar pensar no layout.', 'Logo, palette, typefaces and everyday templates, so every post looks like you without thinking about layout.'),
    price: t('A partir de R$ 1.200', 'From R$ 1,200'),
    problem: { title: t('Quando faz falta', 'When you need it'), points: [
      t('Cada post sai com uma cor e uma fonte diferente.', 'Every post comes out in a different colour and typeface.'),
      t('O perfil não passa a seriedade do trabalho que você faz.', 'Your profile doesn’t show how serious your work is.'),
      t('Você perde tempo montando layout do zero toda semana.', 'You lose time building layouts from scratch every week.'),
    ] },
    examples: { title: t('Identidades que já desenhei', 'Identities I have designed'), frame: 'square', images: [
      work('desenvolva', 'Desenvolva-se'),
      work('regi', 'Tia Regi Biscoitos'),
      work('moon', 'Moon Store'),
    ] },
    steps: [
      { title: t('Briefing', 'Brief'), text: t('Entendo o seu público, as referências e o que precisa ficar de fora.', 'I learn your audience, references and what must stay out.') },
      { title: t('Direção', 'Direction'), text: t('Apresento uma direção com logo, cores e fontes aplicadas em peças reais.', 'I present one direction with logo, colours and typefaces on real pieces.') },
      { title: t('Ajustes', 'Revisions'), text: t('Duas rodadas de ajuste até ficar do jeito certo.', 'Two rounds of revisions until it’s right.') },
      { title: t('Kit final', 'Final kit'), text: t('Você recebe os arquivos, um guia curto e modelos editáveis.', 'You get the files, a short guide and editable templates.') },
    ],
    includes: [
      t('Logo e variações', 'Logo and variations'),
      t('Paleta de cores e fontes', 'Colour palette and typefaces'),
      t('Modelos de post, carrossel, capa e vídeo', 'Templates for posts, carousels, covers and video'),
      t('Guia de uso de uma página', 'One-page usage guide'),
      t('Entrega em até 7 dias úteis', 'Delivered within 7 business days'),
    ],
  },
  {
    slug: 'thumbnails',
    name: t('Thumbnails', 'Thumbnails'),
    title: t('Thumbnails que fazem a pessoa parar e clicar.', 'Thumbnails that make people stop and click.'),
    lead: t('Mais de 300 milhões de visualizações em vídeos com capas minhas, para criadores de games, esports e entretenimento.', 'More than 300 million views on videos with my covers, for gaming, esports and entertainment creators.'),
    price: t('Orçamento por projeto, ou dentro do pacote mensal', 'Quoted per project, or part of the monthly package'),
    problem: { title: t('Quando faz falta', 'When you need it'), points: [
      t('O vídeo é bom, mas a taxa de clique não acompanha.', 'The video is good, but the click-through rate isn’t.'),
      t('As capas do canal não seguem um padrão reconhecível.', 'Your channel’s covers don’t follow a recognizable style.'),
      t('Você precisa de capa rápida para vídeo, live ou corte.', 'You need fast covers for videos, streams or clips.'),
    ] },
    examples: { title: t('Capas para Baiano, Ilha das Lendas e Minerva', 'Covers for Baiano, Ilha das Lendas and Minerva'), frame: 'wide', images: [
      wide('/impact/baiano-worlds-capa-azul.webp', 'Baiano · Worlds 2024'),
      wide('/impact/final-worlds-faker-chovy.webp', 'Final Worlds · Faker × Chovy', 'Worlds Final · Faker × Chovy'),
      wide('/impact/minerva-eldenring.webp', 'Minerva · Elden Ring'),
      wide('/impact/idl-baiano-worlds-londres.webp', 'Ilha das Lendas em Londres', 'Ilha das Lendas in London'),
      wide('/impact/minerva-expedition-33.webp', 'Minerva · Expedition 33'),
      wide('/impact/baiano-heineken-djonga.webp', 'Baiano × Heineken · Djonga'),
    ] },
    steps: [
      { title: t('Pauta', 'Topic'), text: t('Você manda o vídeo ou a ideia e o título que pretende usar.', 'You send the video or idea and the title you plan to use.') },
      { title: t('Conceito', 'Concept'), text: t('Proponho a imagem principal e a frase da capa.', 'I propose the main image and the cover line.') },
      { title: t('Arte', 'Artwork'), text: t('Tratamento, recorte e composição no padrão do canal.', 'Retouching, cut-outs and composition in your channel’s style.') },
      { title: t('Entrega', 'Delivery'), text: t('Arquivo em 1280×720 e versões para testes A/B quando fizer sentido.', '1280×720 file plus A/B test versions when useful.') },
    ],
    includes: [
      t('Tratamento de imagem e recorte', 'Retouching and cut-outs'),
      t('Frase de capa pensada para o clique', 'Cover line written for the click'),
      t('Versões para teste A/B', 'Versions for A/B testing'),
      t('Duas rodadas de ajuste', 'Two rounds of revisions'),
    ],
  },
  {
    slug: 'key-art',
    name: t('Key art e campanhas', 'Key art and campaigns'),
    title: t('Pôsteres e key art para lançamentos e eventos.', 'Posters and key art for launches and events.'),
    lead: t('Peças para campanhas com Riot Games, Heineken e Snapdragon, do pôster principal às adaptações para cada rede.', 'Campaign work with Riot Games, Heineken and Snapdragon, from the main poster to each platform’s adaptations.'),
    price: t('Orçamento por projeto', 'Quoted per project'),
    problem: { title: t('Quando faz falta', 'When you need it'), points: [
      t('Um evento, lançamento ou temporada precisa de uma imagem forte.', 'An event, launch or season needs a strong image.'),
      t('A campanha vai rodar em muitos formatos ao mesmo tempo.', 'The campaign runs in many formats at once.'),
      t('Patrocinadores precisam aparecer sem poluir a arte.', 'Sponsors need to appear without cluttering the artwork.'),
    ] },
    examples: { title: t('Worlds e pôsteres de esports', 'Worlds and esports posters'), frame: 'poster', images: [
      work('worlds-2024', 'Worlds 2024'),
      work('worlds-2023', 'Worlds 2023'),
      work('posters', 'Pôsteres de esports', 'Esports posters'),
    ] },
    steps: [
      { title: t('Briefing', 'Brief'), text: t('Datas, formatos, marcas envolvidas e a mensagem principal.', 'Dates, formats, brands involved and the key message.') },
      { title: t('Key art', 'Key art'), text: t('Crio a peça principal que define o visual da campanha.', 'I create the main piece that sets the campaign’s look.') },
      { title: t('Desdobramentos', 'Roll-out'), text: t('Adapto para feed, stories, banner, telão e o que mais precisar.', 'I adapt it for feed, stories, banners, screens and anything else.') },
      { title: t('Entrega', 'Delivery'), text: t('Arquivos finais organizados por formato e prazo.', 'Final files organized by format and deadline.') },
    ],
    includes: [
      t('Peça principal da campanha', 'Main campaign artwork'),
      t('Adaptações para redes, banner e telão', 'Adaptations for social, banners and screens'),
      t('Aplicação de marcas de patrocinadores', 'Sponsor brand placement'),
      t('Duas rodadas de ajuste', 'Two rounds of revisions'),
    ],
  },
  {
    slug: 'edicao-de-video',
    name: t('Edição de vídeo', 'Video editing'),
    title: t('Vídeos curtos e longos editados para prender até o fim.', 'Short and long videos edited to hold attention to the end.'),
    lead: t('Cortes, legendas, trilha e ritmo para Reels, TikTok, Shorts e YouTube, no mesmo padrão visual das suas capas.', 'Cuts, captions, music and pacing for Reels, TikTok, Shorts and YouTube, in the same visual style as your covers.'),
    price: t('Orçamento por projeto, ou dentro do pacote mensal', 'Quoted per project, or part of the monthly package'),
    problem: { title: t('Quando faz falta', 'When you need it'), points: [
      t('Você grava, mas não tem tempo de editar.', 'You record, but have no time to edit.'),
      t('As pessoas saem do vídeo nos primeiros segundos.', 'People leave in the first few seconds.'),
      t('Os cortes de cada rede saem com cara diferente.', 'Clips for each platform look different.'),
    ] },
    examples: { title: t('Canais e transmissões onde já trabalhei', 'Channels and broadcasts I have worked on'), frame: 'wide', images: [
      wide('/thumbnails-2/palco/idl-baiano-worlds-londres.jpg', 'Worlds em Londres · Ilha das Lendas', 'Worlds in London · Ilha das Lendas', 'https://www.youtube.com/watch?v=GE6CFz7hOIw'),
      wide('/thumbnails-2/palco/DQnLLVIRhVM-HD.jpg', 'Costream do CBLOL · Ilha das Lendas', 'CBLOL co-stream · Ilha das Lendas', 'https://www.youtube.com/watch?v=DQnLLVIRhVM'),
      wide('/thumbnails-2/palco/robo-cblol-idl.jpg', 'Robo de Camille · Resumo LTA', 'Robo on Camille · LTA highlights', 'https://www.youtube.com/watch?v=wJdVLB2mKVo'),
    ] },
    steps: [
      { title: t('Material', 'Footage'), text: t('Você manda o bruto, o roteiro ou os pontos principais.', 'You send the raw footage, script or key points.') },
      { title: t('Primeiro corte', 'First cut'), text: t('Monto a estrutura com gancho nos primeiros segundos.', 'I build the structure with a hook in the first seconds.') },
      { title: t('Acabamento', 'Finishing'), text: t('Legenda, trilha licenciada, locução e cor.', 'Captions, licensed music, voice-over and colour.') },
      { title: t('Entrega', 'Delivery'), text: t('Versões em 9:16 e 16:9, prontas para cada rede.', '9:16 and 16:9 versions, ready for each platform.') },
    ],
    includes: [
      t('Cortes, legendas e ritmo', 'Cuts, captions and pacing'),
      t('Trilha e imagens licenciadas', 'Licensed music and images'),
      t('Locução por IA ou com a sua voz', 'AI voice-over or your own voice'),
      t('Versões vertical e horizontal', 'Vertical and horizontal versions'),
    ],
  },
];

export const getService = (slug: string) => services.find(service => service.slug === slug);
export const say = (locale: Locale, text: Text) => text[locale];
