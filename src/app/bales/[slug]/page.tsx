import dynamic from 'next/dynamic';
import { MOCK_BALES } from '@/lib/mock-catalog';
import { turso } from '@/lib/turso';

const BaleClientPage = dynamic(() => import('./BaleClientPage'), {
  ssr: false,
});

export async function generateStaticParams() {
  try {
    const res = await turso.execute("SELECT slug FROM listings WHERE status = 'approved';");
    const dbSlugs = res.rows.map(r => ({ slug: String(r.slug) }));
    const mockSlugs = MOCK_BALES.map((b) => ({ slug: b.slug }));
    const all = [...mockSlugs, ...dbSlugs];
    const unique = Array.from(new Set(all.map(s => s.slug))).map(slug => ({ slug }));
    return unique.length > 0 ? unique : [{ slug: 'sample-lot' }];
  } catch (e) {
    const slugs = MOCK_BALES.map((b) => ({ slug: b.slug }));
    return slugs.length > 0 ? slugs : [{ slug: 'sample-lot' }];
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BaleClientPage slug={params.slug} />;
}
