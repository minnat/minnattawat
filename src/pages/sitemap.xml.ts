import type { APIRoute } from 'astro';

// One page, so the sitemap is written out directly rather than pulling in an
// integration to generate a single URL entry.
export const GET: APIRoute = ({ site }) => {
  const url = new URL('/', site).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
