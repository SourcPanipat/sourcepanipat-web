'use client';

import React from 'react';
import { BaleCategory } from '@/types';

interface CategoryPillBarProps {
  activeCategory: BaleCategory;
  onSelectCategory: (category: BaleCategory) => void;
  totalCount: number;
}

export function CategoryPillBar({
  activeCategory,
  onSelectCategory,
  totalCount,
}: CategoryPillBarProps) {
  const categories: { id: BaleCategory; label: string }[] = [
    { id: 'all', label: `All Bales (${totalCount})` },
    { id: 'korean_heavy_puffers', label: 'Korean Heavy Jackets' },
    { id: 'vintage_denim_workwear', label: 'Vintage Denim & Workwear' },
    { id: 'heavy_fleece_hoodies', label: 'Heavy Fleece & Hoodies' },
    { id: 'curated_handpicked_lots', label: 'Curated Hand-Picked Lots' },
    { id: 'woolen_overcoats_trench', label: 'Woolen Overcoats & Trench' },
    { id: 'mink_fleece_blankets', label: 'Mink & Fleece Blankets' },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0 select-none border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
