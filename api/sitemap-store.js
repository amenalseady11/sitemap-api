import { SitemapBuilder } from '../lib/sitemap-builder.js';

export default async function handler(req, res) {
  // Set proper headers for XML
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1800'); // Cache for 30 minutes
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { storeId } = req.query;

  if (!storeId) {
    res.status(400).json({ error: 'Store ID is required' });
    return;
  }

  try {
    const sitemapBuilder = new SitemapBuilder();
    const xml = await sitemapBuilder.generateStoreSitemap(storeId);
    
    res.status(200).send(xml);
  } catch (error) {
    console.error(`Error generating sitemap for store ${storeId}:`, error);
    
    // Fallback sitemap for store
    const siteUrl = process.env.SITE_URL || 'https://salla-ye.store';
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/store_${storeId}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    
    res.status(200).send(fallbackXml);
  }
}