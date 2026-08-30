import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sourcepanipat.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/seller/listings/new',
        '/seller/dashboard',
        '/seller/orders',
        '/seller/payouts',
        '/seller/profile',
        '/seller/status',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
