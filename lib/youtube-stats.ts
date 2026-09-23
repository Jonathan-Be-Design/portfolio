type Stats = Record<string, { views: number; likes: number }>;
type Snapshot = { items: Stats; fetchedAt: number };
type SharedCache = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};
type Options = {
  videoIds: readonly string[];
  apiKey: () => string | undefined;
  fetcher?: typeof fetch;
  now?: () => number;
  sharedCache?: () => SharedCache | undefined;
};

const FRESH_MS = 60 * 60 * 1000;
const STALE_MS = 24 * FRESH_MS;
const RETRY_MS = 60 * 1000;

function count(value: unknown) {
  const number = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  return typeof number === 'number' && Number.isSafeInteger(number) && number >= 0 ? number : 0;
}

// Server-only handler. The key is read at request time, never serialized or logged.
export function createYoutubeStatsHandler(options: Options) {
  const fetcher = options.fetcher ?? fetch;
  const now = options.now ?? Date.now;
  const ids = [...new Set(options.videoIds)].sort();
  const allowed = new Set(ids);
  let snapshot: Snapshot | undefined;
  let retryAt = 0;
  let inFlight: Promise<void> | undefined;

  function error(status: number, message: string) {
    return Response.json({ error: message }, {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...(status === 503 ? { 'Retry-After': '60' } : {}),
        ...(status === 405 ? { Allow: 'GET' } : {}),
      },
    });
  }

  async function refresh(origin: string, apiKey: string) {
    let cache: SharedCache | undefined;
    // A single cache key for the catalog, independent of visitor query strings.
    const cacheKey = new Request(`${origin}/__portfolio-cache/youtube-stats-v1?catalog=${ids.join(',')}`);
    try {
      cache = options.sharedCache?.();
      const cached = await cache?.match(cacheKey);
      if (cached) {
        const entry = await cached.json() as { snapshot?: Snapshot; retryAt?: number };
        if (entry.snapshot && Number.isFinite(entry.snapshot.fetchedAt)
          && entry.snapshot.fetchedAt <= now() && now() - entry.snapshot.fetchedAt < STALE_MS) {
          snapshot = entry.snapshot;
        }
        if (typeof entry.retryAt === 'number' && entry.retryAt > now() && entry.retryAt <= now() + RETRY_MS) {
          retryAt = entry.retryAt;
        }
        if ((snapshot && now() - snapshot.fetchedAt < FRESH_MS) || now() < retryAt) return;
      }
    } catch {
      // Cache outages must not expose platform errors or break the portfolio.
    }

    try {
      const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
      endpoint.searchParams.set('part', 'statistics');
      endpoint.searchParams.set('id', ids.join(','));
      endpoint.searchParams.set('fields', 'items(id,statistics(viewCount,likeCount))');
      endpoint.searchParams.set('key', apiKey);
      const response = await fetcher(endpoint, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
        redirect: 'error',
      });
      if (!response.ok) throw new Error('Upstream unavailable');
      const payload = await response.json() as {
        items?: Array<{ id?: string; statistics?: { viewCount?: unknown; likeCount?: unknown } }>;
      };
      if (!Array.isArray(payload?.items)) throw new Error('Invalid upstream response');
      const items: Stats = {};
      for (const item of payload.items) {
        if (!item?.id || !allowed.has(item.id)) continue;
        items[item.id] = { views: count(item.statistics?.viewCount), likes: count(item.statistics?.likeCount) };
      }
      snapshot = { items, fetchedAt: now() };
      retryAt = 0;
    } catch {
      // Keep the last valid snapshot for at most 24h and back off on failure.
      // Never return/log the upstream error: it can contain the credential URL.
      retryAt = now() + RETRY_MS;
    }

    try {
      await cache?.put(cacheKey, Response.json({ snapshot, retryAt }, {
        headers: { 'Cache-Control': `public, max-age=${STALE_MS / 1000}` },
      }));
    } catch {
      // Per-instance cache and request coalescing still work without shared cache.
    }
  }

  return async function GET(request: Request) {
    if (request.method !== 'GET') return error(405, 'Método não permitido');
    const url = new URL(request.url);
    if (url.search) return error(400, 'Esta consulta não aceita parâmetros');
    const apiKey = options.apiKey();
    if (!apiKey) return error(503, 'Métricas temporariamente indisponíveis');

    if ((!snapshot || now() - snapshot.fetchedAt >= FRESH_MS) && now() >= retryAt) {
      // Concurrent visitors share the same upstream request inside each instance.
      inFlight ??= refresh(url.origin, apiKey).finally(() => { inFlight = undefined; });
      await inFlight;
    }
    if (!snapshot || now() - snapshot.fetchedAt >= STALE_MS) {
      return error(503, 'Métricas temporariamente indisponíveis');
    }
    const freshSeconds = Math.floor((FRESH_MS - (now() - snapshot.fetchedAt)) / 1000);
    return Response.json({ items: snapshot.items }, {
      headers: {
        'Cache-Control': freshSeconds > 0
          ? `public, max-age=${Math.min(900, freshSeconds)}, s-maxage=${freshSeconds}`
          : 'public, max-age=30, s-maxage=30',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  };
}
