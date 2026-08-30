import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqkbiugtxpnjmkeigdnl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxa2JpdWd0eHBuam1rZWlnZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTUyMTcsImV4cCI6MjEwMzUzMTIxN30.Fy_2E6qi0HA0n3qQohHFXi1X3zFQhzpKI3jj8lUZmpY';

export const browserSupabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = browserSupabase;

export function getBrowserSupabase() {
  return browserSupabase;
}

