import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getCategoryBySlug, getBalesByCategorySlug } from '@/lib/mock-catalog';
import { CategoryPageClient } from '../CategoryPageClient';

interface SubCategoryPageProps {
  params: {
    categorySlug: string;
    subSlug: string;
  };
}

export function generateStaticParams() {
  const params: { categorySlug: string; subSlug: string }[] = [];
  CATEGORIES.forEach((cat) => {
    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategories.forEach((sub) => {
        params.push({
          categorySlug: cat.slug,
          subSlug: sub.slug,
        });
      });
    }
  });
  return params;
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.categorySlug);
  const subCategory = category?.subCategories?.find(
    (s) => s.slug === params.subSlug || s.id === params.subSlug
  );

  if (!category || !subCategory) {
    return {
      title: 'Wholesale Bales & Lots | SourcePanipat Godown Portal',
      description: 'Panipat B2B wholesale marketplace for bulk bales and curated lots.',
    };
  }

  const title = `${subCategory.name} Wholesale Lots & Bales | ${category.name} | Panipat Yard`;
  const description = `Source verified ${subCategory.name} directly from Panipat godowns. 100% Escrow protected, digital tare weight verification, and 30s unboxing inspection clips.`;

  return {
    title,
    description,
    keywords: [
      `${subCategory.name} wholesale`,
      `${subCategory.name} panipat`,
      `${category.name} bulk lots`,
      'sourcepanipat godown',
    ],
    openGraph: {
      title: `${subCategory.name} B2B Wholesale - SourcePanipat`,
      description,
      type: 'website',
      url: `https://sourcepanipat.com/category/${category.slug}/${subCategory.slug}`,
    },
    alternates: {
      canonical: `https://sourcepanipat.com/category/${category.slug}/${subCategory.slug}`,
    },
  };
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { categorySlug, subSlug } = params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const subCategory = category.subCategories?.find(
    (s) => s.slug === subSlug || s.id === subSlug
  );

  if (!subCategory) {
    notFound();
  }

  const bales = getBalesByCategorySlug(categorySlug, subCategory.id);

  return (
    <CategoryPageClient
      category={category}
      bales={bales}
      activeSubCategory={subCategory.id}
    />
  );
}
