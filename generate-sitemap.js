import fs from 'fs/promises';
import path from 'path';
import { SitemapBuilder } from './sitemap-builder.js';

async function generateSitemapFiles() {
  try {
    console.log('🚀 Starting sitemap file generation...');
    
    // Validate environment variables
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
      console.log('Please set these environment variables before generating sitemaps');
      process.exit(1);
    }
    
    console.log('✅ Environment variables validated');
    
    // Create output directory
    const outputDir = './output';
    await fs.mkdir(outputDir, { recursive: true });
    
    // Initialize sitemap builder
    const sitemapBuilder = new SitemapBuilder();
    
    // Generate all sitemaps
    const sitemaps = await sitemapBuilder.generateAllSitemaps();
    
    // Write main sitemap index
    await fs.writeFile(
      path.join(outputDir, 'sitemap-main.xml'),
      sitemaps.mainSitemap,
      'utf8'
    );
    console.log('✅ Generated: sitemap-main.xml');
    
    // Write site sitemap
    await fs.writeFile(
      path.join(outputDir, 'sitemap.xml'),
      sitemaps.siteSitemap,
      'utf8'
    );
    console.log('✅ Generated: sitemap.xml');
    
    // Write store sitemaps
    for (const [storeId, xml] of Object.entries(sitemaps.storeSitemaps)) {
      await fs.writeFile(
        path.join(outputDir, `sitemap-store-${storeId}.xml`),
        xml,
        'utf8'
      );
      console.log(`✅ Generated: sitemap-store-${storeId}.xml`);
    }
    
    // Generate summary
    const summary = {
      generated_at: new Date().toISOString(),
      files: {
        main_sitemap: 'sitemap-main.xml',
        site_sitemap: 'sitemap.xml',
        store_sitemaps: Object.keys(sitemaps.storeSitemaps).map(id => `sitemap-store-${id}.xml`)
      },
      total_files: 2 + Object.keys(sitemaps.storeSitemaps).length,
      total_stores: Object.keys(sitemaps.storeSitemaps).length
    };
    
    await fs.writeFile(
      path.join(outputDir, 'generation-summary.json'),
      JSON.stringify(summary, null, 2),
      'utf8'
    );
    
    console.log('\n📊 Generation Summary:');
    console.log(`   📁 Output directory: ${outputDir}`);
    console.log(`   📄 Total files: ${summary.total_files}`);
    console.log(`   🏪 Total stores: ${summary.total_stores}`);
    console.log(`   ⏰ Generated at: ${summary.generated_at}`);
    console.log('\n🎉 All sitemap files generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating sitemap files:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemapFiles();
}

export { generateSitemapFiles };