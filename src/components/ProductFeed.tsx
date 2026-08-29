'use client';

import React, { useState } from 'react';
import { BaleListing } from '@/types';
import { ProductCard } from './ProductCard';
import { Package, ArrowUpDown } from 'lucide-react';

interface ProductFeedProps {
  bales: BaleListing[];
  onPreviewVideo: (bale: BaleListing) => void;
  onQuickBuy?: (bale: BaleListing) => void;
}

export function ProductFeed({ bales, onPreviewVideo }: ProductFeedProps) {
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'weight'>('recommended');

  const sortedBales = [...bales].sort((a, b) => {
    if (sortBy === 'price_low') return a.sealedBalePrice - b.sealedBalePrice;
    if (sortBy === 'price_high') return b.sealedBalePrice - a.sealedBalePrice;
    if (sortBy === 'weight') return b.weightKg - a.weightKg;
    return b.viewCount - a.viewCount;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5">
      {/* Feed Controls */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
            Fresh Godown Lots ({bales.length} Listings)
          </h2>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700">
          <ArrowUpDown className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500 font-normal text-[11px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs text-slate-900 font-medium focus:outline-none cursor-pointer"
          >
            <option value="recommended">Recommended</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="weight">Bale Weight (KG)</option>
          </select>
        </div>
      </div>

      {/* 4-Column Grid (4 per row x 2 rows = 8 listings visible on laptop/desktop) */}
      {sortedBales.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-lg border border-slate-200 p-6">
          <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-slate-800">No bales found matching your search</h3>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or category selection to find available godown inventory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
          {sortedBales.map((bale) => (
            <ProductCard
              key={bale.id}
              bale={bale}
              onPreviewVideo={onPreviewVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
