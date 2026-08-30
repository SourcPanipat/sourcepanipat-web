'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BaleClientPage } from './bales/[slug]/BaleClientPage';
import { Layers, ArrowLeft } from 'lucide-react';
import { SquareLoader } from '@/components/SquareLoader';

export default function NotFound() {
  const [routeInfo, setRouteInfo] = useState<{
    type: 'bale' | 'category' | 'order' | 'unknown';
    param1?: string;
    param2?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;

      // 1. Dynamic Bale Lot Page: /bales/:slug
      const baleMatch = path.match(/^\/bales\/([^\/]+)/);
      if (baleMatch && baleMatch[1]) {
        setRouteInfo({ type: 'bale', param1: baleMatch[1] });
        return;
      }

      setRouteInfo({ type: 'unknown' });
    }
  }, []);

  // While detecting path on initial client hydration
  if (!routeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <SquareLoader fullScreen={true} />
      </div>
    );
  }


  // Dynamic SPA Handlers
  if (routeInfo.type === 'bale' && routeInfo.param1) {
    return <BaleClientPage slug={routeInfo.param1} />;
  }

  // Universal Clean 404 Fallback
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The lot listing or page you are looking for might have been sold out, moved, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
