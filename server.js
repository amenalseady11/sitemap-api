import express from 'express';
import { SitemapBuilder } from './sitemap-builder.js';
import { config, validateConfig } from './config.js';

const app = express();
const sitemapBuilder = new SitemapBuilder();

// Middleware
app.use(express.json());

// Set proper headers for XML responses
app.use((req, res, next) => {
  if (req.path.includes('sitemap') || req.path.endsWith('.xml')) {
    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    });
  }
  next();
});

// Routes

// Main sitemap index
app.get('/sitemap-main.xml', async (req, res) => {
  try {
    const xml = await sitemapBuilder.generateMainSitemap();
    res.send(xml);
  } catch (error) {
    console.error('Error serving main sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Site sitemap (main pages)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const xml = await sitemapBuilder.generateSiteSitemap();
    res.send(xml);
  } catch (error) {
    console.error('Error serving site sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Store-specific sitemap
app.get('/sitemap/store_:storeId.xml', async (req, res) => {
  try {
    const { storeId } = req.params;
    const xml = await sitemapBuilder.generateStoreSitemap(storeId);
    res.send(xml);
  } catch (error) {
    console.error(`Error serving sitemap for store ${req.params.storeId}:`, error);
    res.status(500).send('Error generating sitemap');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Salla Sitemap Generator'
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    service: 'Salla Sitemap Generator',
    version: '1.0.0',
    endpoints: {
      'Main Sitemap Index': '/sitemap-main.xml',
      'Site Sitemap': '/sitemap.xml',
      'Store Sitemap': '/sitemap/store_{id}.xml',
      'Health Check': '/health'
    },
    documentation: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap'
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.path} not found`
  });
});

// Start server
async function startServer() {
  try {
    // Validate configuration
    validateConfig();
    
    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Sitemap Generator Server running on port ${config.port}`);
      console.log(`📍 Main sitemap: http://localhost:${config.port}/sitemap-main.xml`);
      console.log(`📍 Site sitemap: http://localhost:${config.port}/sitemap.xml`);
      console.log(`📍 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();