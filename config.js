import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Site configuration
export const config = {
  siteUrl: process.env.SITE_URL || 'https://salla-ye.store',
  port: process.env.PORT || 3000,
  
  // Sitemap settings
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

// Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Validate configuration
export function validateConfig() {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Configuration validated successfully');
  return true;
}