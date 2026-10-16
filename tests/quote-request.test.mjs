import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuoteHandler, parseQuoteRequest } from '../lib/quote-request.ts';

const post = body => new Request('https://portfolio.example/api/orcamento', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const valid = { name: 'Ana Souza', email: 'ana@exemplo.com', whatsapp: '(21) 99999-0000', services: ['design', 'motion'], message: 'Preciso de um key art para uma campanha.' };

test('valid request sends one email with the client as reply-to', async () => {
  const sent = [];
  const handler = createQuoteHandler({ from: 'orcamento@site.test', to: 'dono@site.test', send: async mail => { sent.push(mail); } });
  const response = await handler(post(valid));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0].raw, /^Reply-To: Ana Souza <ana@exemplo\.com>\r$/m);
  const body = Buffer.from(sent[0].raw.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8');
  assert.match(body, /Serviço: Design gráfico, Motion/);
});
test('header injection is flattened and bad input is rejected', async () => {
  const parsed = parseQuoteRequest({ ...valid, name: 'Ana\r\nBcc: x@y.z' });
  assert.equal(parsed.name, 'Ana Bcc: x@y.z');
  for (const bad of [{ ...valid, email: 'nope' }, { ...valid, name: '' }, { ...valid, message: 'oi' }, { ...valid, email: 'a@b.c\r\nBcc: x@y.z' }]) {
    assert.ok('error' in parseQuoteRequest(bad));
  }
});
test('honeypot fakes success without sending', async () => {
  const handler = createQuoteHandler({ from: 'a@b.test', to: 'c@d.test', send: async () => assert.fail('sent') });
  assert.equal((await handler(post({ ...valid, website: 'spam.example' }))).status, 200);
});
test('send failure returns 502', async () => {
  const handler = createQuoteHandler({ from: 'a@b.test', to: 'c@d.test', send: async () => { throw new Error('x'); } });
  assert.equal((await handler(post(valid))).status, 502);
});
