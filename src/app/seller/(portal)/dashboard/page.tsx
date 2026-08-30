'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SellerProfile, BaleListingItem, SellerOrderDispatch } from '@/types';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  Scale, 
  PlusCircle, 
  Building2, 
  Phone, 
  Clock, 
  TrendingUp, 
  ExternalLink,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function SellerDashboardPage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [lots, setLots] = useState<BaleListingItem[]>([]);
  const [orders, setOrders] = useState<SellerOrderDispatch[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSeller = localStorage.getItem('sp_active_seller');
      if (storedSeller) {
        try {
          const parsed = JSON.parse(storedSeller);
          setSeller(parsed);
        } catch (e) {}
      }

      // Load lots created by this seller
      const storedLots = localStorage.getItem('sp_seller_lots');
      if (storedLots) {
        try {
          const parsedLots = JSON.parse(storedLots);
          setLots(parsedLots);
        } catch (e) {}
      }

      // Load orders for this seller
      const storedOrders = localStorage.getItem('sp_escrow_orders');
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
        } catch (e) {}
      }
    }
  }, []);

  const activeLotsCount = lots.filter((l) => l.status === 'approved').length;
  const pendingLotsCount = lots.filter((l) => l.status === 'pending_approval').length;
  const pendingOrdersCount = orders.filter((o) => o.escrowStatus !== 'DELIVERED_SETTLED').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {seller?.maskedCode || '#PNP-SELLER'}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {seller?.verificationStatus === 'approved' ? 'KYC Verified Supplier' : 'Pending KYC'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {seller?.businessName || seller?.fullName || 'Godown Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {seller?.godownZone || 'Panipat Godown Hub'} • Managing Partner: {seller?.fullName || 'Trader'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/seller/listings/new"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>+ List New Godown Lot</span>
          </Link>
          <Link
            href="/"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            View Marketplace
          </Link>
        </div>
      </div>

      {/* 2. Top Stats KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active Godown Lots</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {activeLotsCount} Live
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {pendingLotsCount} pending admin review
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pending Orders</span>
            <Truck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {pendingOrdersCount} Orders
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Awaiting dispatch/QC
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Dispatched</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {seller?.totalDispatchedBales || 0} Bales
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Pan-India destinations
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Seller Trust Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2 text-emerald-800">
            {seller?.trustScore || 100}% ⭐
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            0% cancellation penalty
          </div>
        </div>

      </div>

      {/* 3. My Godown Lots Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">My Godown Lots</h2>
            <p className="text-xs text-slate-500">Live wholesale bales and curated lots listed on SourcePanipat</p>
          </div>
          <Link
            href="/seller/listings"
            className="text-xs text-amber-800 font-bold hover:underline"
          >
            View All ({lots.length}) →
          </Link>
        </div>

        {lots.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-800 text-xs">No lots listed yet</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Create your first whole bale or curated piece lot listing with 30s opening unboxing inspection clips.
            </p>
            <Link
              href="/seller/listings/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Create First Lot</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lots.slice(0, 3).map((lot) => (
              <div
                key={lot.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">{lot.weightKg} KG</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    lot.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lot.status === 'approved' ? '● Live' : '⏳ Pending Review'}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 line-clamp-1">
                  {lot.title}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span>In Stock: {lot.inStockCount || 1} Bales</span>
                  <span className="font-bold text-slate-900">
                    ₹{lot.sealedBalePrice?.toLocaleString('en-IN') || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Orders Queue & Support CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent Escrow Orders</h2>
            <Link href="/seller/orders" className="text-xs text-amber-800 font-bold hover:underline">
              Manage Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-xs">No active orders yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                When buyers lock lots via escrow on the marketplace, your dispatch orders and inspector requests will show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{ord.orderNumber}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{ord.baleTitle}</div>
                  </div>
                  <Link
                    href="/seller/orders"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]"
                  >
                    View Order →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panipat Field Desk Coordinator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Panipat Field Coordinator Desk
            </h2>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed">
            Need tare inspection or 30s opening video for a new container shipment? Request a field auditor.
          </p>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 space-y-1">
            <div className="text-[11px] font-bold text-emerald-950">Ground Desk WhatsApp:</div>
            <div className="text-xs font-bold text-emerald-800">+91 89502 02286</div>
          </div>

          <a
            href={`https://wa.me/918950202286?text=${encodeURIComponent(
              `Hi Panipat Trader Desk, I am ${seller?.maskedCode || '#PNP'} (${seller?.fullName || 'Seller'}) and need a QC inspector at my yard: `
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Request Yard Inspector</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

      </div>

    </div>
  );
}
