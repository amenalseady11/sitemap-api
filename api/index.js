export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    service: 'Salla Sitemap Generator',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      'Main Sitemap Index': '/sitemap-main.xml',
      'Site Sitemap': '/sitemap.xml',
      'Store Sitemap': '/sitemap/store_{id}.xml',
      'Health Check': '/health'
    },
    documentation: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
    deployment: 'Vercel Serverless Functions'
  });
}