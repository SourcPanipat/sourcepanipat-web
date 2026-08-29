import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
}

const client = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

async function seedBales() {
  console.log('Seeding 10 Bales into Turso...');

  const bales = [
    {
      id: 'bale-001',
      slug: 'korean-heavy-puffer-jackets-grade-a',
      seller_id: 'pnp-001',
      category_id: 'winter-jackets-outerwear',
      sub_category_id: 'heavy-puffers',
      title: 'Korean Heavy Puffer Jackets (Grade A Cream Lot)',
      short_description: 'High-density duck down and poly-fill puffers. Top Korean branded winter outerwear.',
      category: 'winter-jackets-outerwear',
      listing_mode: 'both',
      origin_country: 'South Korea',
      origin_flag: 'KR',
      thumbnail_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      gallery_images: JSON.stringify([
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
      ]),
      weight_kg: 80,
      estimated_piece_count: 72,
      sealed_bale_price: 32000,
      curated_piece_price: 480,
      curated_moq: 25,
      grade_distribution_json: JSON.stringify({ gradeA: 85, gradeB: 12, gradeC: 3 }),
      videos: JSON.stringify([
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      ]),
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
      ]),
      video_grade_urls_json: JSON.stringify([
        { grade: 'Grade A', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', durationSeconds: 30, label: '30s Raw Opening Inspection' }
      ]),
      godown_batch_id: 'BATCH-SANOLI-2026-W09',
      qc_verified: 1,
      in_stock_count: 6,
      view_count: 1420,
      inquiry_count: 48,
      is_hot_deal: 1,
      is_flash_arrival: 1,
      fabric_composition: '100% Nylon Ripstop Outer, Duck Down & Micro-Poly Fill',
      recommended_resale_channel: 'Thrift Boutiques, Flea Markets, Retail Outlets',
      expected_gross_margin: '3.8x - 5.2x Margin',
      tags: JSON.stringify(['Korean Puffers', 'Duck Down', 'Grade A', 'Sanoli Hub']),
    },
    {
      id: 'bale-002',
      slug: 'vintage-heavy-denim-carhartt-workwear',
      seller_id: 'pnp-004',
      category_id: 'jeans-denim-workwear',
      sub_category_id: 'heavy-duck-canvas',
      title: 'Vintage Heavy Denim Jackets & Workwear Duck Canvas',
      short_description: 'USA imported heritage denim jackets, blanket-lined Detroit work jackets and chore coats.',
      category: 'jeans-denim-workwear',
      listing_mode: 'both',
      origin_country: 'United States',
      origin_flag: 'US',
      thumbnail_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      gallery_images: JSON.stringify([
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
      ]),
      weight_kg: 100,
      estimated_piece_count: 95,
      sealed_bale_price: 44000,
      curated_piece_price: 540,
      curated_moq: 25,
      grade_distribution_json: JSON.stringify({ gradeA: 80, gradeB: 18, gradeC: 2 }),
      videos: JSON.stringify([
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
      ]),
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
      ]),
      video_grade_urls_json: JSON.stringify([
        { grade: 'Grade A', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', durationSeconds: 30, label: '30s Raw Opening Inspection' }
      ]),
      godown_batch_id: 'BATCH-SANOLI-2026-W09',
      qc_verified: 1,
      in_stock_count: 4,
      view_count: 2310,
      inquiry_count: 76,
      is_hot_deal: 1,
      is_flash_arrival: 0,
      fabric_composition: '100% Cotton Selvedge Denim & 12oz Duck Canvas',
      recommended_resale_channel: 'Vintage Stores, Streetwear Retailers',
      expected_gross_margin: '4.2x - 6.0x Margin',
      tags: JSON.stringify(['USA Denim', 'Carhartt Style', 'Blanket Lined', 'Heavyweight']),
    }
  ];

  for (const b of bales) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO bales (
        id, slug, seller_id, category_id, sub_category_id, title, short_description, category, listing_mode,
        origin_country, origin_flag, thumbnail_url, gallery_images, weight_kg, estimated_piece_count,
        sealed_bale_price, curated_piece_price, curated_moq, grade_distribution_json, videos, photos,
        video_grade_urls_json, godown_batch_id, qc_verified, in_stock_count, view_count, inquiry_count,
        is_hot_deal, is_flash_arrival, fabric_composition, recommended_resale_channel, expected_gross_margin, tags, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, datetime('now')
      )`,
      args: [
        b.id, b.slug, b.seller_id, b.category_id, b.sub_category_id, b.title, b.short_description, b.category, b.listing_mode,
        b.origin_country, b.origin_flag, b.thumbnail_url, b.gallery_images, b.weight_kg, b.estimated_piece_count,
        b.sealed_bale_price, b.curated_piece_price, b.curated_moq, b.grade_distribution_json, b.videos, b.photos,
        b.video_grade_urls_json, b.godown_batch_id, b.qc_verified, b.in_stock_count, b.view_count, b.inquiry_count,
        b.is_hot_deal, b.is_flash_arrival, b.fabric_composition, b.recommended_resale_channel, b.expected_gross_margin, b.tags
      ],
    });
  }

  console.log('✓ Bales seeded. Total bales in Turso:', (await client.execute('SELECT COUNT(*) as c FROM bales')).rows[0].c);
}

seedBales().catch(console.error);
