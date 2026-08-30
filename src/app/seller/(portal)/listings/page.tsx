'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BaleListingItem, ListingStatus, SellerProfile } from '@/types';
import { getSellerListingsFromDb, updateListingInDb, deleteListingFromDb } from '@/lib/supabase-db';
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
  X,
  Lock,
  Loader2
} from 'lucide-react';

export default function SellerListingsPage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [lots, setLots] = useState<BaleListingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'approved' | 'pending_approval' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Modal State (Staging Edits)
  const [editingLot, setEditingLot] = useState<BaleListingItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editNotice, setEditNotice] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    async function loadLots() {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          const parsed: SellerProfile = JSON.parse(stored);
          setSeller(parsed);
          if (parsed.id) {
            const dbLots = await getSellerListingsFromDb(parsed.id);
            setLots(dbLots);
          }
        } catch (e) {
          console.error('Error loading seller listings:', e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadLots();
  }, []);

  const isFrozen = seller?.accountStatus === 'frozen';

  const handleDelete = async (id: string) => {
    if (isFrozen) {
      alert('Your account is frozen. You cannot delete listings.');
      return;
    }
    if (!confirm('Are you sure you want to remove this lot listing?')) return;

    const success = await deleteListingFromDb(id);
    if (success) {
      setLots((prev) => prev.filter((l) => l.id !== id));
    } else {
      alert('Failed to delete lot from database.');
    }
  };

  const handleOpenEdit = (lot: BaleListingItem) => {
    if (isFrozen) {
      alert('Your account is frozen. You cannot edit listings.');
      return;
    }
    setEditingLot(lot);
    setEditTitle(lot.title);
    setEditPrice(lot.sourcingMode === 'pieces_only' ? lot.curatedPiecePrice : lot.sealedBalePrice);
    setEditStock(lot.inStockCount);
    setEditNotice(false);
  };

  const handleSaveStagingEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLot) return;
    if (isFrozen) {
      alert('Your account is frozen. You cannot edit listings.');
      return;
    }

    setIsSavingEdit(true);

    try {
      const updates = {
        title: editTitle,
        sealedBalePrice: editingLot.sourcingMode !== 'pieces_only' ? editPrice : editingLot.sealedBalePrice,
        curatedPiecePrice: editingLot.sourcingMode === 'pieces_only' ? editPrice : editingLot.curatedPiecePrice,
        inStockCount: editStock,
      };

      const updated = await updateListingInDb(editingLot.id, updates, true);

      setLots((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setEditNotice(true);
      setTimeout(() => {
        setEditingLot(null);
        setEditNotice(false);
        setIsSavingEdit(false);
      }, 1200);
    } catch (err: any) {
      console.error('Error saving edit:', err);
      alert('Failed to save edit: ' + (err.message || 'Unknown error'));
      setIsSavingEdit(false);
    }
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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Godown Lots & Wholesale Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified whole bales and curated piece lots on SourcePanipat
          </p>
        </div>

        {isFrozen ? (
          <button
            disabled
            className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs flex items-center gap-2 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            <span>+ List New Lot (Frozen)</span>
          </button>
        ) : (
          <Link
            href="/seller/listings/new"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>+ List New Godown Lot</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'all', label: 'All Lots', count: lots.length },
            { key: 'approved', label: 'Live Marketplace', count: lots.filter(l => l.status === 'approved').length },
            { key: 'pending_approval', label: 'In Review', count: lots.filter(l => l.status === 'pending_approval').length },
            { key: 'rejected', label: 'Needs Fix', count: lots.filter(l => l.status === 'rejected').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedStatusTab === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatusTab === tab.key ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lot title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-800"
          />
        </div>

      </div>

      {/* Lots List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Loading godown lots from database...</span>
        </div>
      ) : filteredLots.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No lots found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery 
              ? 'No lots match your search query.' 
              : 'You have not listed any lots under this category yet.'}
          </p>
          {!isFrozen && (
            <Link
              href="/seller/listings/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ List New Lot</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot) => {
            const isApproved = lot.status === 'approved';
            const isPending = lot.status === 'pending_approval';
            const isRejected = lot.status === 'rejected';

            return (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:border-slate-300 transition-colors"
              >
                
                {/* Image & Status Badge */}
                <div className="relative h-44 bg-slate-100 w-full overflow-hidden">
                  <Image
                    src={lot.thumbnailUrl}
                    alt={lot.title}
                    fill
                    className="object-cover"
                  />

                  {/* Status Overlay */}
                  <div className="absolute top-2.5 left-2.5">
                    {isApproved && (
                      <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Live on Marketplace</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3" />
                        <span>Pending Admin Review</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded">
                    {lot.weightKg} KG
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {lot.categoryLabel}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-0.5">
                      {lot.title}
                    </h3>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                    {lot.sourcingMode !== 'pieces_only' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Sealed Bale (80kg):</span>
                        <span className="font-bold text-slate-900">{formatINR(lot.sealedBalePrice)}</span>
                      </div>
                    )}
                    {lot.sourcingMode !== 'bale_only' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Hand-Picked (MOQ {lot.curatedMoq} pcs):</span>
                        <span className="font-bold text-slate-900">{formatINR(lot.curatedPiecePrice)}/pc</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>Stock Available:</span>
                      <strong className="text-slate-800">{lot.inStockCount} Bales</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEdit(lot)}
                      disabled={isFrozen}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Lot</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isApproved && (
                        <Link
                          href={`/bales/${lot.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(lot.id)}
                        disabled={isFrozen}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        title="Delete Lot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Staging Edit Modal */}
      {editingLot && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Edit Lot Information</h3>
                <p className="text-xs text-slate-500">Edits require re-verification by Admin Desk</p>
              </div>
              <button
                onClick={() => setEditingLot(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editNotice ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Edits saved in Supabase database and staged for Admin QC approval!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveStagingEdit} className="space-y-3.5 text-xs">
                
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lot Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {editingLot.sourcingMode === 'pieces_only' ? 'Price Per Piece (₹)' : 'Sealed Bale Price (₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">In-Stock Bales</label>
                    <input
                      type="number"
                      required
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Price or stock modifications are automatically staged for verification. The existing live listing remains active until the admin confirms your update.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLot(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Submit Edits for Approval</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
