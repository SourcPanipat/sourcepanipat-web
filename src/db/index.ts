import { drizzle } from 'drizzle-orm/libsql';
import { createClient as createLibSQLClient } from '@libsql/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import * as schema from './schema';

// 1. Turso Edge Catalog Client
const tursoUrl = process.env.TURSO_DATABASE_URL || 'file:local-catalog.db';
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN || undefined;

export const libSqlClient = createLibSQLClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

export const db = drizzle(libSqlClient, { schema });

// 2. Supabase Client for Transactions & Auth
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseClient() {
  return supabase;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}
