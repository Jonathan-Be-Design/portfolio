import { tr, type Locale } from './i18n';

export const CONTACT_EMAIL = 'contato@jonathanbolanle.studio';
const WHATSAPP_NUMBER = '5521965729594';

export function whatsappLink(locale: Locale) {
  const text = tr(locale, 'Olá, Jonathan! Vim pelo seu site e queria um orçamento.', 'Hi Jonathan! I found your website and would like a quote.');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function WhatsappIcon() {
  return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.89.9-3-.2-.31a8.2 8.2 0 1 1 6.87 3.75Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5l.37-.43c.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05c0 1.21.88 2.38 1 2.55.13.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"/></svg>;
}
