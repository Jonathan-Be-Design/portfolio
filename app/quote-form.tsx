'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, Mail } from 'lucide-react';
import { tr, type Locale } from './i18n';
import { CONTACT_EMAIL, WhatsappIcon, whatsappLink } from './contact-links';

const services = [
  { id: 'design', pt: 'Design gráfico', en: 'Graphic design' },
  { id: 'video', pt: 'Edição de vídeo', en: 'Video editing' },
  { id: 'motion', pt: 'Motion', en: 'Motion' },
  { id: 'outro', pt: 'Outro', en: 'Other' },
];

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function QuoteForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<State>('idle');
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggle = (id: string) => setPicked(list => list.includes(id) ? list.filter(item => item !== id) : [...list, id]);

  async function submit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState('sending');
    setError('');
    try {
      const response = await fetch('/api/orcamento', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          whatsapp: data.get('whatsapp'),
          message: data.get('message'),
          website: data.get('website'),
          services: picked,
        }),
      });
      const result = await response.json().catch(() => ({})) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        const messages: Record<string, string> = {
          name: tr(locale, 'Coloque seu nome.', 'Please add your name.'),
          email: tr(locale, 'Confira o email.', 'Please check your email.'),
          whatsapp: tr(locale, 'Confira o número de WhatsApp.', 'Please check the WhatsApp number.'),
          message: tr(locale, 'Conte um pouco mais sobre o projeto.', 'Tell me a bit more about the project.'),
        };
        setError(messages[result.error ?? ''] ?? '');
        setState('error');
        return;
      }
      form.reset();
      setPicked([]);
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') {
    return <div className="quote-done" aria-live="polite">
      <span className="quote-done-icon"><Check size={22}/></span>
      <h3>{tr(locale, 'Pedido enviado.', 'Request sent.')}</h3>
      <p>{tr(locale, 'Já recebi aqui e te respondo pelo email. Se for urgente, me chama no WhatsApp.', 'Got it. I’ll reply by email. If it’s urgent, message me on WhatsApp.')}</p>
      <button type="button" onClick={() => setState('idle')}>{tr(locale, 'Enviar outro pedido', 'Send another request')}</button>
    </div>;
  }

  return <form className="quote-form" onSubmit={submit}>
    <fieldset className="quote-services">
      <legend>{tr(locale, 'O que você precisa?', 'What do you need?')}</legend>
      <div>
        {services.map(service => <button type="button" key={service.id} className={picked.includes(service.id) ? 'is-picked' : ''} aria-pressed={picked.includes(service.id)} onClick={() => toggle(service.id)}>{locale === 'pt' ? service.pt : service.en}</button>)}
      </div>
    </fieldset>
    <div className="quote-row">
      <label><span>{tr(locale, 'Nome', 'Name')}</span><input name="name" autoComplete="name" required maxLength={120} /></label>
      <label><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
    </div>
    <label><span>WhatsApp <em>{tr(locale, '(opcional)', '(optional)')}</em></span><input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} placeholder="(21) 90000-0000" /></label>
    <label><span>{tr(locale, 'Sobre o projeto', 'About the project')}</span><textarea name="message" required minLength={10} maxLength={4000} rows={4} placeholder={tr(locale, 'O que é, para quando e onde vai ser usado.', 'What it is, when you need it and where it will be used.')} /></label>
    <label className="quote-trap" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
    <div className="quote-actions">
      <button type="submit" className="quote-submit" disabled={state === 'sending'}>{state === 'sending' ? tr(locale, 'Enviando…', 'Sending…') : tr(locale, 'Pedir orçamento', 'Request a quote')} <ArrowUpRight size={18}/></button>
      {state === 'error' && <p className="quote-error" role="alert">{error || <>{tr(locale, 'Não consegui enviar agora. Me chama no WhatsApp ou em ', 'Couldn’t send right now. Message me on WhatsApp or at ')}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</>}</p>}
    </div>
  </form>;
}

export function QuoteAside({ locale }: { locale: Locale }) {
  return <div className="quote-aside">
    <p>{tr(locale, 'Prefere conversar direto?', 'Rather talk directly?')}</p>
    <a className="quote-whatsapp" href={whatsappLink(locale)} target="_blank" rel="noopener noreferrer"><WhatsappIcon/> {tr(locale, 'Chamar no WhatsApp', 'Message on WhatsApp')} <ArrowUpRight size={17}/></a>
    <a className="quote-mail" href={`mailto:${CONTACT_EMAIL}`}><Mail size={18}/> {CONTACT_EMAIL}</a>
  </div>;
}
