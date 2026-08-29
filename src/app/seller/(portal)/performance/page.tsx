'use client';

import React, { useState, useEffect } from 'react';
import { SellerProfile } from '@/types';
import { 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SellerPerformancePage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('month');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          setSeller(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  const revenueData = {
    day: { gross: 32000, net: 31040, bales: 1, repeat: 100 },
    week: { gross: 147000, net: 142590, bales: 5, repeat: 96 },
    month: { gross: 485000, net: 470450, bales: 16, repeat: 94 },
    all: { gross: 3840000, net: 3724800, bales: 1420, repeat: 96 },
  };

  const currentRev = revenueData[period];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Godown Performance & Trust Score Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Key operational metrics, revenue breakdown by timeframe, and fulfillment trust rate.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setPeriod('day')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              period === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              period === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              period === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              period === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 3 Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Net Wholesale Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatINR(currentRev.net)}
          </div>
          <div className="text-[11px] text-slate-500">
            Gross B2B billing: <strong className="text-slate-700">{formatINR(currentRev.gross)}</strong>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Dispatched Bales / Lots</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {currentRev.bales} Bales
          </div>
          <div className="text-[11px] text-slate-500">
            Verified with transport Bilti (LR scan)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Repeat Buyer Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {currentRev.repeat}%
          </div>
          <div className="text-[11px] text-slate-500">
            Pan-India boutique store managers
          </div>
        </div>

      </div>

      {/* Trust Score System Breakdown */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Seller Trust Score System & Rating
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            <span>Active Trust Score:</span>
            <span className="font-mono text-sm">{seller?.trustScore || 100}% ⭐</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">100% Default Starting Score</div>
            <p className="text-slate-600 text-[11px]">
              Every verified Panipat godown starts with a pristine 100% trust score upon KYC verification.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Cancellation Penalty Formula</div>
            <p className="text-slate-600 text-[11px]">
              <code>(fulfilledOrders / totalOrders) * 100</code>. Rejecting confirmed orders directly reduces your score.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Public Buyer Visibility</div>
            <p className="text-slate-600 text-[11px]">
              Your trust score is visible on product cards across the marketplace to drive buyer confidence.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
