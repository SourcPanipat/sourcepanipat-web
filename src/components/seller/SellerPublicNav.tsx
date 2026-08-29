'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Store } from 'lucide-react';

export function SellerPublicNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="bg-slate-100 border-b border-slate-200/80 px-4 py-1 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Panipat Godown Portal:</span>
            <span>Direct access to 8,500+ Pan-India boutique thrift buyers</span>
          </div>
          <Link href="/" className="hover:text-slate-900 font-medium flex items-center gap-1">
            <Store className="w-3 h-3 text-slate-500" />
            <span>Buyer Marketplace</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-40">
            <Image
              src="/logo-horizontal.png"
              alt="SourcePanipat"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/seller/login"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Seller Desk Sign In
          </Link>

          <Link
            href="/seller/register"
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Apply for Godown Verification
          </Link>
        </div>
      </div>
    </header>
  );
}
