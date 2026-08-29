import { OrderClientPage } from './OrderClientPage';

export function generateStaticParams() {
  return [
    { id: 'ORD-782190' },
    { id: 'ORD-782191' },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <OrderClientPage id={params.id} />;
}
