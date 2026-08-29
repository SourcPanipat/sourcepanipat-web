'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BaleListing } from '@/types';
import { formatINR } from '@/lib/utils';
import { Play, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  bale: BaleListing;
  onPreviewVideo: (bale: BaleListing) => void;
  onQuickBuy?: (bale: BaleListing) => void;
}

export function ProductCard({ bale, onPreviewVideo }: ProductCardProps) {
  const avgPiecePrice = bale?.estimatedPieceCount ? Math.round(bale.sealedBalePrice / bale.estimatedPieceCount) : 0;
  const primaryGrade = (bale?.gradeBreakdown?.gradeA && bale.gradeBreakdown.gradeA >= 80) ? 'Grade A' : 'Grade A/B';

  return (
    <Link
      href={`/bales/${bale.slug}`}
      className="group flex flex-col bg-white rounded-md border border-slate-200 hover:border-slate-400 transition-all duration-150 hover:shadow-xs overflow-hidden text-left"
    >
      {/* 1. Image Container (1:1 Square Aspect Ratio) */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <Image
          src={bale.thumbnailUrl}
          alt={bale.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-102 transition-transform duration-200"
        />

        {/* Minimal Weight & Sourcing Mode Pill (Top Left) */}
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-white/95 text-slate-800 text-[10px] font-semibold shadow-xs border border-slate-200/80">
            {bale.weightKg} KG
          </span>
          {bale.sourcingMode === 'pieces_only' && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9.5px] font-bold shadow-xs">
              Pieces Only
            </span>
          )}
          {bale.sourcingMode === 'bale_only' && (
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9.5px] font-bold shadow-xs">
              Bale Only
            </span>
          )}
        </div>

        {/* Minimal 30s Video Button (Bottom Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreviewVideo(bale);
          }}
          className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] font-medium backdrop-blur-xs transition-colors shadow-xs active:scale-95"
        >
          <Play className="w-2 h-2 fill-current" />
          <span>30s Godown Video</span>
        </button>
      </div>

      {/* 2. Compact 4-Line Card Body */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between gap-1">
        <div>
          {/* Line 1: Dynamic Price based on Sourcing Mode */}
          <div className="flex items-baseline gap-1">
            {bale.sourcingMode === 'pieces_only' ? (
              <>
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {formatINR(bale.curatedPiecePrice)}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  /pc (MOQ {bale.curatedMoq})
                </span>
              </>
            ) : bale.sourcingMode === 'bale_only' ? (
              <>
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {formatINR(bale.sealedBalePrice)}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Whole {bale.weightKg}kg)
                </span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {formatINR(bale.sealedBalePrice)}
                </span>
                <span className="text-[10.5px] text-slate-500 font-normal">
                  ({formatINR(avgPiecePrice)}/pc)
                </span>
              </>
            )}
          </div>

          {/* Line 2: 1-Line Clean Title */}
          <h3
            className="text-xs font-medium text-slate-800 line-clamp-1 leading-snug group-hover:text-amber-700 transition-colors mt-0.5"
            title={bale.title}
          >
            {bale.title}
          </h3>

          {/* Line 3: Crisp Metadata */}
          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {primaryGrade} • {bale.originCountry} • ~{bale.estimatedPieceCount} Pcs
          </div>
        </div>

        {/* Line 4: Location & QC Shield Footer */}
        <div className="pt-1.5 mt-0.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="truncate max-w-[120px]">
            {bale.seller?.godownZone ? bale.seller.godownZone.split(' ')[0] : 'Sanoli'} Hub, Panipat
          </span>
          <span className="flex items-center gap-0.5 text-emerald-700 font-medium shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>QC Shield</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
