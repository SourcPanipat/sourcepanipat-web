'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaleListing } from '@/types';
import { ProductCard } from './ProductCard';
import { Package, ArrowUpDown, Sparkles, Loader2, Layers, CheckCircle2 } from 'lucide-react';

interface ProductFeedProps {
  bales: BaleListing[];
  onPreviewVideo: (bale: BaleListing) => void;
  onQuickBuy?: (bale: BaleListing) => void;
}

const INITIAL_BATCH_SIZE = 50;
const INFINITE_STEP_SIZE = 100;

export function ProductFeed({ bales, onPreviewVideo }: ProductFeedProps) {
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'weight'>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [isInfiniteMode, setIsInfiniteMode] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination when incoming bales array changes (e.g. category switch or search)
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
    setIsInfiniteMode(false);
  }, [bales.length]);

  const sortedBales = React.useMemo(() => {
    return [...bales].sort((a, b) => {
      if (sortBy === 'price_low') return a.sealedBalePrice - b.sealedBalePrice;
      if (sortBy === 'price_high') return b.sealedBalePrice - a.sealedBalePrice;
      if (sortBy === 'weight') return b.weightKg - a.weightKg;
      return b.viewCount - a.viewCount;
    });
  }, [bales, sortBy]);

  const displayedBales = sortedBales.slice(0, visibleCount);
  const hasMore = visibleCount < sortedBales.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + INFINITE_STEP_SIZE, sortedBales.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, sortedBales.length]);

  const handleExploreAll = () => {
    setIsInfiniteMode(true);
    handleLoadMore();
  };

  // Infinite Scroll Trigger via Intersection Observer when in Infinite Mode
  useEffect(() => {
    if (!isInfiniteMode || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '400px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isInfiniteMode, hasMore, isLoadingMore, handleLoadMore]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5">
      
      {/* Feed Header & Sort Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>Fresh Godown Lots</span>
            <span className="text-slate-500 font-medium">
              ({displayedBales.length} of {sortedBales.length} Listings)
            </span>
          </h2>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-2xs">
          <ArrowUpDown className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500 font-normal text-[11px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="weight">Bale Weight (KG)</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {sortedBales.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-slate-800">No bales found matching your search</h3>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or category selection to find available godown inventory.
          </p>
        </div>
      ) : (
        <>
          {/* Main 4-Column Product Grid (Responsive: 2 on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
            {displayedBales.map((bale) => (
              <ProductCard
                key={bale.id}
                bale={bale}
                onPreviewVideo={onPreviewVideo}
              />
            ))}
          </div>

          {/* Section 1: Explore All Banner (Shown at the 50th item before infinite scroll unlocks) */}
          {!isInfiniteMode && hasMore && (
            <div className="mt-8 mb-6 p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-white text-center shadow-xl flex flex-col items-center justify-center gap-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[11px] font-mono font-bold tracking-wide uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>Panipat Godown Network • {sortedBales.length}+ Wholesale Lots</span>
              </div>

              <div className="space-y-1 max-w-lg">
                <h3 className="text-base sm:text-xl font-black tracking-tight text-white">
                  Viewing First 50 Vetted Lots
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlock uncut container arrivals, bulk sealed bales, and factory-sorted curated lots directly from Panipat yards.
                </p>
              </div>

              <button
                onClick={handleExploreAll}
                className="mt-2 px-6 sm:px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore All Godown Lots (+100 More)</span>
              </button>
            </div>
          )}

          {/* Section 2: Infinite Sequenced Loader (When Infinite Mode is active) */}
          {isInfiniteMode && (
            <div className="mt-8 mb-6 flex flex-col items-center justify-center gap-3">
              {hasMore ? (
                <>
                  {/* Invisible Sentinel for auto scroll loading */}
                  <div ref={sentinelRef} className="h-6 w-full pointer-events-none" />

                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 border border-slate-700"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Loading Next 100 Godown Lots...</span>
                      </>
                    ) : (
                      <>
                        <span>Load Next 100 Lots (Showing {displayedBales.length} of {sortedBales.length})</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All {sortedBales.length} Godown Lots Loaded</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
