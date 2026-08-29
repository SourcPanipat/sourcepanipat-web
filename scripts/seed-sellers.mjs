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

async function seedSellersAndBales() {
  console.log('Seeding Masked Sellers into Turso...');
  
  const sellers = [
    { id: 'pnp-001', code: '#PNP-001', tier: 'Gold Vetted Importer', zone: 'Sanoli Road Godown Hub', rating: 4.96, bales: 1420, repeat: 96, since: 'Oct 2021' },
    { id: 'pnp-002', code: '#PNP-002', tier: 'Direct Mill Godown', zone: 'Noorwala Industrial Area', rating: 4.88, bales: 980, repeat: 92, since: 'Jan 2022' },
    { id: 'pnp-003', code: '#PNP-003', tier: 'Graded Sorting Hub', zone: 'Barsat Road Sorting Yard', rating: 4.92, bales: 2150, repeat: 95, since: 'Aug 2020' },
    { id: 'pnp-004', code: '#PNP-004', tier: 'Gold Vetted Importer', zone: 'Sanoli Road Godown Hub', rating: 4.94, bales: 860, repeat: 93, since: 'Mar 2023' },
    { id: 'pnp-005', code: '#PNP-005', tier: 'Direct Mill Godown', zone: 'Barsat Road Sorting Yard', rating: 4.85, bales: 640, repeat: 89, since: 'Nov 2023' },
    { id: 'pnp-006', code: '#PNP-006', tier: 'Graded Sorting Hub', zone: 'Noorwala Industrial Area', rating: 4.91, bales: 1120, repeat: 94, since: 'May 2022' },
  ];

  for (const s of sellers) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO sellers (id, masked_code, supplier_tier, godown_zone, rating, total_dispatched_bales, repeat_buyer_rate, is_verified, member_since, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'))`,
      args: [s.id, s.code, s.tier, s.zone, s.rating, s.bales, s.repeat, s.since],
    });
  }

  console.log('✓ Sellers seeded. Total sellers in Turso:', (await client.execute('SELECT COUNT(*) as c FROM sellers')).rows[0].c);
}

seedSellersAndBales().catch(console.error);
