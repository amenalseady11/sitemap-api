export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Salla Sitemap Generator',
    deployment: 'Vercel',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: {
      node_version: process.version,
      platform: process.platform
    }
  });
}