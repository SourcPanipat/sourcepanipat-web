'use client';

import React from 'react';
import { ShieldCheck, Scale, Video, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface InspectionShieldBannerProps {
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
  fee?: number;
}

export function InspectionShieldBanner({
  isSelected,
  onToggle,
  fee = 1000,
}: InspectionShieldBannerProps) {
  return (
    <div
      onClick={() => onToggle(!isSelected)}
      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-emerald-700 border border-slate-200'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                SourcePanipat QC Inspection Shield
              </h4>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Recommended
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Zero-Defect Ground Audit at Panipat Godown
            </p>
          </div>
        </div>

        {/* Price & Checkbox */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs sm:text-sm font-black text-emerald-800">
              +{formatINR(fee)}
            </span>
            <span className="block text-[9px] text-slate-500 font-medium">Fixed Add-on</span>
          </div>

          <div
            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
          </div>
        </div>
      </div>

      {/* Bullet Points of What is Included */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
        <div className="flex items-start gap-1.5 text-slate-700">
          <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>Tare Weight Audit:</strong> Exact digital scale photo before steel strapping.</span>
        </div>

        <div className="flex items-start gap-1.5 text-slate-700">
          <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>5-Min Live Video:</strong> Inspector coordinates live unrolling clip via WhatsApp.</span>
        </div>

        <div className="flex items-start gap-1.5 text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong>Buyer OTP Release:</strong> Godown cannot dispatch without your digital sign-off.</span>
        </div>
      </div>
    </div>
  );
}
