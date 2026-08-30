import React from 'react';
import { notFound } from 'next/navigation';
import { getAllSellerSlugs, getSellerBySlug, getBalesBySeller } from '@/lib/mock-catalog';
import { TraderShowcaseClient } from './TraderShowcaseClient';

interface TraderPageProps {
  params: {
    traderHandle: string;
  };
}

export function generateStaticParams() {
  const slugs = getAllSellerSlugs();
  return slugs.map((slug) => ({
    traderHandle: slug,
  }));
}

export default function TraderShowcasePage({ params }: TraderPageProps) {
  const { traderHandle } = params;

  // Disallow collision with reserved routes
  const reservedRoutes = ['seller', 'orders', 'profile', 'bales', 'api', 'auth'];
  if (reservedRoutes.includes(traderHandle.toLowerCase())) {
    notFound();
  }

  const seller = getSellerBySlug(traderHandle);

  if (!seller) {
    notFound();
  }

  const bales = getBalesBySeller(traderHandle);

  return (
    <TraderShowcaseClient
      seller={seller}
      bales={bales}
      traderHandle={traderHandle}
    />
  );
}
