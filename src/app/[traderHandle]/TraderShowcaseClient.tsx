'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { MaskedSeller, BaleListing } from '@/types';
import { getFormattedSellerName } from '@/lib/format-seller';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Share2, 
  Check, 
  MessageCircle, 
  Building2, 
  Package, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

interface TraderShowcaseClientProps {
  seller: MaskedSeller;
  bales: BaleListing[];
  traderHandle: string;
}

export function TraderShowcaseClient({
  seller,
  bales,
  traderHandle,
}: TraderShowcaseClientProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedVideoBale, setSelectedVideoBale] = useState<BaleListing | null>(null);
  const [checkoutBale, setCheckoutBale] = useState<BaleListing | null>(null);

  const formattedName = getFormattedSellerName(seller.fullName, seller.maskedCode);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${traderHandle}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Filter categories from trader's available bales
  const availableCategories = Array.from(
    new Set(bales.map((b) => b.categoryLabel).filter(Boolean))
  );

  const filteredBales = bales.filter((bale) => {
    if (selectedCategory !== 'all' && bale.categoryLabel !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        bale.title.toLowerCase().includes(q) ||
        bale.shortDescription.toLowerCase().includes(q) ||
        bale.garmentType?.toLowerCase().includes(q) ||
        bale.primaryFabric?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-400">Panipat Godowns</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{formattedName}</span>
        </div>

        {/* Trader Showcase Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          
          {/* Subtle Accent Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Left: Avatar & Identity */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-amber-400 font-black text-lg sm:text-xl flex items-center justify-center border-2 border-slate-800 shrink-0 shadow-md">
                {seller.maskedCode || '#PNP-001'}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {formattedName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Escrow Protected
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{seller.supplierTier}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{seller.godownZone}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{seller.rating} Rating ({seller.totalDispatchedBales}+ Bales Dispatched)</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed pt-0.5">
                  Direct godown pricing with zero middleman markup. All lots weighed on certified Panipat digital tare scales with 30s opening inspection video audit.
                </p>
              </div>
            </div>

            {/* Right: Instagram/Bio Sharing Action & Ground Desk CTA */}
            <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              
              {/* One-Click Copy Bio Link */}
              <button
                onClick={handleCopyLink}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Catalog Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Storefront Link for Bio</span>
                  </>
                )}
              </button>

              {/* Ground Desk Direct WhatsApp */}
              <a
                href={`https://wa.me/918950202286?text=${encodeURIComponent(
                  `Hi SourcePanipat Desk, I am viewing the live catalog for ${formattedName} (Storefront: /${traderHandle}). I want to inquire about availability and ground delivery: `
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inquire with Ground Desk</span>
              </a>

            </div>

          </div>

          {/* Guarantee Sub-bar */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Verified Trader Code:</span>
              <code className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-bold font-mono">
                {seller.maskedCode}
              </code>
              <span className="text-slate-400">|</span>
              <span>Repeat Buyer Rate: <strong className="text-emerald-700">{seller.repeatBuyerRate}%</strong></span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Public Share URL:</span>
              <span className="font-mono text-slate-700 font-medium">sourcepanipat.com/{traderHandle}</span>
            </div>
          </div>

        </div>

        {/* Inventory Header & Category Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-700" />
                <span>Live Yard Inventory ({filteredBales.length} Lots Available)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ready for immediate Panipat godown gate dispatch and transport booking
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trader lots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Chips */}
          {availableCategories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Lots ({bales.length})
              </button>

              {availableCategories.map((cat) => {
                const count = bales.filter((b) => b.categoryLabel === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {filteredBales.map((bale) => (
            <ProductCard
              key={bale.id}
              bale={bale}
              onPreviewVideo={(b) => setSelectedVideoBale(b)}
              onQuickBuy={(b) => setCheckoutBale(b)}
            />
          ))}
        </div>

        {filteredBales.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-800 text-sm">No matching lots found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              This seller currently has no live inventory matching your filter. Try clearing filters or contacting the Panipat Ground Desk.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}

      </main>

      {/* Global Modals */}
      {selectedVideoBale && (
        <VideoGradeModal
          bale={selectedVideoBale}
          onClose={() => setSelectedVideoBale(null)}
          onProceedToEscrow={() => {
            setCheckoutBale(selectedVideoBale);
            setSelectedVideoBale(null);
          }}
        />
      )}

      {checkoutBale && (
        <EscrowCheckoutDrawer
          isOpen={Boolean(checkoutBale)}
          onClose={() => setCheckoutBale(null)}
          bale={checkoutBale}
        />
      )}

      <Footer />
    </div>
  );
}
