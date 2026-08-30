import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategorySlugs, getCategoryBySlug, getBalesByCategorySlug } from '@/lib/mock-catalog';
import { CategoryPageClient } from './CategoryPageClient';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
}

export function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((categorySlug) => ({
    categorySlug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.categorySlug);

  if (!category) {
    return {
      title: 'Wholesale Bales & Lots | SourcePanipat Godown Portal',
      description: 'Panipat B2B wholesale marketplace for bulk bales and curated lots.',
    };
  }

  const title = `${category.name} Wholesale Lots & Sealed Bales | Panipat Godown Yard`;
  const description = `Buy verified ${category.name} in bulk directly from Panipat godowns. 100% Escrow & Tare Weight protected, 30s opening video clips, direct gate transport dispatch.`;

  return {
    title,
    description,
    keywords: [
      `${category.name} wholesale`,
      `${category.name} panipat`,
      `${category.name} sealed bales`,
      'panipat textile godown',
      'b2b vintage thrift wholesale',
      'sourcepanipat',
    ],
    openGraph: {
      title: `${category.name} B2B Wholesale Yard - SourcePanipat`,
      description,
      type: 'website',
      url: `https://sourcepanipat.com/category/${category.slug}`,
    },
    alternates: {
      canonical: `https://sourcepanipat.com/category/${category.slug}`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const bales = getBalesByCategorySlug(categorySlug);

  return (
    <CategoryPageClient
      category={category}
      bales={bales}
      activeSubCategory="all"
    />
  );
}
