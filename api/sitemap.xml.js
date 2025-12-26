import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { data: products } = await supabase.from("products").select("slug");
    const SITE_URL = process.env.SITE_URL || "https://salla-ye.store";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    products.forEach((p) => {
      xml += `
  <url>
    <loc>${SITE_URL}/product/${p.slug}</loc>
    <priority>0.7</priority>
  </url>`;
    });

    xml += "\n</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}
