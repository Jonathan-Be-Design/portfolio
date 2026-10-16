export const quoteServices = ['design', 'video', 'motion', 'outro'] as const;
export type QuoteService = (typeof quoteServices)[number];

const serviceLabels: Record<QuoteService, string> = {
  design: 'Design gráfico',
  video: 'Edição de vídeo',
  motion: 'Motion',
  outro: 'Outro',
};

export type QuoteRequest = {
  name: string;
  email: string;
  whatsapp: string;
  services: QuoteService[];
  message: string;
};

type MailParts = { from: string; to: string; raw: string };
type Options = {
  from: string;
  to: string;
  send: (mail: MailParts) => Promise<void>;
  now?: () => Date;
};

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;
const LIMITS = { name: 120, email: 200, whatsapp: 40, message: 4000 };

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

// Remove quebras de linha e caracteres de controle para que nada vire cabeçalho de email.
const isControl = (char: string, keepNewline = false) => {
  const code = char.charCodeAt(0);
  return (code < 32 || code === 127) && !(keepNewline && (char === '\n' || char === '\t'));
};
const oneLine = (value: unknown, max: number) =>
  typeof value === 'string' ? value.split('').map(char => isControl(char) ? ' ' : char).join('').replace(/ {2,}/g, ' ').trim().slice(0, max) : '';

export function parseQuoteRequest(input: unknown): QuoteRequest | { error: string } {
  if (typeof input !== 'object' || input === null) return { error: 'invalid' };
  const data = input as Record<string, unknown>;
  const name = oneLine(data.name, LIMITS.name);
  const email = oneLine(data.email, LIMITS.email).toLowerCase();
  const whatsapp = oneLine(data.whatsapp, LIMITS.whatsapp);
  const message = typeof data.message === 'string'
    ? data.message.replace(/\r\n?/g, '\n').split('').filter(char => !isControl(char, true)).join('').trim().slice(0, LIMITS.message)
    : '';
  const services = Array.isArray(data.services)
    ? [...new Set(data.services.filter((s): s is QuoteService => quoteServices.includes(s as QuoteService)))]
    : [];
  if (!name) return { error: 'name' };
  if (!EMAIL_RE.test(email)) return { error: 'email' };
  if (whatsapp && !/^[\d\s()+.-]{8,40}$/.test(whatsapp)) return { error: 'whatsapp' };
  if (message.length < 10) return { error: 'message' };
  return { name, email, whatsapp, services, message };
}

function encodeHeader(value: string) {
  return /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${toBase64(value)}?=`;
}

function toBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function buildQuoteEmail(quote: QuoteRequest, { from, to, date, id }: { from: string; to: string; date: Date; id: string }) {
  const services = quote.services.length ? quote.services.map(s => serviceLabels[s]).join(', ') : 'Não informado';
  const body = [
    'Novo pedido de orçamento pelo site.',
    '',
    `Nome: ${quote.name}`,
    `Email: ${quote.email}`,
    `WhatsApp: ${quote.whatsapp || 'Não informado'}`,
    `Serviço: ${services}`,
    '',
    'Projeto:',
    quote.message,
    '',
    '—',
    'Responda este email para falar direto com o cliente.',
  ].join('\n');
  const domain = from.split('@')[1];
  const raw = [
    `From: ${encodeHeader('Site Jonathan Bolanle')} <${from}>`,
    `To: <${to}>`,
    `Reply-To: ${encodeHeader(quote.name)} <${quote.email}>`,
    `Subject: ${encodeHeader(`Pedido de orçamento: ${quote.name}`)}`,
    `Date: ${date.toUTCString()}`,
    `Message-ID: <${id}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    toBase64(body).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
  return raw;
}

export function createQuoteHandler({ from, to, send, now = () => new Date() }: Options) {
  return async function POST(request: Request) {
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
    const length = Number(request.headers.get('content-length') ?? 0);
    if (length > 16_000) return json({ ok: false, error: 'too_large' }, 413);
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid' }, 400);
    }
    // Campo escondido: pessoas não preenchem, robôs sim. Fingimos sucesso para não dar pista.
    const trap = (payload as Record<string, unknown> | null)?.website;
    if (typeof trap === 'string' && trap.trim()) return json({ ok: true }, 200);
    const quote = parseQuoteRequest(payload);
    if ('error' in quote) return json({ ok: false, error: quote.error }, 400);
    const raw = buildQuoteEmail(quote, { from, to, date: now(), id: crypto.randomUUID() });
    try {
      await send({ from, to, raw });
    } catch (error) {
      console.error('[orcamento] envio falhou', error instanceof Error ? error.message : 'unknown');
      return json({ ok: false, error: 'send' }, 502);
    }
    return json({ ok: true }, 200);
  };
}
