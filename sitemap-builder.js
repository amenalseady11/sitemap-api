import { supabase, config } from './config.js';

export class SitemapBuilder {
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
      const { data, error } = await supabase
        .from('stores')
        .select('id, store_name, updated_at, created_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  }

  // Get products for a specific store
  async getStoreProducts(storeId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, updated_at, created_at')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching products for store ${storeId}:`, error);
      return [];
    }
  }

  // Generate main sitemap (sitemap index)
  async generateMainSitemap() {
    try {
      const stores = await this.getActiveStores();
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add main site sitemap
      xml += `
  <sitemap>
    <loc>${this.siteUrl}/sitemap.xml</loc>
    <lastmod>${this.formatDate()}</lastmod>
  </sitemap>`;

      // Add store sitemaps
      for (const store of stores) {
        xml += `
  <sitemap>
    <loc>${this.siteUrl}/sitemap/store_${store.id}.xml</loc>
    <lastmod>${this.formatDate(store.updated_at)}</lastmod>
  </sitemap>`;
      }

      xml += '\n</sitemapindex>';
      return xml;
    } catch (error) {
      console.error('Error generating main sitemap:', error);
      throw error;
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

  // Generate store-specific sitemap
  async generateStoreSitemap(storeId) {
    try {
      const products = await this.getStoreProducts(storeId);
      
      let xml = this.generateXMLHeader();

      // Store main page
      xml += this.generateUrlEntry(
        `${this.siteUrl}/store_${storeId}`,
        null,
        config.changefreq.stores,
        config.priority.stores
      );

      // Store products
      for (const product of products) {
        xml += this.generateUrlEntry(
          `${this.siteUrl}/store_${storeId}/${product.id}`,
          product.updated_at,
          config.changefreq.products,
          config.priority.products
        );
      }

      xml += this.generateXMLFooter();
      return xml;
    } catch (error) {
      console.error(`Error generating sitemap for store ${storeId}:`, error);
      throw error;
    }
  }

  // Generate all sitemaps
  async generateAllSitemaps() {
    try {
      console.log('🚀 Starting sitemap generation...');
      
      const results = {
        mainSitemap: await this.generateMainSitemap(),
        siteSitemap: await this.generateSiteSitemap(),
        storeSitemaps: {}
      };

      // Generate individual store sitemaps
      const stores = await this.getActiveStores();
      console.log(`📊 Found ${stores.length} active stores`);

      for (const store of stores) {
        console.log(`📄 Generating sitemap for store: ${store.store_name} (ID: ${store.id})`);
        results.storeSitemaps[store.id] = await this.generateStoreSitemap(store.id);
      }

      console.log('✅ All sitemaps generated successfully');
      return results;
    } catch (error) {
      console.error('❌ Error generating sitemaps:', error);
      throw error;
    }
  }
}