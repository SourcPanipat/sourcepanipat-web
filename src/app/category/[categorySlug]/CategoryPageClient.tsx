'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { Category, BaleListing } from '@/types';
import { 
  Layers, 
  ShieldCheck, 
  Package, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Filter, 
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';

interface CategoryPageClientProps {
  category: Category;
  bales: BaleListing[];
  activeSubCategory?: string;
}

export function CategoryPageClient({
  category,
  bales,
  activeSubCategory = 'all',
}: CategoryPageClientProps) {
  const [selectedSub, setSelectedSub] = useState<string>(activeSubCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [selectedVideoBale, setSelectedVideoBale] = useState<BaleListing | null>(null);
  const [checkoutBale, setCheckoutBale] = useState<BaleListing | null>(null);

  const subCategories = category.subCategories || [];

  const filteredBales = bales.filter((bale) => {
    if (selectedSub !== 'all' && bale.subCategoryId !== selectedSub) {
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
          <span className="text-slate-400">Wholesale Categories</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{category.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-300/60 font-bold flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {category.name} Wholesale Lots & Sealed Bales
                </h1>
              </div>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-0.5">
                Direct Panipat Godown Gate Sourcing. Audited Grade A/B lots with digital tare weighment verification and 30s opening inspection video clips.
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Escrow & Tare Weight Protected
                </span>
                <span>•</span>
                <span><strong>{filteredBales.length}</strong> Live Lots Available</span>
                <span>•</span>
                <span>Panipat Yard Gate Dispatch</span>
              </div>
            </div>

            {/* Sourcing Desk Support Quick Contact */}
            <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <a
                href={`https://wa.me/918950202286?text=${encodeURIComponent(
                  `Hi SourcePanipat Ground Desk, I am sourcing ${category.name} wholesale lots. Please share latest container arrivals and lot availability: `
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>Inquire Category Lots on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>

          </div>

        </div>

        {/* Subcategories Filter Bar & Search */}
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-700" />
              <span>Available {category.name} Inventory ({filteredBales.length})</span>
            </h2>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search within category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Subcategory Pills */}
          {subCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedSub('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedSub === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Sub-Types ({bales.length})
              </button>

              {subCategories.map((sub) => {
                const count = bales.filter((b) => b.subCategoryId === sub.id).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      selectedSub === sub.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{sub.name}</span>
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
            <div className="font-bold text-slate-800 text-sm">No lots currently available</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No live bales match your subcategory filter right now. New container lots arrive daily at Panipat sorting yards.
            </p>
            <button
              onClick={() => { setSelectedSub('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              Show All {category.name}
            </button>
          </div>
        )}

        {/* SEO Ground Text Guide Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3 text-xs text-slate-600 leading-relaxed mt-8">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Info className="w-4 h-4 text-slate-700" />
            <span>Panipat B2B Sourcing Guide: {category.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900">Direct Godown Pricing</div>
              <p className="text-[11px] text-slate-500">
                Source directly from verified importers and mill godowns at Sanoli Road, Noorwala, and Barsat Road clusters. Zero intermediate broker commissions.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900">Tare Weight Guarantee</div>
              <p className="text-[11px] text-slate-500">
                Every bale is weighed on digital scales prior to truck dispatch. If delivered weight deviates by &gt;1.5%, differential amount is auto-refunded to buyer escrow wallet.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900">Pan-India Freight Logistics</div>
              <p className="text-[11px] text-slate-500">
                Direct transport tie-ups with V-Trans, TCI Freight, and ARC for door delivery across Delhi NCR, Mumbai, Bangalore, Kolkata, and tier-2 thrift hubs.
              </p>
            </div>
          </div>
        </div>

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
