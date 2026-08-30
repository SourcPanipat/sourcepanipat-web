import { MOCK_BALES } from '@/lib/mock-catalog';
import { BaleClientPage } from './BaleClientPage';
import { supabase } from '@/lib/supabase-client';

export async function generateStaticParams() {
  const slugs = new Set<string>();

  // 1. Add mock catalog slugs if any
  MOCK_BALES.forEach((b) => {
    if (b.slug) slugs.add(b.slug);
  });

  // 2. Fetch all live slugs from Supabase at build time
  try {
    if (supabase) {
      const { data } = await supabase.from('listings').select('slug');
      (data || []).forEach((row: any) => {
        if (row.slug) slugs.add(row.slug);
      });
    }
  } catch (err) {
    console.warn('generateStaticParams error fetching listings:', err);
  }

  if (slugs.size === 0) {
    slugs.add('sample-lot');
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BaleClientPage slug={params.slug} />;
}
