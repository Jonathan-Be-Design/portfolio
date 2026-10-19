import type { MetadataRoute } from 'next';
import { SITE_URL } from './site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    // Páginas de teste de layout, a API e as propostas de clientes não devem aparecer no Google.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/opcoes-pagina-4', '/teste-pagina-4', '/proposta/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
