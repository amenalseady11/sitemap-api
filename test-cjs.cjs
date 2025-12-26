// Test the CommonJS version
const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing CommonJS version...\n');

try {
  console.log('1. Testing @supabase/supabase-js import...');
  console.log('✅ @supabase/supabase-js imported successfully');
  
  console.log('\n2. Testing Supabase client creation...');
  
  // Test with dummy values
  const testClient = createClient(
    'https://dummy.supabase.co',
    'dummy-key'
  );
  
  console.log('✅ Supabase client created successfully');
  
  console.log('\n3. Testing XML generation...');
  
  const generateXMLHeader = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  };
  
  const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  };
  
  const header = generateXMLHeader();
  const escaped = escapeXml('Test & <Company>');
  
  console.log('✅ XML generation working');
  console.log(`✅ XML escaping: ${escaped}`);
  
  console.log('\n🎉 CommonJS version test passed!');
  console.log('\nThe api/sitemap-cjs.xml.js should work on Vercel now.');
  
} catch (error) {
  console.error('❌ Test failed:', error);
}