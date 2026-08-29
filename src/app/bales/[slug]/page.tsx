import { MOCK_BALES } from '@/lib/mock-catalog';
import { BaleClientPage } from './BaleClientPage';

export function generateStaticParams() {
  return MOCK_BALES.map((bale) => ({
    slug: bale.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BaleClientPage slug={params.slug} />;
}
