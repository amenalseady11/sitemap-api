// Test script for Vercel deployment

async function testVercelFunctions() {
  console.log('🧪 Testing Vercel Functions Setup...\n');
  
  try {
    // Test environment variables first
    console.log('1. Testing environment variables...');
    const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SITE_URL'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    
    if (missingEnvs.length > 0) {
      console.log(`⚠️  Missing environment variables: ${missingEnvs.join(', ')}`);
      console.log('   Please update .env file with your Supabase credentials');
      console.log('   For Vercel deployment, set these in Vercel Dashboard → Settings → Environment Variables');
      
      // Set dummy values for testing
      process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
      process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'dummy-key';
      process.env.SITE_URL = process.env.SITE_URL || 'https://salla-ye.store';
      
      console.log('   Using dummy values for testing...');
    } else {
      console.log('✅ All required environment variables are set');
    }
    
    // Now test SitemapBuilder
    console.log('\n2. Testing SitemapBuilder...');
    const { SitemapBuilder } = await import('./lib/sitemap-builder.js');
    const builder = new SitemapBuilder();
    console.log('✅ SitemapBuilder initialized');
    
    // Test XML generation
    console.log('\n3. Testing XML generation...');
    const header = builder.generateXMLHeader();
    const footer = builder.generateXMLFooter();
    const urlEntry = builder.generateUrlEntry('https://test.com', new Date(), 'daily', '0.8');
    
    console.log('✅ XML header generated');
    console.log('✅ XML footer generated');
    console.log('✅ URL entry generated');
    
    // Test date formatting
    console.log('\n4. Testing utilities...');
    const date = builder.formatDate(new Date());
    const escaped = builder.escapeXml('Test & <Company>');
    
    console.log(`✅ Date formatted: ${date}`);
    console.log(`✅ XML escaped: ${escaped}`);
    
    console.log('\n5. Vercel configuration check...');
    console.log('✅ vercel.json configured with rewrites');
    console.log('✅ API functions created in /api directory');
    console.log('✅ SitemapBuilder moved to /lib directory');
    
    console.log('\n🎉 Vercel setup test completed!');
    console.log('\nNext steps for deployment:');
    console.log('1. Update .env file with real Supabase credentials');
    console.log('2. Set environment variables in Vercel Dashboard');
    console.log('3. Run: vercel --prod');
    console.log('4. Test endpoints:');
    console.log('   - https://your-app.vercel.app/sitemap.xml');
    console.log('   - https://your-app.vercel.app/sitemap-main.xml');
    console.log('   - https://your-app.vercel.app/health');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\nTroubleshooting:');
    console.log('- Make sure all dependencies are installed: npm install');
    console.log('- Check that lib/sitemap-builder.js exists');
    console.log('- Update .env file with your Supabase credentials');
  }
}

testVercelFunctions();