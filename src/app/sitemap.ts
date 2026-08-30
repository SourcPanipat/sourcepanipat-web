import { MetadataRoute } from 'next';
import { CATEGORIES, MOCK_BALES, getAllSellerSlugs } from '@/lib/mock-catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sourcepanipat.com';

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seller/register`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seller/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Dynamic Categories & Subcategories
  const categoryUrls: MetadataRoute.Sitemap = [];
  CATEGORIES.forEach((cat) => {
    categoryUrls.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategories.forEach((sub) => {
        categoryUrls.push({
          url: `${baseUrl}/category/${cat.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.85,
        });
      });
    }
  });

  // 3. Dynamic Lots / Bales
  const baleUrls: MetadataRoute.Sitemap = MOCK_BALES.map((bale) => ({
    url: `${baseUrl}/bales/${bale.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  // 4. Dynamic Trader Storefronts
  const sellerSlugs = getAllSellerSlugs();
  const sellerUrls: MetadataRoute.Sitemap = sellerSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryUrls, ...baleUrls, ...sellerUrls];
}
