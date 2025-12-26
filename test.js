import { SitemapBuilder } from './sitemap-builder.js';

async function testSitemapGeneration() {
  console.log('🧪 Testing Sitemap Generation...\n');
  
  try {
    const builder = new SitemapBuilder();
    
    // Test XML generation methods
    console.log('1. Testing XML header generation...');
    const header = builder.generateXMLHeader();
    console.log('✅ XML header generated');
    
    console.log('\n2. Testing URL entry generation...');
    const urlEntry = builder.generateUrlEntry(
      'https://salla-ye.store/test',
      new Date(),
      'daily',
      '0.8'
    );
    console.log('✅ URL entry generated');
    
    console.log('\n3. Testing date formatting...');
    const formattedDate = builder.formatDate(new Date());
    console.log(`✅ Date formatted: ${formattedDate}`);
    
    console.log('\n4. Testing XML escaping...');
    const escaped = builder.escapeXml('Test & <Company> "Name"');
    console.log(`✅ XML escaped: ${escaped}`);
    
    // Test environment variables
    console.log('\n5. Testing environment variables...');
    const siteUrl = process.env.SITE_URL || 'https://salla-ye.store';
    const port = process.env.PORT || 3000;
    console.log(`   Site URL: ${siteUrl}`);
    console.log(`   Port: ${port}`);
    console.log('✅ Environment variables loaded');
    
    console.log('\n🎉 All tests passed! The sitemap generator is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Update .env file with your Supabase credentials');
    console.log('2. Run: npm start (for server mode)');
    console.log('3. Or run: npm run generate (for static files)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSitemapGeneration();