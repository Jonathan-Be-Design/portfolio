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

function safeDiagnosticText(value: unknown, apiKey: string) {
  if (typeof value !== 'string') return undefined;
  return value
    .replaceAll(apiKey, '[redacted]')
    .replace(/https?:\/\/[^\s"'<>]+/gi, '[URL redacted]')
    .replace(/\b(api[_-]?key|key|access[_-]?token|token|authorization|credential)\s*[=:]\s*[^\s&,;]+/gi, '$1=[redacted]')
    .replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[redacted]')
    .slice(0, 300);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function logUpstreamFailure(response: Response, apiKey: string) {
  let detail: Record<string, unknown> | undefined;
  try {
    const payload: unknown = await response.clone().json();
    if (isRecord(payload) && isRecord(payload.error)) detail = payload.error;
  } catch {
    // Keep diagnostics useful even when Google returns a non-JSON error body.
  }

  const googleErrors = Array.isArray(detail?.errors) ? detail.errors : [];
  const reasons = googleErrors
    .filter(isRecord)
    .map((item) => safeDiagnosticText(item.reason, apiKey))
    .filter((reason): reason is string => Boolean(reason))
    .slice(0, 5);
  const code = typeof detail?.code === 'number' || typeof detail?.code === 'string'
    ? detail.code
    : undefined;

  console.error('[youtube-stats] YouTube API request failed', {
    httpStatus: response.status,
    statusText: safeDiagnosticText(response.statusText, apiKey),
    googleCode: code === undefined ? undefined : safeDiagnosticText(String(code), apiKey),
    googleReasons: reasons,
    googleMessage: safeDiagnosticText(detail?.message, apiKey),
  });
}

function logRuntimeFailure(cause: unknown, apiKey: string) {
  const name = isRecord(cause) && typeof cause.name === 'string' ? cause.name : 'Error';
  const message = isRecord(cause) && typeof cause.message === 'string' ? cause.message : 'Unknown runtime error';
  console.error('[youtube-stats] Runtime failure during refresh', {
    name: safeDiagnosticText(name, apiKey),
    message: safeDiagnosticText(message, apiKey),
  });
}

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
    let upstreamFailureLogged = false;
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
        redirect: 'manual',
      });
      if (!response.ok) {
        await logUpstreamFailure(response, apiKey);
        upstreamFailureLogged = true;
        throw new Error('Upstream unavailable');
      }
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
    } catch (cause) {
      // Keep the last valid snapshot for at most 24h and back off on failure.
      // Public responses stay generic; diagnostic text is explicitly redacted.
      if (!upstreamFailureLogged) logRuntimeFailure(cause, apiKey);
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
    if (!apiKey) {
      console.error('[youtube-stats] Missing YOUTUBE_API_KEY runtime binding');
      return error(503, 'Métricas temporariamente indisponíveis');
    }

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
