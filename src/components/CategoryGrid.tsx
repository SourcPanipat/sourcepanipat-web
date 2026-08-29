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

  // Fetch live categories directly from Turso DB or API
  useEffect(() => {
    async function loadLiveCategories() {
      const tursoDbUrl = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL || 'libsql://sourcepanipat-sourcpanipat.aws-ap-south-1.turso.io';
      const tursoToken = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODc5ODIyOTEsImlkIjoiMDFhMDRjMGMtNTkwMS03NjM5LTkzZWQtZWI2MTA3ZGU0YTY5Iiwia2lkIjoiZDIxY1lJdG9iMmFqSEU0R2ZRdEQyY1VQTXZzai1NcnhyZVBRVHI5WFpZUSIsInJpZCI6ImYzZDNiMzdmLTVlMmItNDlkYi1hMTc3LWQxYzJkN2NlZjNmYSJ9.Emfxh0Aqdcv77_R8j5CTPkKGweNSSt5sscmp08txsppH0dncNbyg87A8EZBgSBRMF8V2gaNoWlZiLMQazyU2DA';
      const httpUrl = tursoDbUrl.replace('libsql://', 'https://') + '/v2/pipeline';

      try {
        const res = await fetch(httpUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tursoToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              { type: 'execute', stmt: { sql: 'SELECT id, name, slug, icon_name, logo_url, sort_order, is_active FROM categories WHERE is_active = 1 ORDER BY sort_order ASC' } },
              { type: 'execute', stmt: { sql: 'SELECT id, category_id, name, slug, default_moq, is_active FROM sub_categories WHERE is_active = 1' } },
              { type: 'close' }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const catRows = data.results?.[0]?.response?.result?.rows || [];
          const subRows = data.results?.[1]?.response?.result?.rows || [];

          if (catRows.length > 0) {
            const parsedCats: Category[] = catRows.map((r: any[]) => {
              const catId = String(r[0]?.value || '');
              const subCats = subRows
                .filter((sr: any[]) => String(sr[1]?.value || '') === catId)
                .map((sr: any[]) => ({
                  id: String(sr[0]?.value || ''),
                  categoryId: catId,
                  name: String(sr[2]?.value || ''),
                  slug: String(sr[3]?.value || ''),
                  defaultMoq: Number(sr[4]?.value || 25),
                  isActive: Boolean(sr[5]?.value),
                }));

              return {
                id: catId,
                name: String(r[1]?.value || ''),
                slug: String(r[2]?.value || ''),
                iconName: String(r[3]?.value || 'Layers'),
                logoUrl: r[4]?.value ? String(r[4]?.value) : undefined,
                sortOrder: Number(r[5]?.value || 1),
                isActive: Boolean(r[6]?.value),
                subCategories: subCats,
              };
            });

            setCategories(parsedCats);
            return;
          }
        }
      } catch (e) {
        console.warn('Direct Turso fetch fallback:', e);
      }

      // Fallback to local /api/categories
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.warn('Using seed categories fallback:', err);
      }
    }

    loadLiveCategories();
  }, []);
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-6 h-6 text-current" />;
      case 'Shirt': return <Shirt className="w-6 h-6 text-current" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-current" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-current" />;
      case 'Building': return <Building className="w-6 h-6 text-current" />;
      case 'Sun': return <Sun className="w-6 h-6 text-current" />;
      case 'Heart': return <Heart className="w-6 h-6 text-current" />;
      case 'Package': return <Package className="w-6 h-6 text-current" />;
      case 'Flame': return <Flame className="w-6 h-6 text-current" />;
      case 'Shield': return <Shield className="w-6 h-6 text-current" />;
      default: return <Package className="w-6 h-6 text-current" />;
    }
  };

  const activeCategoryObj = categories.find(
    (c) => c.id === selectedCategory || c.slug === selectedCategory
  );

  return (
    <div className="w-full bg-white border-b border-slate-200 py-3.5 sm:py-4.5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-3.5">
        
        {/* Category Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4 text-slate-800" />
            <span>Panipat Wholesale Categories</span>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectSubCategory?.('all');
              }}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold hover:underline"
            >
              Reset Filters (View All)
            </button>
          )}
        </div>

        {/* Dynamic Category Grid: Borderless circular badges with text below */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3 py-1">
          
          {/* Tile 0: All Bales */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubCategory?.('all');
            }}
            className="group flex flex-col items-center justify-start gap-2 text-center transition-all cursor-pointer focus:outline-none p-1"
          >
            <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 transform group-hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-amber-400 ring-3 ring-slate-900 ring-offset-2 shadow-md'
                : 'bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:bg-slate-200 group-hover:border-slate-300 group-hover:shadow-xs'
            }`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className={`text-[11px] sm:text-[11.5px] leading-tight text-center max-w-[88px] transition-colors ${
              selectedCategory === 'all'
                ? 'font-black text-slate-950'
                : 'font-semibold text-slate-700 group-hover:text-slate-950'
            }`}>
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
                className="group flex flex-col items-center justify-start gap-2 text-center transition-all cursor-pointer focus:outline-none p-1"
              >
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden transition-all duration-200 transform group-hover:scale-105 ${
                  isSelected 
                    ? 'bg-slate-900 text-amber-400 ring-3 ring-slate-900 ring-offset-2 shadow-md' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:bg-slate-200 group-hover:border-slate-300 group-hover:shadow-xs'
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
                <span className={`text-[11px] sm:text-[11.5px] line-clamp-2 leading-tight text-center max-w-[88px] transition-colors ${
                  isSelected
                    ? 'font-black text-slate-950'
                    : 'font-semibold text-slate-700 group-hover:text-slate-950'
                }`} title={cat.name}>
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
