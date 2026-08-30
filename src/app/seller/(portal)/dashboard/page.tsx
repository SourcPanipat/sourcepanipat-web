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
  const [lots, setLots] = useState<BaleListingItem[]>([
    {
      id: 'bale-001',
      slug: 'korean-heavy-puffers-bale-001',
      sellerId: 'pnp-001',
      categoryId: 'winter-jackets-outerwear',
      subCategoryId: 'heavy-puffers',
      categoryLabel: 'Winter Jackets & Outerwear',
      title: 'Korean Heavy Puffer Jackets (Grade A Cream Lot)',
      shortDescription: 'High-density duck down and poly-fill puffers. Top Korean branded winter outerwear.',
      sourcingMode: 'both',
      originCountry: 'South Korea',
      originFlag: 'KR',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      weightKg: 80,
      estimatedPieceCount: 72,
      sealedBalePrice: 32000,
      curatedPiecePrice: 480,
      curatedMoq: 25,
      gradeA: 85,
      gradeB: 12,
      gradeC: 3,
      videos: [],
      photos: [],
      godownBatchId: 'BATCH-SANOLI-2026-W09',
      qcVerified: true,
      inStockCount: 6,
      fabricComposition: '100% Nylon Ripstop Outer, Duck Down',
      expectedGrossMargin: '3.8x - 5.2x Margin',
      status: 'approved',
      createdAt: '2026-08-27T10:00:00Z',
    },
    {
      id: 'bale-006',
      slug: 'heavyweight-zipper-bomber-leather-flight-jackets',
      sellerId: 'pnp-001',
      categoryId: 'winter-jackets-outerwear',
      subCategoryId: 'leather-bombers',
      categoryLabel: 'Winter Jackets & Outerwear',
      title: 'Heavyweight Zipper Bomber & Leather Flight Jackets',
      shortDescription: 'USA and Korean MA-1 flight bombers, shearling collar aviator jackets.',
      sourcingMode: 'pieces_only',
      originCountry: 'USA & Korea',
      originFlag: 'US',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      weightKg: 90,
      estimatedPieceCount: 65,
      sealedBalePrice: 39500,
      curatedPiecePrice: 680,
      curatedMoq: 20,
      gradeA: 84,
      gradeB: 12,
      gradeC: 4,
      videos: [],
      photos: [],
      godownBatchId: 'BATCH-SANOLI-2026-W09',
      qcVerified: true,
      inStockCount: 4,
      fabricComposition: 'Top-Grain Leather & Heavy Flight Nylon Shell',
      expectedGrossMargin: '4.0x - 6.5x Margin',
      status: 'approved',
      createdAt: '2026-08-27T18:00:00Z',
    },
    {
      id: 'bale-010',
      slug: 'sherpa-lined-trucker-jackets-quilted-vests',
      sellerId: 'pnp-001',
      categoryId: 'winter-jackets-outerwear',
      subCategoryId: 'sherpa-truckers',
      categoryLabel: 'Winter Jackets & Outerwear',
      title: 'Sherpa Lined Trucker Jackets & Heavy Quilted Vests',
      shortDescription: 'USA workwear sherpa-lined corduroy & denim truckers with warm insulating vests.',
      sourcingMode: 'both',
      originCountry: 'United States',
      originFlag: 'US',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      weightKg: 85,
      estimatedPieceCount: 85,
      sealedBalePrice: 32500,
      curatedPiecePrice: 420,
      curatedMoq: 25,
      gradeA: 82,
      gradeB: 15,
      gradeC: 3,
      videos: [],
      photos: [],
      godownBatchId: 'BATCH-SANOLI-2026-W09',
      qcVerified: true,
      inStockCount: 5,
      fabricComposition: '100% Cotton Outer, Poly Faux Shearling',
      expectedGrossMargin: '3.6x - 5.0x Margin',
      status: 'pending_approval',
      createdAt: '2026-08-29T12:00:00Z',
    },
  ]);

  const [pendingOrders, setPendingOrders] = useState<SellerOrderDispatch[]>([
    {
      id: 'ORD-782190',
      orderNumber: 'SP-ESCROW-782190',
      baleId: 'bale-001',
      baleTitle: 'Korean Heavy Puffer Jackets (80kg)',
      baleThumbnail: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      baleWeightKg: 80,
      buyMode: 'sealed_bale',
      quantity: 1,
      totalAmount: 32000,
      buyerCity: 'New Delhi',
      buyerState: 'Delhi NCR',
      escrowStatus: 'QC_APPROVAL_PENDING',
      sellerStatus: 'confirmed',
      settlementStatus: 'escrow_locked',
      inspectorName: 'Vikram S. (#PNP-INSP-04)',
      createdAt: '2026-08-28T14:20:00Z',
    },
    {
      id: 'ORD-640192',
      orderNumber: 'SP-ESCROW-640192',
      baleId: 'bale-006',
      baleTitle: 'Vintage Heavy Denim Jackets (100kg)',
      baleThumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      baleWeightKg: 100,
      buyMode: 'sealed_bale',
      quantity: 2,
      totalAmount: 89000,
      buyerCity: 'Jaipur',
      buyerState: 'Rajasthan',
      escrowStatus: 'INSPECTOR_ASSIGNED',
      sellerStatus: 'new',
      settlementStatus: 'escrow_locked',
      inspectorName: 'Rajesh Malik (#PNP-INSP-02)',
      createdAt: '2026-08-29T10:00:00Z',
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          setSeller(JSON.parse(stored));
        } catch (e) {}
      }

      const storedLots = localStorage.getItem('sp_seller_lots');
      if (storedLots) {
        try {
          const parsed = JSON.parse(storedLots);
          setLots(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  if (!seller) return null;

  const approvedLotsCount = lots.filter(l => l.status === 'approved').length;
  const pendingLotsCount = lots.filter(l => l.status === 'pending_approval').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                {seller.maskedCode}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Vetted Supplier
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {seller.businessName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {seller.godownZone} • Managing Partner: <strong>{seller.fullName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/seller/listings/new"
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List New Godown Lot</span>
          </Link>

          <Link
            href="/"
            className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1 border border-slate-200 transition-colors"
          >
            <span>View Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Active Godown Lots</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {approvedLotsCount} Live
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            {pendingLotsCount > 0 ? `${pendingLotsCount} pending admin review` : 'All lots approved'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {pendingOrders.length} Orders
          </div>
          <div className="text-[11px] text-amber-800 font-medium">
            Awaiting dispatch/QC
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Total Dispatched</span>
            <Truck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {seller.totalDispatchedBales} Bales
          </div>
          <div className="text-[11px] text-slate-500">
            Pan-India destinations
          </div>
        </div>

        {/* Metric 4: TRUST SCORE */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Seller Trust Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 flex items-center gap-1">
            <span>{seller.trustScore || 100}%</span>
            <span className="text-xs text-emerald-600 font-bold">⭐</span>
          </div>
          <div className="text-[11px] text-slate-500">
            0% cancellation penalty
          </div>
        </div>

      </div>

      {/* 2-Column Main Section: Recent Lots & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Active Lots Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-slate-700" />
              <span>My Godown Lots</span>
            </h2>
            <Link href="/seller/listings" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              View All ({lots.length}) →
            </Link>
          </div>

          <div className="space-y-2.5">
            {lots.slice(0, 3).map((lot) => (
              <div
                key={lot.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                    <Image src={lot.thumbnailUrl} alt={lot.title} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {lot.weightKg} KG
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        lot.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : lot.status === 'pending_approval'
                          ? 'bg-amber-50 text-amber-900 border border-amber-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {lot.status === 'approved' ? '● Live' : lot.status === 'pending_approval' ? '⏳ Pending Admin Review' : '✕ Rejected'}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {lot.title}
                    </h3>

                    <div className="text-[11px] text-slate-500">
                      In Stock: <strong>{lot.inStockCount} Bales</strong> • {lot.sourcingMode.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">
                    {lot.sourcingMode === 'pieces_only' ? `${formatINR(lot.curatedPiecePrice)}/pc` : formatINR(lot.sealedBalePrice)}
                  </div>
                  <Link
                    href="/seller/listings"
                    className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold block mt-1"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Orders Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>Pending Orders Queue</span>
            </h2>
            <Link href="/seller/orders" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
              Manage Orders →
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                    {ord.sellerStatus === 'new' ? 'Action Required: Confirm' : 'QC Tare Weight in Progress'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">{ord.baleTitle}</h4>
                  <p className="text-[11px] text-slate-500">
                    Destination: {ord.buyerCity} • Escrow Amount: <strong>{formatINR(ord.totalAmount)}</strong>
                  </p>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Inspector: {ord.inspectorName}</span>
                  <Link
                    href="/seller/orders"
                    className="font-bold text-slate-900 hover:underline"
                  >
                    View Order →
                  </Link>
                </div>
              </div>
            ))}

            {/* Field Desk WhatsApp Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Panipat Field Coordinator Desk</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Need tare inspection or 30s opening video for a new container shipment? Request a field auditor.
              </p>
              <a
                href="https://wa.me/918950202286?text=Hi%20Panipat%20Trader%20Desk,%20I%20am%20#PNP-001%20and%20need%20a%20QC%20inspector%20at%20my%20yard"
                target="_blank"

                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Request Yard Inspector</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
