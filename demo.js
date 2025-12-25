import { SitemapBuilder } from './sitemap-builder.js';

// Demo data for testing without database
const demoStores = [
  { id: '1765847875120', store_name: 'متجر الإلكترونيات', updated_at: '2024-12-25', created_at: '2024-12-01' },
  { id: '1765847875121', store_name: 'متجر الملابس', updated_at: '2024-12-24', created_at: '2024-12-02' },
  { id: '1765847875122', store_name: 'متجر الكتب', updated_at: '2024-12-23', created_at: '2024-12-03' }
];

const demoProducts = {
  '1765847875120': [
    { id: 'prod_1', name: 'لابتوب Dell', updated_at: '2024-12-25', created_at: '2024-12-20' },
    { id: 'prod_2', name: 'هاتف iPhone', updated_at: '2024-12-24', created_at: '2024-12-21' }
  ],
  '1765847875121': [
    { id: 'prod_3', name: 'قميص قطني', updated_at: '2024-12-23', created_at: '2024-12-22' },
    { id: 'prod_4', name: 'بنطال جينز', updated_at: '2024-12-22', created_at: '2024-12-23' }
  ]
};

class DemoSitemapBuilder extends SitemapBuilder {
  // Override methods to use demo data
  async getActiveStores() {
    return demoStores;
  }

  async getStoreProducts(storeId) {
    return demoProducts[storeId] || [];
  }
}

async function generateDemoSitemaps() {
  console.log('🎬 Generating Demo Sitemaps...\n');
  
  try {
    const builder = new DemoSitemapBuilder();
    
    // Generate main sitemap
    console.log('1. Generating main sitemap index...');
    const mainSitemap = await builder.generateMainSitemap();
    console.log('✅ Main sitemap generated');
    console.log('Preview:');
    console.log(mainSitemap.substring(0, 500) + '...\n');
    
    // Generate site sitemap
    console.log('2. Generating site sitemap...');
    const siteSitemap = await builder.generateSiteSitemap();
    console.log('✅ Site sitemap generated');
    console.log('Preview:');
    console.log(siteSitemap.substring(0, 500) + '...\n');
    
    // Generate store sitemap
    console.log('3. Generating store sitemap...');
    const storeSitemap = await builder.generateStoreSitemap('1765847875120');
    console.log('✅ Store sitemap generated');
    console.log('Preview:');
    console.log(storeSitemap.substring(0, 500) + '...\n');
    
    console.log('🎉 Demo completed successfully!');
    console.log('\nGenerated sitemaps:');
    console.log('- Main sitemap index (sitemap-main.xml)');
    console.log('- Site sitemap (sitemap.xml)');
    console.log('- Store sitemap (sitemap/store_1765847875120.xml)');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

generateDemoSitemaps();