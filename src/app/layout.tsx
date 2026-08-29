import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SourcePanipat | B2B Wholesale Bale & Textile Marketplace',
  description: 'Panipat’s high-trust managed B2B wholesale marketplace for imported winter thrift bales, Korean heavy puffers, vintage USA denim, and blankets with 100% escrow protection.',
  keywords: [
    'Panipat wholesale market',
    'imported winter bales',
    'Korean puffer jackets wholesale',
    'vintage denim thrift bales',
    'B2B textile marketplace India',
    'Panipat godown lot',
    'escrow bale sourcing',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo-icon.png', type: 'image/png' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: 'SourcePanipat | Wholesale Winter Bale Marketplace',
    description: 'Direct Panipat wholesale godown inventory with 10s video grade previews & ₹1,000 Inspection Shield.',
    url: 'https://sourcepanipat.com',
    siteName: 'SourcePanipat',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 800,
        alt: 'SourcePanipat Wholesale Marketplace',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
