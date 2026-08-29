'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SellerProfile } from '@/types';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Download, 
  ArrowUpRight,
  Search
} from 'lucide-react';

export default function SellerPayoutsPage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);

  const [payouts] = useState([
    {
      id: 'PAY-98124',
      orderNumber: 'SP-ESCROW-782190',
      baleTitle: 'Korean Heavy Puffer Jackets (80kg)',
      grossAmount: 32000,
      platformFee: 960, // 3%
      netPayout: 31040,
      settlementStatus: 'escrow_locked',
      payoutDate: 'Pending Dispatch Confirmation',
      utrReference: 'Awaiting LR Bilti verification',
    },
    {
      id: 'PAY-89211',
      orderNumber: 'SP-ESCROW-640192',
      baleTitle: 'Vintage Heavy Denim Jackets (100kg)',
      grossAmount: 89000,
      platformFee: 2670,
      netPayout: 86330,
      settlementStatus: 'bank_transferred',
      payoutDate: '2026-08-28 16:45 IST',
      utrReference: 'HDFC-N38291048821',
    },
    {
      id: 'PAY-74120',
      orderNumber: 'SP-ESCROW-519024',
      baleTitle: 'Heavy 450 GSM Fleece Hoodies (80kg)',
      grossAmount: 26000,
      platformFee: 780,
      netPayout: 25220,
      settlementStatus: 'bank_transferred',
      payoutDate: '2026-08-26 14:10 IST',
      utrReference: 'ICIC-T9821471092',
    },
    {
      id: 'PAY-62119',
      orderNumber: 'SP-ESCROW-401928',
      baleTitle: 'Double-Ply Embossed Heavy Mink Blankets',
      grossAmount: 48000,
      platformFee: 1440,
      netPayout: 46560,
      settlementStatus: 'bank_transferred',
      payoutDate: '2026-08-22 18:30 IST',
      utrReference: 'SBIN-00291847192',
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

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

  const totalSettled = payouts
    .filter(p => p.settlementStatus === 'bank_transferred')
    .reduce((acc, curr) => acc + curr.netPayout, 0);

  const totalInEscrow = payouts
    .filter(p => p.settlementStatus === 'escrow_locked')
    .reduce((acc, curr) => acc + curr.netPayout, 0);

  const filteredPayouts = payouts.filter(p =>
    p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.baleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.utrReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Escrow Settlements & Bank Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of ICICI Nodal Escrow payouts, net amounts, and bank UTR transaction references.
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-slate-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded self-start sm:self-auto">
          Seller #PNP-001
        </span>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Total Settled to Bank</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatINR(totalSettled)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            Transferred via NEFT / RTGS
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Locked in Escrow</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900">
            {formatINR(totalInEscrow)}
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            Pending transport Bilti confirmation
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-xs space-y-1 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Escrow Settlement Bank</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-0.5">
            {seller?.bankName || 'HDFC Bank, Panipat Branch'}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            A/C: •••• {seller?.bankAccountNumber?.slice(-4) || '5678'} • IFSC: {seller?.bankIfscCode || 'HDFC0001234'}
          </div>
        </div>

      </div>

      {/* Payouts Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-3 p-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-slate-700" />
            <span>Settlement History & UTR Reference</span>
          </h2>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs max-w-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by Order # or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Godown Lot</th>
                <th className="py-2.5 px-3">Gross Order</th>
                <th className="py-2.5 px-3">Platform (3%)</th>
                <th className="py-2.5 px-3">Net Payout</th>
                <th className="py-2.5 px-3">Settlement Status</th>
                <th className="py-2.5 px-3">Payout Date / UTR Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {pay.orderNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-800 max-w-[200px] truncate">
                    {pay.baleTitle}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {formatINR(pay.grossAmount)}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-medium">
                    - {formatINR(pay.platformFee)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {formatINR(pay.netPayout)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                      pay.settlementStatus === 'bank_transferred'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-300'
                    }`}>
                      {pay.settlementStatus === 'bank_transferred' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Bank Transferred</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Escrow Locked</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600">
                    <div className="font-medium text-slate-800">{pay.payoutDate}</div>
                    <div className="font-mono text-[10px] text-slate-400">{pay.utrReference}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
