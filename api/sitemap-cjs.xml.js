const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  siteUrl: process.env.SITE_URL || 'https://salla-ye.store',
  changefreq: {
    homepage: 'daily',
    stores: 'weekly', 
    products: 'daily',
    categories: 'weekly'
  },
  priority: {
    homepage: '1.0',
    stores: '0.8',
    products: '0.6',
    categories: '0.7'
  }
};

// Initialize Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

class SitemapBuilder {
  constructor() {
    this.siteUrl = config.siteUrl;
  }

  // Generate XML header
  generateXMLHeader() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
  }

  // Generate XML footer
  generateXMLFooter() {
    return '</urlset>';
  }

  // Generate URL entry
  generateUrlEntry(url, lastmod = null, changefreq = 'weekly', priority = '0.5') {
    const lastmodStr = lastmod ? `
    <lastmod>${this.formatDate(lastmod)}</lastmod>` : '';
    
    return `
  <url>
    <loc>${this.escapeXml(url)}</loc>${lastmodStr}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  // Format date for sitemap
  formatDate(date) {
    if (!date) return new Date().toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
  }

  // Escape XML characters
  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }

  // Get all active stores
  async getActiveStores() {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized');
        return [];
      }

      const { data, error } = await supabase
        .from('stores')
        .select('id, name, updatedAt, createdAt')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  }

  // Generate site sitemap (main pages)
  async generateSiteSitemap() {
    try {
      let xml = this.generateXMLHeader();

      // Homepage
      xml += this.generateUrlEntry(
        this.siteUrl,
        null,
        config.changefreq.homepage,
        config.priority.homepage
      );

      // Static pages
      const staticPages = [
        { url: '/login', changefreq: 'monthly', priority: '0.3' },
        { url: '/register', changefreq: 'monthly', priority: '0.3' },
        { url: '/pricing', changefreq: 'weekly', priority: '0.7' },
        { url: '/dashboard', changefreq: 'daily', priority: '0.5' }
      ];

      for (const page of staticPages) {
        xml += this.generateUrlEntry(
          `${this.siteUrl}${page.url}`,
          null,
          page.changefreq,
          page.priority
        );
      }

      // Add all store main pages
      const stores = await this.getActiveStores();
      for (const store of stores) {
        xml += this.generateUrlEntry(
          `${this.siteUrl}/store_${store.id}`,
          store.updated_at,
          config.changefreq.stores,
          config.priority.stores
        );
      }

      xml += this.generateXMLFooter();
      return xml;
    } catch (error) {
      console.error('Error generating site sitemap:', error);
      throw error;
    }
  }
}

module.exports = async function handler(req, res) {
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
    const xml = await sitemapBuilder.generateSiteSitemap();
    
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating site sitemap:', error);
    
    // Fallback sitemap
    const siteUrl = process.env.SITE_URL || 'https://salla-ye.store';
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${siteUrl}/register</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${siteUrl}/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    
    res.status(200).send(fallbackXml);
  }
};