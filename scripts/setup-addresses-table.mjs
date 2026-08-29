import { createClient } from '@libsql/client';

const tursoUrl = 'libsql://sourcepanipat-sourcpanipat.aws-ap-south-1.turso.io';
const tursoToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc5ODIyOTEsImlkIjoiMDFhMDRjMGMtNTkwMS03NjM5LTkzZWQtZWI2MTA3ZGU0YTY5Iiwia2lkIjoiZDIxY1lJdG9iMmFqSEU0R2ZRdEQyY1VQTXZzai1NcnhyZVBRVHI5WFpZUSIsInJpZCI6ImYzZDNiMzdmLTVlMmItNDlkYi1hMTc3LWQxYzJkN2NlZjNmYSJ9.Emfxh0Aqdcv77_R8j5CTPkKGweNSSt5sscmp08txsppH0dncNbyg87A8EZBgSBRMF8V2gaNoWlZiLMQazyU2DA';

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function setupTables() {
  console.log('Creating buyer_addresses and users tables in Turso if not exists...');

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
    CREATE TABLE IF NOT EXISTS buyer_addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      label TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      landmark TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      transport_preference TEXT DEFAULT 'V-Trans / TCI Freight',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✓ Tables created / verified successfully in Turso DB!');
}

setupTables().catch(console.error);
