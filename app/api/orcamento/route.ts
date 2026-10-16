import { createQuoteHandler } from '@/lib/quote-request';
import { env } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';

type SendEmail = { send(message: EmailMessage): Promise<void> };

// O binding QUOTE_EMAIL (vite.config.ts) só entrega para o Gmail verificado no Email Routing.
export const POST = createQuoteHandler({
  from: 'orcamento@jonathanbolanle.studio',
  to: 'jotabolanle@gmail.com',
  send: async ({ from, to, raw }) => {
    const binding = (env as Record<string, unknown>).QUOTE_EMAIL as SendEmail | undefined;
    if (!binding) throw new Error('QUOTE_EMAIL binding missing');
    await binding.send(new EmailMessage(from, to, raw));
  },
});
