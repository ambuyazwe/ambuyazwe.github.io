import type { APIRoute } from 'astro';
import { readGallerySections, slugForPdf } from '../lib/content';

const SITE = 'https://ambuyazwe.github.io';
const STATIC = ['/', '/gallery', '/contact'];

export const GET: APIRoute = () => {
  const sections = readGallerySections();
  const pdfSlugs = sections.flatMap(s =>
    s.pdfs.map(pdf => `/pdf/${slugForPdf(pdf.title, pdf.file)}`)
  );

  const urls = [...STATIC, ...pdfSlugs]
    .map(path => `  <url><loc>${SITE}${path}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
