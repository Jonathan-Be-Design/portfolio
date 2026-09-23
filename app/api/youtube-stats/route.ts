const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export async function GET(request: Request) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'YouTube API não configurada' }, { status: 503 });
  }

  const url = new URL(request.url);
  const ids = [...new Set((url.searchParams.get('ids') ?? '').split(',').filter(id => VIDEO_ID.test(id)))].slice(0, 50);
  if (!ids.length) return Response.json({ items: {} });

  const endpoint = new URL('https://www.googleapis.com/youtube/v3/videos');
  endpoint.searchParams.set('part', 'statistics');
  endpoint.searchParams.set('id', ids.join(','));
  endpoint.searchParams.set('key', apiKey);

  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    return Response.json({ error: 'Não foi possível consultar o YouTube' }, { status: response.status });
  }

  const payload = await response.json() as { items?: Array<{ id: string; statistics?: { viewCount?: string; likeCount?: string } }> };
  const items = Object.fromEntries((payload.items ?? []).map(item => [item.id, {
    views: Number(item.statistics?.viewCount ?? 0),
    likes: Number(item.statistics?.likeCount ?? 0),
  }]));

  return Response.json({ items }, { headers: { 'Cache-Control': 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400' } });
}
