import { createYoutubeStatsHandler } from '@/lib/youtube-stats';
import { youtubeVideoIds } from '@/lib/youtube-videos';
import { env } from 'cloudflare:workers';

export const GET = createYoutubeStatsHandler({
  videoIds: youtubeVideoIds,
  apiKey: () => {
    const key = (env as Record<string, unknown>).YOUTUBE_API_KEY;
    return typeof key === 'string' && key ? key : process.env.YOUTUBE_API_KEY;
  },
  sharedCache: () => (globalThis.caches as CacheStorage & { default?: Cache } | undefined)?.default,
});
