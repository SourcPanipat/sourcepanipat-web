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

const url = envVars.TURSO_DATABASE_URL;
const authToken = envVars.TURSO_AUTH_TOKEN;

console.log('Connecting to Turso Database:', url);

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log('1. Creating tables in Turso...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon_name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS sub_categories (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      default_moq INTEGER NOT NULL DEFAULT 25,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS sellers (
      id TEXT PRIMARY KEY,
      masked_code TEXT NOT NULL UNIQUE,
      supplier_tier TEXT NOT NULL,
      godown_zone TEXT NOT NULL,
      rating REAL DEFAULT 4.9,
      total_dispatched_bales INTEGER DEFAULT 0,
      repeat_buyer_rate INTEGER DEFAULT 92,
      is_verified INTEGER DEFAULT 1,
      member_since TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS bales (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      seller_id TEXT NOT NULL REFERENCES sellers(id),
      category_id TEXT REFERENCES categories(id),
      sub_category_id TEXT REFERENCES sub_categories(id),
      title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      category TEXT NOT NULL,
      listing_mode TEXT NOT NULL DEFAULT 'both',
      origin_country TEXT NOT NULL,
      origin_flag TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      gallery_images TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      estimated_piece_count INTEGER NOT NULL,
      sealed_bale_price INTEGER NOT NULL,
      curated_piece_price INTEGER NOT NULL,
      curated_moq INTEGER NOT NULL DEFAULT 25,
      grade_distribution_json TEXT NOT NULL,
      videos TEXT,
      photos TEXT,
      video_grade_urls_json TEXT NOT NULL,
      godown_batch_id TEXT NOT NULL,
      qc_verified INTEGER DEFAULT 1,
      in_stock_count INTEGER NOT NULL DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      inquiry_count INTEGER DEFAULT 0,
      is_hot_deal INTEGER DEFAULT 0,
      is_flash_arrival INTEGER DEFAULT 0,
      fabric_composition TEXT NOT NULL,
      recommended_resale_channel TEXT NOT NULL,
      expected_gross_margin TEXT NOT NULL,
      tags TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      gstin TEXT,
      email TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      address TEXT NOT NULL,
      is_gstin_verified INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      buyer_id TEXT REFERENCES users(id),
      bale_id TEXT NOT NULL REFERENCES bales(id),
      seller_id TEXT NOT NULL REFERENCES sellers(id),
      buy_mode TEXT NOT NULL,
      quantity_bales INTEGER DEFAULT 1,
      curated_piece_count INTEGER DEFAULT 0,
      subtotal INTEGER NOT NULL,
      platform_fee INTEGER NOT NULL DEFAULT 0,
      inspection_shield_selected INTEGER DEFAULT 0,
      inspection_shield_fee INTEGER DEFAULT 0,
      total_amount INTEGER NOT NULL,
      escrow_status TEXT NOT NULL DEFAULT 'ESCROW_LOCKED',
      current_stage_index INTEGER NOT NULL DEFAULT 0,
      shipping_name TEXT NOT NULL,
      shipping_phone TEXT NOT NULL,
      shipping_business_name TEXT NOT NULL,
      shipping_gstin TEXT,
      shipping_city TEXT NOT NULL,
      shipping_state TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      transport_preference TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  console.log('✓ Tables created successfully in Turso.');

  console.log('2. Seeding Categories into Turso...');
  
  const categoriesList = [
    {
      id: 'winter-jackets-outerwear',
      name: 'Winter Jackets & Outerwear',
      slug: 'winter-jackets-outerwear',
      icon_name: 'Layers',
      sort_order: 1,
      subs: [
        { id: 'heavy-puffers', name: 'Korean Heavy Puffers (Grade A)', slug: 'heavy-puffers', moq: 25 },
        { id: 'leather-bombers', name: 'Leather Flight Bombers & Aviators', slug: 'leather-bombers', moq: 20 },
        { id: 'sherpa-truckers', name: 'Sherpa Lined Trucker Jackets', slug: 'sherpa-truckers', moq: 25 },
        { id: 'quilted-vests', name: 'Insulated Quilted Winter Vests', slug: 'quilted-vests', moq: 30 },
      ]
    },
    {
      id: 'fleece-sweatshirts',
      name: 'Fleece & Sweatshirts',
      slug: 'fleece-sweatshirts',
      icon_name: 'Shirt',
      sort_order: 2,
      subs: [
        { id: '450gsm-hoodies', name: '450 GSM Heavyweight Hoodies', slug: '450gsm-hoodies', moq: 30 },
        { id: 'graphic-crewnecks', name: 'Embroidered Graphic Crewnecks', slug: 'graphic-crewnecks', moq: 30 },
        { id: 'track-jackets', name: 'Zipper Track Tops & Warmups', slug: 'track-jackets', moq: 35 },
      ]
    },
    {
      id: 'pants-joggers-cargo',
      name: 'Pants, Joggers & Cargo',
      slug: 'pants-joggers-cargo',
      icon_name: 'Scissors',
      sort_order: 3,
      subs: [
        { id: 'fleece-joggers', name: 'Heavy Fleece Winter Joggers', slug: 'fleece-joggers', moq: 30 },
        { id: 'tactical-cargo', name: 'Multi-Pocket Tactical Cargo Pants', slug: 'tactical-cargo', moq: 25 },
        { id: 'utility-chinos', name: 'Heavy Twill Utility Chinos', slug: 'utility-chinos', moq: 25 },
      ]
    },
    {
      id: 'jeans-denim-workwear',
      name: 'Jeans & Denim Workwear',
      slug: 'jeans-denim-workwear',
      icon_name: 'Sparkles',
      sort_order: 4,
      subs: [
        { id: 'heavy-duck-canvas', name: 'USA Heavy Duck Canvas & Chore Coats', slug: 'heavy-duck-canvas', moq: 25 },
        { id: '90s-baggy-denim', name: 'Vintage 90s Baggy Selvedge Denim', slug: '90s-baggy-denim', moq: 30 },
        { id: 'distressed-workwear', name: 'Distressed Workwear Jackets', slug: 'distressed-workwear', moq: 20 },
      ]
    },
    {
      id: 'overcoats-trench',
      name: 'Overcoats & Trench',
      slug: 'overcoats-trench',
      icon_name: 'Building',
      sort_order: 5,
      subs: [
        { id: 'cashmere-overcoats', name: 'Cashmere & Merino Wool Overcoats', slug: 'cashmere-overcoats', moq: 20 },
        { id: 'wool-trench', name: 'Double-Breasted Wool Trench Coats', slug: 'wool-trench', moq: 20 },
        { id: 'formal-blazers', name: 'Tailored Wool Blazers', slug: 'formal-blazers', moq: 25 },
      ]
    },
    {
      id: 'summer-tees-tops',
      name: 'Summer Tees & Tops',
      slug: 'summer-tees-tops',
      icon_name: 'Sun',
      sort_order: 6,
      subs: [
        { id: '240gsm-graphic-tees', name: 'Heavyweight 240+ GSM Graphic Tees', slug: '240gsm-graphic-tees', moq: 50 },
        { id: 'acid-wash-oversized', name: 'Acid Wash & Mineral Dyed Oversized', slug: 'acid-wash-oversized', moq: 50 },
        { id: 'vintage-polos', name: 'Vintage Knit & Striped Polos', slug: 'vintage-polos', moq: 40 },
      ]
    },
    {
      id: 'womens-thrift-y2k',
      name: "Women's Thrift & Y2K",
      slug: 'womens-thrift-y2k',
      icon_name: 'Heart',
      sort_order: 7,
      subs: [
        { id: 'chunky-cardigans', name: 'Chunky Pastel Cardigans & Knits', slug: 'chunky-cardigans', moq: 30 },
        { id: 'cropped-sweats', name: 'Cropped Fleece Sweats & Hoodies', slug: 'cropped-sweats', moq: 30 },
        { id: 'y2k-tops', name: 'Y2K Mesh & Fitted Knit Tops', slug: 'y2k-tops', moq: 40 },
      ]
    },
    {
      id: 'home-furnishings-mink',
      name: 'Home Furnishings & Mink',
      slug: 'home-furnishings-mink',
      icon_name: 'Package',
      sort_order: 8,
      subs: [
        { id: 'mink-blankets', name: 'Double-Ply Embossed Heavy Mink Blankets', slug: 'mink-blankets', moq: 15 },
        { id: 'polar-fleece-throws', name: 'Polar Fleece Winter Throws', slug: 'polar-fleece-throws', moq: 30 },
        { id: 'panipat-dhurries', name: 'Panipat Cotton & Woolen Floor Rugs', slug: 'panipat-dhurries', moq: 25 },
      ]
    },
  ];

  for (const cat of categoriesList) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO categories (id, name, slug, icon_name, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      args: [cat.id, cat.name, cat.slug, cat.icon_name, cat.sort_order],
    });

    for (const sub of cat.subs) {
      await client.execute({
        sql: `INSERT OR REPLACE INTO sub_categories (id, category_id, name, slug, default_moq, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
        args: [sub.id, cat.id, sub.name, sub.slug, sub.moq],
      });
    }
  }

  console.log('✓ Seeding complete! Verifying Turso rows...');
  const catCount = await client.execute('SELECT COUNT(*) as count FROM categories');
  const subCount = await client.execute('SELECT COUNT(*) as count FROM sub_categories');
  console.log('Turso Live Categories count:', catCount.rows[0].count);
  console.log('Turso Live Sub-Categories count:', subCount.rows[0].count);
}

main().catch(console.error);
