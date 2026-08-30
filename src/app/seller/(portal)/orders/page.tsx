'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SellerOrderDispatch, SellerProfile } from '@/types';
import { 
  Truck, 
  Upload, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  X, 
  AlertTriangle, 
  Search,
  Clock,
  Ban
} from 'lucide-react';

import { getSellerOrdersFromDb } from '@/lib/supabase-db';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrderDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('sp_active_seller');
      let sellerId = 'pnp-seller-001';
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id) sellerId = parsed.id;
        } catch (e) {}
      }

      try {
        const dbOrders = await getSellerOrdersFromDb(sellerId);
        setOrders(dbOrders);
      } catch (err) {
        console.error('Error loading seller orders:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');


  // Upload Bilti Dialog State
  const [selectedOrderForBilti, setSelectedOrderForBilti] = useState<SellerOrderDispatch | null>(null);
  const [transporterName, setTransporterName] = useState('V-Trans Panipat Godown Hub');
  const [lrNumber, setLrNumber] = useState('');

  // Cancellation Dialog State (Trust Score Penalty)
  const [cancellingOrder, setCancellingOrder] = useState<SellerOrderDispatch | null>(null);
  const [cancelReason, setCancelReason] = useState('Out of Stock in Godown');

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  // 1-Click Confirm Order
  const handleConfirmOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          sellerStatus: 'confirmed' as const,
          escrowStatus: 'QC_APPROVAL_PENDING' as const,
        };
      }
      return o;
    });
    setOrders(updated);
  };

  // Save Bilti and mark Dispatched
  const handleSaveBilti = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForBilti) return;

    setOrders(orders.map((o) => {
      if (o.id === selectedOrderForBilti.id) {
        return {
          ...o,
          sellerStatus: 'dispatched',
          escrowStatus: 'DISPATCHED_BILTI_UPLOADED',
          biltiLrNumber: lrNumber || 'VT-PNP-882190',
          transporterName,
          biltiScanUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        };
      }
      return o;
    }));

    setSelectedOrderForBilti(null);
  };

  // Cancel Order & Penalize Trust Score
  const handleExecuteCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    const updated = orders.map((o) => {
      if (o.id === cancellingOrder.id) {
        return {
          ...o,
          sellerStatus: 'cancelled_by_seller' as const,
        };
      }
      return o;
    });
    setOrders(updated);

    // Update Trust Score in localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          const seller: SellerProfile = JSON.parse(stored);
          const newCancelled = (seller.cancelledOrders || 0) + 1;
          const total = (seller.totalOrders || 10) + 1;
          const fulfilled = seller.fulfilledOrders || 10;
          const newScore = Math.max(0, Math.round((fulfilled / total) * 100));

          const updatedSeller: SellerProfile = {
            ...seller,
            cancelledOrders: newCancelled,
            totalOrders: total,
            trustScore: newScore,
          };
          localStorage.setItem('sp_active_seller', JSON.stringify(updatedSeller));
        } catch (e) {}
      }
    }

    setCancellingOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.baleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'new' && o.sellerStatus === 'new') ||
      (activeTab === 'confirmed' && o.sellerStatus === 'confirmed') ||
      (activeTab === 'dispatched' && o.sellerStatus === 'dispatched') ||
      (activeTab === 'completed' && o.sellerStatus === 'completed') ||
      (activeTab === 'cancelled' && o.sellerStatus === 'cancelled_by_seller');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Escrow Orders & Dispatch Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm new orders, track field QC inspection, and upload transport Bilti (LR scan) for direct payout settlement.
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-slate-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded self-start sm:self-auto">
          Seller Desk #PNP-001
        </span>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'new' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New ({orders.filter(o => o.sellerStatus === 'new').length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'confirmed' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmed ({orders.filter(o => o.sellerStatus === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('dispatched')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'dispatched' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dispatched ({orders.filter(o => o.sellerStatus === 'dispatched').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'cancelled' ? 'bg-white text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({orders.filter(o => o.sellerStatus === 'cancelled_by_seller').length})
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs max-w-sm focus-within:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Order # or Buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Queue */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-2">
            <Truck className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-900">No orders in this category</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              New orders backed by ICICI Nodal Escrow will appear here.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {order.orderNumber}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                    order.sellerStatus === 'new'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : order.sellerStatus === 'confirmed'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : order.sellerStatus === 'dispatched'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      : order.sellerStatus === 'cancelled_by_seller'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {order.sellerStatus === 'new'
                      ? '⚡ New Order (Action Required)'
                      : order.sellerStatus === 'confirmed'
                      ? '✓ Confirmed (Inspector Tare Weighing)'
                      : order.sellerStatus === 'dispatched'
                      ? '🚚 Dispatched (Bilti LR Uploaded)'
                      : order.sellerStatus === 'cancelled_by_seller'
                      ? '✕ Cancelled by Seller'
                      : '✓ Completed & Settled'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Escrow Payment Locked: <strong className="text-slate-900 font-bold">{formatINR(order.totalAmount)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Lot info */}
                <div className="md:col-span-5 flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                    <Image src={order.baleThumbnail} alt={order.baleTitle} fill className="object-cover" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {order.baleTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {order.quantity} x {order.baleWeightKg}kg Bale • Consignee: <strong>{order.buyerName}</strong> ({order.buyerCity}, {order.buyerState})
                    </p>
                    <div className="text-[10.5px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>ICICI Nodal Escrow Secured</span>
                    </div>
                  </div>
                </div>

                {/* Inspector Info */}
                <div className="md:col-span-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-600" />
                    <span>QC Inspector</span>
                  </div>
                  <div className="text-slate-700 font-medium truncate">
                    {order.inspectorName}
                  </div>
                  <div className="text-[10.5px] text-slate-500">
                    Tare Weight: <strong>{order.verifiedTareWeightKg || order.baleWeightKg} KG</strong>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center gap-2">
                  
                  {order.sellerStatus === 'new' ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors flex-1 md:flex-initial"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Order</span>
                      </button>

                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors border border-rose-200"
                        title="Cancel Order"
                      >
                        Reject
                      </button>
                    </div>
                  ) : order.sellerStatus === 'confirmed' ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => {
                          setSelectedOrderForBilti(order);
                          setLrNumber(`VT-PNP-${Math.floor(100000 + Math.random() * 900000)}`);
                        }}
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors flex-1 md:flex-initial"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Bilti (LR Scan)</span>
                      </button>

                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="px-2.5 py-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-medium"
                        title="Cancel Confirmed Order (Penalty Applies)"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : order.sellerStatus === 'dispatched' ? (
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">
                        LR: {order.biltiLrNumber}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                        {order.transporterName}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bilti Verified</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Order Closed</span>
                  )}

                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Bilti Dialog */}
      {selectedOrderForBilti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Upload Transport Bilti (LR Scan)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForBilti(null)}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBilti} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{selectedOrderForBilti.orderNumber}</div>
                <div className="text-[11px] text-slate-500">{selectedOrderForBilti.baleTitle}</div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Transporter / Fleet Name *
                </label>
                <input
                  type="text"
                  required
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Transport Bilti / Lorry Receipt (LR) Number *
                </label>
                <input
                  type="text"
                  required
                  value={lrNumber}
                  onChange={(e) => setLrNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-800 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Bilti Document / Receipt Photo *
                </label>
                <div className="p-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-1">
                  <FileText className="w-5 h-5 text-slate-500 mx-auto" />
                  <div className="font-bold text-slate-800 text-[11px]">bilti-receipt-scan.jpg</div>
                  <span className="text-[10px] text-emerald-700 font-bold">✓ Attached (Cloudflare R2)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForBilti(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
                >
                  Confirm Bilti Dispatch
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Cancellation Penalty Warning Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-200 flex items-center justify-between text-rose-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs sm:text-sm font-bold">
                  Warning: Cancellation Penalizes Trust Score
                </h3>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="w-7 h-7 rounded bg-white hover:bg-rose-100 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteCancel} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 text-rose-950 space-y-1 text-[11.5px]">
                <p>
                  Cancelling order <strong>{cancellingOrder.orderNumber}</strong> will automatically reduce your public <strong>Seller Trust Score</strong> on buyer product cards.
                </p>
                <p className="text-[10.5px] text-rose-700">
                  Formula: <code>(fulfilledOrders / totalOrders) * 100</code>
                </p>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Reason for Godown Cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                >
                  <option value="Out of Stock in Godown">Out of Stock in Godown</option>
                  <option value="Damaged in Sorting Yard">Damaged in Sorting Yard</option>
                  <option value="Tare Weight Discrepancy">Tare Weight Discrepancy</option>
                  <option value="Transporter Service Unavailable">Transporter Service Unavailable</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Keep Order Active
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
                >
                  Confirm Cancellation (-10% Penalty)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
