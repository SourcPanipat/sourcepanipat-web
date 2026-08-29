'use client';

import React from 'react';
import { BuyMode, BaleListing } from '@/types';
import { formatINR } from '@/lib/utils';
import { Package, Scissors, Check, Minus, Plus } from 'lucide-react';

interface BuyModeSelectorProps {
  bale: BaleListing;
  selectedMode: BuyMode;
  onModeChange: (mode: BuyMode) => void;
  baleQuantity: number;
  onBaleQuantityChange: (qty: number) => void;
  curatedPieces: number;
  onCuratedPiecesChange: (pieces: number) => void;
}

export function BuyModeSelector({
  bale,
  selectedMode,
  onModeChange,
  baleQuantity,
  onBaleQuantityChange,
  curatedPieces,
  onCuratedPiecesChange,
}: BuyModeSelectorProps) {
  const isSealed = selectedMode === 'sealed_bale';

  const sealedTotal = bale.sealedBalePrice * baleQuantity;
  const curatedTotal = bale.curatedPiecePrice * curatedPieces;
  const avgSealedPiecePrice = Math.round(bale.sealedBalePrice / bale.estimatedPieceCount);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>Choose Sourcing Mode</span>
        </h3>
        <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Direct Godown Rate
        </span>
      </div>

      {/* Dual Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        
        {/* Mode 1: Sealed Bulk Bale */}
        <div
          onClick={() => onModeChange('sealed_bale')}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-150 relative ${
            isSealed
              ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
          }`}
        >
          {isSealed && (
            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${isSealed ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Sealed Bulk Bale</div>
              <div className="text-[10px] text-slate-500">Standard {bale.weightKg} KG Steel-Strapped Bale</div>
            </div>
          </div>

          <div className="mt-2 text-base sm:text-lg font-black text-slate-950">
            {formatINR(bale.sealedBalePrice)}
            <span className="text-[11px] font-normal text-slate-500"> / bale</span>
          </div>

          <div className="mt-1 text-[10px] text-emerald-700 font-bold">
            ≈ {formatINR(avgSealedPiecePrice)} / piece (~{bale.estimatedPieceCount} pcs inside)
          </div>
        </div>

        {/* Mode 2: Hand-Picked Curated Lot */}
        <div
          onClick={() => onModeChange('curated_lot')}
          className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-150 relative ${
            !isSealed
              ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
          }`}
        >
          {!isSealed && (
            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${!isSealed ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Hand-Picked Curated Lot</div>
              <div className="text-[10px] text-slate-500">MOQ {bale.curatedMoq} Pieces (100% Graded)</div>
            </div>
          </div>

          <div className="mt-2 text-base sm:text-lg font-black text-slate-950">
            {formatINR(bale.curatedPiecePrice)}
            <span className="text-[11px] font-normal text-slate-500"> / piece</span>
          </div>

          <div className="mt-1 text-[10px] text-amber-800 font-bold">
            Zero Grade C defect risk • Selected piece-by-piece
          </div>
        </div>
      </div>

      {/* Quantity Stepper & Calculation */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {isSealed ? (
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <div className="text-xs font-bold text-slate-800">Bale Quantity:</div>
              <div className="text-[10px] text-slate-500">
                Total weight: {bale.weightKg * baleQuantity} KG (~{bale.estimatedPieceCount * baleQuantity} pcs)
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
              <button
                onClick={() => onBaleQuantityChange(Math.max(1, baleQuantity - 1))}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-slate-900">{baleQuantity}</span>
              <button
                onClick={() => onBaleQuantityChange(baleQuantity + 1)}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <div className="text-xs font-bold text-slate-800">Hand-Picked Piece Count:</div>
              <div className="text-[10px] text-amber-800 font-bold">
                Minimum order quantity: {bale.curatedMoq} pcs
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
              <button
                onClick={() => onCuratedPiecesChange(Math.max(bale.curatedMoq, curatedPieces - 5))}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs"
              >
                -5
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-900">{curatedPieces}</span>
              <button
                onClick={() => onCuratedPiecesChange(curatedPieces + 5)}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs"
              >
                +5
              </button>
            </div>
          </div>
        )}

        {/* Calculated Total for this Mode */}
        <div className="w-full sm:w-auto text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
          <div className="text-[10px] text-slate-500 font-medium">Subtotal for Lot:</div>
          <div className="text-lg sm:text-xl font-black text-amber-700">
            {formatINR(isSealed ? sealedTotal : curatedTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
