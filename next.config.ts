import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    if (process.env.NODE_ENV === 'production') {
      headers.push(
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Strict-Transport-Security', value: 'max-age=15552000' },
        {
          key: 'Content-Security-Policy',
          // Inline scripts/styles are needed by React streaming and GSAP.
          // Third-party video scripts execute inside the isolated YouTube frame.
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://i.ytimg.com",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
            "media-src 'self' blob:",
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
          ].join('; '),
        },
      );
    }
    // Vinext's wildcard header matcher does not include the bare root URL.
    return [{ source: '/', headers }, { source: '/:path*', headers }];
  },
};

export default nextConfig;
