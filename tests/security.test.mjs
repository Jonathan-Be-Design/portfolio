import test from 'node:test';
import assert from 'node:assert/strict';
import { createYoutubeStatsHandler } from '../lib/youtube-stats.ts';
import { youtubeVideoIds } from '../lib/youtube-videos.ts';
import nextConfig from '../next.config.ts';

const ID = 'GNWCdEoOlaM';
const SECRET = 'test-only-credential-never-real';
const HOUR = 3600000;
const request = (suffix = '') => new Request(`https://portfolio.example/api/youtube-stats${suffix}`);
const payload = () => Response.json({ items: [{ id: ID, statistics: { viewCount: '65200', likeCount: '4100' } }] });
const options = (overrides = {}) => ({ videoIds: [ID], apiKey: () => SECRET, ...overrides });
function sharedCache() {
  const entries = new Map();
  return {
    async match(key) { return entries.get(key.url)?.clone(); },
    async put(key, response) { entries.set(key.url, response.clone()); },
  };
}

test('catalog IDs are valid and unique', () => {
  assert.equal(new Set(youtubeVideoIds).size, youtubeVideoIds.length);
  assert.ok(youtubeVideoIds.length <= 50);
  assert.ok(youtubeVideoIds.every(id => /^[A-Za-z0-9_-]{11}$/.test(id)));
});
test('arbitrary IDs and cache-busting parameters never reach YouTube', async () => {
  let calls = 0;
  const get = createYoutubeStatsHandler(options({ fetcher: async () => { calls++; return payload(); } }));
  for (const suffix of ['?ids=aaaaaaaaaaa', `?ids=${ID}`, '?fresh=123', '?key=anything']) {
    const response = await get(request(suffix));
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal(calls, 0);
});
test('missing key and unsupported methods do not call upstream', async () => {
  const get = createYoutubeStatsHandler(options({ apiKey: () => undefined, fetcher: async () => assert.fail('upstream called') }));
  const response = await get(request());
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal((await get(new Request(request(), { method: 'POST' }))).status, 405);
});
test('concurrent visitors share one bounded call without exposing credentials', async () => {
  let calls = 0;
  const get = createYoutubeStatsHandler(options({ fetcher: async (input, init) => {
    calls++;
    const url = new URL(input);
    assert.equal(url.origin, 'https://www.googleapis.com');
    assert.equal(url.searchParams.get('id'), ID);
    assert.equal(url.searchParams.get('key'), SECRET);
    assert.ok(init.signal instanceof AbortSignal);
    assert.equal(init.redirect, 'error');
    await new Promise(resolve => setTimeout(resolve, 10));
    return payload();
  } }));
  const responses = await Promise.all(Array.from({ length: 12 }, () => get(request())));
  for (const response of responses) {
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.ok(!body.includes(SECRET));
    assert.equal(JSON.parse(body).items[ID].views, 65200);
  }
  await get(request());
  assert.equal(calls, 1);
});
test('shared cache survives creation of another handler instance', async () => {
  let calls = 0;
  const cache = sharedCache();
  const config = options({ sharedCache: () => cache, fetcher: async () => { calls++; return payload(); } });
  await createYoutubeStatsHandler(config)(request());
  assert.equal((await createYoutubeStatsHandler(config)(request())).status, 200);
  assert.equal(calls, 1);
});
test('upstream errors hide secrets and trigger a shared retry cooldown', async () => {
  let calls = 0;
  const cache = sharedCache();
  const config = options({ sharedCache: () => cache, fetcher: async () => { calls++; throw new Error(`failed?key=${SECRET}`); } });
  const first = await createYoutubeStatsHandler(config)(request());
  const second = await createYoutubeStatsHandler(config)(request());
  assert.equal(first.status, 503);
  assert.equal(second.status, 503);
  assert.ok(!(await first.text()).includes(SECRET));
  assert.equal(calls, 1);
});
test('stale data survives temporary failures but expires after 24 hours', async () => {
  let time = 100000000;
  let calls = 0;
  const get = createYoutubeStatsHandler(options({ now: () => time, fetcher: async () => {
    if (++calls === 1) return payload();
    return Response.json({ error: SECRET }, { status: 403 });
  } }));
  await get(request());
  time += HOUR + 1;
  const stale = await get(request());
  assert.equal(stale.status, 200);
  assert.equal((await stale.json()).items[ID].views, 65200);
  await get(request());
  assert.equal(calls, 2);
  time += 24 * HOUR;
  assert.equal((await get(request())).status, 503);
});
test('unknown IDs and invalid counts are not reflected', async () => {
  const get = createYoutubeStatsHandler(options({ fetcher: async () => Response.json({ items: [
    { id: ID, statistics: { viewCount: '-1', likeCount: 'Infinity' } },
    { id: 'aaaaaaaaaaa', statistics: { viewCount: '99' } },
  ] }) }));
  assert.deepEqual(await (await get(request())).json(), { items: { [ID]: { views: 0, likes: 0 } } });
});
test('malformed upstream payload and offline cache produce a controlled error', async () => {
  const get = createYoutubeStatsHandler(options({
    sharedCache: () => { throw new Error('cache offline'); },
    fetcher: async () => Response.json({ message: SECRET }),
  }));
  const response = await get(request());
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes(SECRET));
});
test('production headers allow YouTube but block objects and eval', async () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    const rules = await nextConfig.headers();
    assert.ok(rules.some(rule => rule.source === '/'));
    const headers = Object.fromEntries(rules[0].headers.map(({ key, value }) => [key, value]));
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['X-Frame-Options'], 'SAMEORIGIN');
    assert.match(headers['Content-Security-Policy'], /frame-src https:\/\/www.youtube.com/);
    assert.match(headers['Content-Security-Policy'], /object-src 'none'/);
    assert.ok(!headers['Content-Security-Policy'].includes('unsafe-eval'));
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
