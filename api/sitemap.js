// import { SitemapBuilder } from '../lib/sitemap-builder.js';

// export default async function handler(req, res) {
//   // Set proper headers for XML
//   res.setHeader('Content-Type', 'application/xml; charset=utf-8');
//   res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   if (req.method !== 'GET') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }

//   try {
//     const sitemapBuilder = new SitemapBuilder();
//     const xml = await sitemapBuilder.generateSiteSitemap();
    
//     res.status(200).send(xml);
//   } catch (error) {
//     console.error('Error generating site sitemap:', error);
    
//     // Fallback sitemap
//     const siteUrl = process.env.SITE_URL || 'https://salla-ye.store';
//     const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url>
//     <loc>${siteUrl}</loc>
//     <changefreq>daily</changefreq>
//     <priority>1.0</priority>
//   </url>
//   <url>
//     <loc>${siteUrl}/login</loc>
//     <changefreq>monthly</changefreq>
//     <priority>0.3</priority>
//   </url>
//   <url>
//     <loc>${siteUrl}/register</loc>
//     <changefreq>monthly</changefreq>
//     <priority>0.3</priority>
//   </url>
//   <url>
//     <loc>${siteUrl}/pricing</loc>
//     <changefreq>weekly</changefreq>
//     <priority>0.7</priority>
//   </url>
// </urlset>`;
    
//     res.status(200).send(fallbackXml);
//   }
// }

import { supabase, config } from '../config.js';

export default async function handler(req, res) {
  const { data } = await supabase.from('products').select('*');
  res.status(200).json({ count: data.length });
}