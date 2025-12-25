import { SitemapBuilder } from '../lib/sitemap-builder.js';

export default async function handler(req, res) {
  // Set proper headers for XML
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sitemapBuilder = new SitemapBuilder();
    const xml = await sitemapBuilder.generateMainSitemap();
    
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating main sitemap:', error);
    
    // Fallback sitemap
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${process.env.SITE_URL || 'https://salla-ye.store'}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    res.status(200).send(fallbackXml);
  }
}