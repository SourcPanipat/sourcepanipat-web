'use client';

import React, { useState, useEffect, useMemo } from 'react';

import { Header } from '@/components/Header';
import { CategoryGrid } from '@/components/CategoryGrid';
import { TrustStatsBanner } from '@/components/TrustStatsBanner';
import { ProductFeed } from '@/components/ProductFeed';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { Footer } from '@/components/Footer';
import { MOCK_BALES, searchBales } from '@/lib/mock-catalog';
import { getApprovedMarketplaceListings } from '@/lib/supabase-db';
import { BaleListing } from '@/types';
import { ShieldCheck, Lock, Scale, Building } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [dbBales, setDbBales] = useState<BaleListing[]>([]);
  
  // Modals & Drawers
  const [selectedVideoBale, setSelectedVideoBale] = useState<BaleListing | null>(null);
  const [checkoutBale, setCheckoutBale] = useState<BaleListing | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Fetch approved listings from Supabase on mount and on category change
  useEffect(() => {
    async function loadLiveBales() {
      try {
        const live = await getApprovedMarketplaceListings(
          activeCategory !== 'all' ? activeCategory : undefined,
          activeSubCategory !== 'all' ? activeSubCategory : undefined
        );
        setDbBales(live);
      } catch (e) {
        console.warn('Error fetching live marketplace bales from Supabase:', e);
      }
    }

    loadLiveBales();
  }, [activeCategory, activeSubCategory]);

  // Dynamic Filtering by Search Query
  const filteredBales = useMemo(() => {
    const source = dbBales.length > 0 ? dbBales : searchBales(searchQuery, activeCategory, activeSubCategory);
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter((bale) =>
      bale.title?.toLowerCase().includes(q) ||
      bale.shortDescription?.toLowerCase().includes(q) ||
      bale.originCountry?.toLowerCase().includes(q) ||
      bale.seller?.maskedCode?.toLowerCase().includes(q)
    );
  }, [dbBales, searchQuery, activeCategory, activeSubCategory]);


  const handleOpenVideoPreview = (bale: BaleListing) => {
    setSelectedVideoBale(bale);
  };

  const handleQuickBuy = (bale: BaleListing) => {
    setCheckoutBale(bale);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Header (OLX Standard) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={checkoutBale ? 1 : 0}
        onOpenCart={() => {
          if (checkoutBale) {
            setIsCheckoutOpen(true);
          } else {
            setCheckoutBale(MOCK_BALES[0]);
            setIsCheckoutOpen(true);
          }
        }}
      />

      {/* 2. Dynamic Panipat Category Grid (Admin-Managed Schema Tree) */}
      <CategoryGrid
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedSubCategory={activeSubCategory}
        onSelectSubCategory={setActiveSubCategory}
      />

      {/* 3. Slim Trust Highlights Bar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <Building className="w-3.5 h-3.5 text-slate-700" />
              Panipat Godown Wholesale
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ₹1,000 Inspection Shield
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              Bulk Sealed Bales & Curated Lots (MOQ 25)
            </span>
            <span className="flex items-center gap-1.5 text-blue-900">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              100% Nodal Escrow Hold
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500">
            <span>Direct Sourcing from Panipat Hubs: Sanoli Rd • Noorwala • Barsat Rd</span>
          </div>
        </div>
      </div>

      {/* 4. Main Product Feed (Clean 4-Column Grid with 8+ Visible Listings) */}
      <main className="flex-1">
        <ProductFeed
          bales={filteredBales}
          onPreviewVideo={handleOpenVideoPreview}
          onQuickBuy={handleQuickBuy}
        />
      </main>

      {/* 5. Trust Pillars Banner */}
      <TrustStatsBanner />

      {/* 6. 30s Video Grade Preview Modal */}
      <VideoGradeModal
        bale={selectedVideoBale}
        onClose={() => setSelectedVideoBale(null)}
        onProceedToEscrow={(bale) => {
          setSelectedVideoBale(null);
          setCheckoutBale(bale);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 7. Escrow Checkout Drawer */}
      <EscrowCheckoutDrawer
        bale={checkoutBale}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 8. Global Footer */}
      <Footer />
    </div>
  );
}
