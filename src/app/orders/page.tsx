'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MOCK_ORDERS } from '@/lib/mock-catalog';
import { EscrowOrderRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  Package, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Scale 
} from 'lucide-react';

export default function OrdersListPage() {
  const [orders, setOrders] = useState<EscrowOrderRecord[]>(Object.values(MOCK_ORDERS));

  useEffect(() => {
    // Check if any additional orders were placed in local session
    if (typeof window !== 'undefined') {
      const localPlaced = localStorage.getItem('sp_recent_order');
      if (localPlaced) {
        try {
          const parsed = JSON.parse(localPlaced);
          if (!orders.some((o) => o.id === parsed.id || o.orderNumber === parsed.orderNumber)) {
            setOrders((prev) => [parsed, ...prev]);
          }
        } catch (e) {}
      }
    }
  }, []);

  const getStageBadge = (stageIndex: number) => {
    switch (stageIndex) {
      case 0:
        return { label: '1/5 Escrow Locked', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 1:
        return { label: '2/5 Inspector Assigned', color: 'bg-amber-50 text-amber-900 border-amber-300' };
      case 2:
        return { label: '3/5 QC Video Approval', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 3:
        return { label: '4/5 Dispatched (Bilti LR)', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 4:
        return { label: '5/5 Delivered & Settled', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'In Progress', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex-1 w-full">
        
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              My Panipat Escrow Orders
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track live 5-stage QC inspection, tare weight approval, and transport Bilti (LR) status
            </p>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold self-start sm:self-auto transition-colors"
          >
            + Browse More Lots
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-6">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No active escrow orders found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t placed any godown bale orders yet. Explore available Panipat inventory with 100% escrow protection.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = getStageBadge(order.currentStageIndex);
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                      <Image src={order.baleThumbnail} alt={order.baleTitle} fill className="object-cover" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {order.sellerMaskedCode}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {order.baleTitle}
                      </h3>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                        <span>
                          {order.buyMode === 'sealed_bale'
                            ? `${order.quantityBales || 1} x ${order.baleWeightKg}kg Bale`
                            : `${order.curatedPieceCount || 25} Curated Pieces`}
                        </span>
                        <span>•</span>
                        <span>Dest: {order.deliveryCity}</span>
                        <span>•</span>
                        <span>{order.estimatedDispatch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Amount</div>
                      <div className="text-base font-black text-slate-900">
                        {formatINR(order.totalPayable)}
                      </div>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
