'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/mock-catalog';
import { Category } from '@/types';
import { 
  LayoutGrid, 
  Layers, 
  Shirt, 
  Scissors, 
  Sparkles, 
  Building, 
  Sun, 
  Heart, 
  Package,
  Flame,
  Shield,
  Tag,
  ChevronRight
} from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedSubCategory?: string;
  onSelectSubCategory?: (subCategoryId: string) => void;
}

export function CategoryGrid({
  selectedCategory,
  onSelectCategory,
  selectedSubCategory = 'all',
  onSelectSubCategory,
}: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  // Fetch live categories from Turso DB API
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch((err) => {
        console.warn('Using seed categories fallback:', err);
      });
  }, []);
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Shirt': return <Shirt className="w-5 h-5" />;
      case 'Scissors': return <Scissors className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Building': return <Building className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const activeCategoryObj = categories.find(
    (c) => c.id === selectedCategory || c.slug === selectedCategory
  );

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3 sm:py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-3">
        
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <LayoutGrid className="w-3.5 h-3.5 text-slate-700" />
            <span>Panipat Wholesale Categories</span>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectSubCategory?.('all');
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              Reset Filters (View All)
            </button>
          )}
        </div>

        {/* Dynamic Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-2.5">
          
          {/* Tile 0: All Bales */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubCategory?.('all');
            }}
            className={`group p-2 sm:p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all min-h-[86px] ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className={`p-2 rounded-full ${selectedCategory === 'all' ? 'bg-slate-800 text-amber-400' : 'bg-white text-slate-700 border border-slate-200 group-hover:border-slate-300'}`}>
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="text-[10.5px] sm:text-[11px] font-semibold leading-tight text-center">
              All Lots
            </span>
          </button>

          {/* Tiles 1-8: Dynamic Master Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubCategory?.('all');
                }}
                className={`group p-2 sm:p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all min-h-[86px] ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-800 text-amber-400' 
                    : 'bg-white text-slate-700 border border-slate-200 group-hover:border-slate-300'
                }`}>
                  {cat.logoUrl ? (
                    <img
                      src={cat.logoUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getIcon(cat.iconName)
                  )}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold line-clamp-2 leading-tight text-center" title={cat.name}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Sub-Category Filter Chips (Rendered when category is active) */}
        {activeCategoryObj && activeCategoryObj.subCategories && activeCategoryObj.subCategories.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <span>Sub-Lots:</span>
              <ChevronRight className="w-3 h-3" />
            </span>

            <button
              onClick={() => onSelectSubCategory?.('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedSubCategory === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              All {activeCategoryObj.name}
            </button>

            {activeCategoryObj.subCategories.map((sub) => {
              const isSubSelected = selectedSubCategory === sub.id || selectedSubCategory === sub.slug;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubCategory?.(sub.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                    isSubSelected
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
