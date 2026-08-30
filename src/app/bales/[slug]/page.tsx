import dynamic from 'next/dynamic';
import { MOCK_BALES } from '@/lib/mock-catalog';

const BaleClientPage = dynamic(() => import('./BaleClientPage'), {
  ssr: false,
});

export async function generateStaticParams() {
  const slugs = MOCK_BALES.map((b) => ({ slug: b.slug }));
  return slugs.length > 0 ? slugs : [{ slug: 'sample-lot' }];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BaleClientPage slug={params.slug} />;
}
