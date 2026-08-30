'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BaleListingItem, ListingStatus } from '@/types';
import { 
  Package, 
  PlusCircle, 
  Search, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function SellerListingsPage() {
  const [lots, setLots] = useState<BaleListingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'approved' | 'pending_approval' | 'rejected'>('all');
  
  // Edit Modal State (Staging Edits)
  const [editingLot, setEditingLot] = useState<BaleListingItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editNotice, setEditNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_seller_lots');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLots(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const handleDelete = (id: string) => {

    const updated = lots.filter(l => l.id !== id);
    setLots(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_seller_lots', JSON.stringify(updated));
    }
  };

  const handleOpenEdit = (lot: BaleListingItem) => {
    setEditingLot(lot);
    setEditTitle(lot.title);
    setEditPrice(lot.sourcingMode === 'pieces_only' ? lot.curatedPiecePrice : lot.sealedBalePrice);
    setEditStock(lot.inStockCount);
    setEditNotice(false);
  };

  const handleSaveStagingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLot) return;

    // Changes enter pending_approval status!
    const updatedLots: BaleListingItem[] = lots.map((l) => {
      if (l.id === editingLot.id) {
        return {
          ...l,
          title: editTitle,
          sealedBalePrice: l.sourcingMode !== 'pieces_only' ? editPrice : l.sealedBalePrice,
          curatedPiecePrice: l.sourcingMode === 'pieces_only' ? editPrice : l.curatedPiecePrice,
          inStockCount: editStock,
          status: 'pending_approval' as ListingStatus, // Staging!
        };
      }
      return l;
    });

    setLots(updatedLots);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_seller_lots', JSON.stringify(updatedLots));
    }

    setEditNotice(true);
    setTimeout(() => {
      setEditingLot(null);
      setEditNotice(false);
    }, 1200);
  };

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  const filteredLots = lots.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusTab === 'all' || l.status === selectedStatusTab;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            My Godown Lots & Inventory Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your live wholesale lots. Edits enter admin staging review before updating the marketplace.
          </p>
        </div>

        <Link
          href="/seller/listings/new"
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ List New Godown Lot</span>
        </Link>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedStatusTab('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              selectedStatusTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Lots ({lots.length})
          </button>
          <button
            onClick={() => setSelectedStatusTab('approved')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              selectedStatusTab === 'approved' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live ({lots.filter(l => l.status === 'approved').length})</span>
          </button>
          <button
            onClick={() => setSelectedStatusTab('pending_approval')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1 ${
              selectedStatusTab === 'pending_approval' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review ({lots.filter(l => l.status === 'pending_approval').length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs focus-within:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search lot title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

      </div>

      {/* Listings List */}
      <div className="space-y-3">
        {filteredLots.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-6 space-y-2">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-900">No matching listings found</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Create a new lot to start receiving instant escrow-backed orders.
            </p>
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                  <Image src={lot.thumbnailUrl} alt={lot.title} fill className="object-cover" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {lot.weightKg} KG
                    </span>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      lot.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : lot.status === 'pending_approval'
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {lot.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>● Live on Marketplace</span>
                        </>
                      ) : lot.status === 'pending_approval' ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>⏳ Pending Admin Approval</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>✕ Rejected by Admin</span>
                        </>
                      )}
                    </span>

                    <span className="text-[10px] text-slate-500 font-medium">
                      Mode: <strong className="text-slate-800 uppercase">{lot.sourcingMode.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {lot.title}
                  </h3>

                  <div className="text-[11px] text-slate-500">
                    {lot.categoryLabel} • {lot.originCountry} • In Stock: <strong className="text-slate-900">{lot.inStockCount} Bales</strong>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2">
                <div className="text-right">
                  <div className="text-sm sm:text-base font-bold text-slate-900">
                    {lot.sourcingMode === 'pieces_only' ? `${formatINR(lot.curatedPiecePrice)} / pc` : formatINR(lot.sealedBalePrice)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lot.sourcingMode === 'pieces_only' ? `MOQ ${lot.curatedMoq} pcs` : `per ${lot.weightKg}kg bale`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/bales/${lot.slug}`}
                    target="_blank"
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Preview</span>
                  </Link>

                  <button
                    onClick={() => handleOpenEdit(lot)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(lot.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Lot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL (STAGING WORKFLOW) */}
      {editingLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Edit Lot & Submit for Approval
                </h3>
              </div>
              <button
                onClick={() => setEditingLot(null)}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStagingEdit} className="p-4 sm:p-5 space-y-3.5 text-xs">
              
              {/* Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Staging Notice:</strong> Updating price, title, or stock will set this listing to <strong>Pending Admin Review</strong>. It will go live once verified.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Lot Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    {editingLot.sourcingMode === 'pieces_only' ? 'Price / Pc (₹) *' : 'Whole Bale Price (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Bales in Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {editNotice && (
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Changes submitted for admin approval!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLot(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-sm"
                >
                  Submit Changes for Review
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
