import { MOCK_BALES } from '@/lib/mock-catalog';
import { BaleClientPage } from './BaleClientPage';

export function generateStaticParams() {
  if (MOCK_BALES.length === 0) {
    return [{ slug: 'sample-lot' }];
  }
  return MOCK_BALES.map((bale) => ({
    slug: bale.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BaleClientPage slug={params.slug} />;
}
