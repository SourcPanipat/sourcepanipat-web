'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BaleListing, BuyMode, EscrowOrderResponse, EscrowOrderRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Phone, 
  Building,
  ArrowRight
} from 'lucide-react';

interface EscrowCheckoutDrawerProps {
  bale: BaleListing | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: BuyMode;
  initialBaleQty?: number;
  initialCuratedPieces?: number;
  initialInspectionShield?: boolean;
}

export function EscrowCheckoutDrawer({
  bale,
  isOpen,
  onClose,
  initialMode = 'sealed_bale',
  initialBaleQty = 1,
  initialCuratedPieces = 25,
  initialInspectionShield = true,
}: EscrowCheckoutDrawerProps) {
  const router = useRouter();
  const [buyMode, setBuyMode] = useState<BuyMode>(initialMode);
  const [baleQty, setBaleQty] = useState<number>(initialBaleQty);
  const [curatedPieces, setCuratedPieces] = useState<number>(initialCuratedPieces);
  const [includeShield, setIncludeShield] = useState<boolean>(initialInspectionShield);

  // Form State
  const [buyerName, setBuyerName] = useState('Rahul Sharma');
  const [buyerPhone, setBuyerPhone] = useState('+91 98112 34567');
  const [businessName, setBusinessName] = useState('Urban Vintage Thrift Studio');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');
  const [deliveryCity, setDeliveryCity] = useState('New Delhi');
  const [deliveryState, setDeliveryState] = useState('Delhi NCR');
  const [deliveryAddress, setDeliveryAddress] = useState('Shop 14, Hauz Khas Village Market, New Delhi - 110016');
  const [transportPref, setTransportPref] = useState('V-Trans / TCI Freight (Panipat Hub)');

  // Simulation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<EscrowOrderResponse | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_buyer_user');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.contactName) setBuyerName(user.contactName);
          if (user.phone) setBuyerPhone(user.phone);
          if (user.businessName) setBusinessName(user.businessName);
          if (user.city) setDeliveryCity(user.city);
          if (user.state) setDeliveryState(user.state);
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen || !bale) return null;

  const isSealed = buyMode === 'sealed_bale';
  const subtotal = isSealed
    ? bale.sealedBalePrice * baleQty
    : bale.curatedPiecePrice * curatedPieces;
  
  const platformFee = 0;
  const shieldFee = includeShield ? 1000 : 0;
  const totalPayable = subtotal + platformFee + shieldFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const orderNumber = `SP-ESCROW-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const payload = {
        baleId: bale.id,
        baleTitle: bale.title,
        buyMode,
        quantityBales: isSealed ? baleQty : undefined,
        curatedPieceCount: !isSealed ? curatedPieces : undefined,
        includeInspectionShield: includeShield,
        buyerName,
        buyerPhone,
        buyerBusinessName: businessName,
        buyerGstin: gstin,
        deliveryCity,
        deliveryState,
        deliveryAddress,
        transportPreference: transportPref,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      const orderRecord: EscrowOrderRecord = {
        id: data?.order?.orderId || orderId,
        orderNumber: data?.order?.orderNumber || orderNumber,
        baleId: bale.id,
        baleTitle: bale.title,
        baleThumbnail: bale.thumbnailUrl,
        baleWeightKg: bale.weightKg,
        sellerMaskedCode: bale.seller.maskedCode,
        godownZone: bale.seller.godownZone,
        buyMode,
        quantityBales: isSealed ? baleQty : undefined,
        curatedPieceCount: !isSealed ? curatedPieces : undefined,
        subtotal,
        inspectionShieldFee: shieldFee,
        platformFee: 0,
        totalPayable,
        escrowStatus: 'ESCROW_LOCKED',
        currentStageIndex: 0,
        createdAt: new Date().toISOString(),
        estimatedDispatch: 'Today by 6:00 PM IST',
        buyerName,
        buyerPhone,
        buyerBusinessName: businessName,
        deliveryCity,
        deliveryState,
        deliveryAddress,
        transportPreference: transportPref,
        inspector: {
          name: 'Vikram S.',
          code: 'PNP-INSP-04',
          phone: '+91 98765 43210',
          assignedAt: new Date().toISOString(),
          verifiedTareWeightKg: bale.weightKg + 1.2,
          openingVideoUrl: bale.videoClips[0]?.videoUrl,
        },
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_recent_order', JSON.stringify(orderRecord));
        // Auto-sync buyer profile details for 1-click future checkouts
        try {
          const existingBuyerStr = localStorage.getItem('sp_buyer_user');
          const buyerProfile = existingBuyerStr ? JSON.parse(existingBuyerStr) : {};
          const updatedProfile = {
            ...buyerProfile,
            id: buyerProfile.id || `usr-${Date.now().toString().slice(-6)}`,
            contactName: buyerName,
            phone: buyerPhone,
            businessName,
            gstin,
            city: deliveryCity,
            state: deliveryState,
            deliveryAddress,
          };
          localStorage.setItem('sp_buyer_user', JSON.stringify(updatedProfile));
        } catch (syncErr) {
          console.warn('Address auto-sync note:', syncErr);
        }
      }

      setCompletedOrder({
        orderId: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        subtotal,
        platformFee,
        inspectionShieldFee: shieldFee,
        totalPayable,
        escrowStatus: 'ESCROW_LOCKED',
        estimatedDispatch: 'Today by 6:00 PM IST',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      const fallbackRecord: EscrowOrderRecord = {
        id: orderId,
        orderNumber,
        baleId: bale.id,
        baleTitle: bale.title,
        baleThumbnail: bale.thumbnailUrl,
        baleWeightKg: bale.weightKg,
        sellerMaskedCode: bale.seller.maskedCode,
        godownZone: bale.seller.godownZone,
        buyMode,
        quantityBales: isSealed ? baleQty : undefined,
        curatedPieceCount: !isSealed ? curatedPieces : undefined,
        subtotal,
        inspectionShieldFee: shieldFee,
        platformFee: 0,
        totalPayable,
        escrowStatus: 'ESCROW_LOCKED',
        currentStageIndex: 0,
        createdAt: new Date().toISOString(),
        estimatedDispatch: 'Today by 6:00 PM IST',
        buyerName,
        buyerPhone,
        buyerBusinessName: businessName,
        deliveryCity,
        deliveryState,
        deliveryAddress,
        transportPreference: transportPref,
        inspector: {
          name: 'Vikram S.',
          code: 'PNP-INSP-04',
          phone: '+91 98765 43210',
          assignedAt: new Date().toISOString(),
          verifiedTareWeightKg: bale.weightKg + 1.2,
          openingVideoUrl: bale.videoClips[0]?.videoUrl,
        },
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_recent_order', JSON.stringify(fallbackRecord));
        // Auto-sync fallback profile
        try {
          const existingBuyerStr = localStorage.getItem('sp_buyer_user');
          const buyerProfile = existingBuyerStr ? JSON.parse(existingBuyerStr) : {};
          const updatedProfile = {
            ...buyerProfile,
            id: buyerProfile.id || `usr-${Date.now().toString().slice(-6)}`,
            contactName: buyerName,
            phone: buyerPhone,
            businessName,
            gstin,
            city: deliveryCity,
            state: deliveryState,
            deliveryAddress,
          };
          localStorage.setItem('sp_buyer_user', JSON.stringify(updatedProfile));
        } catch (syncErr) {}
      }


      setCompletedOrder({
        orderId,
        orderNumber,
        subtotal,
        platformFee,
        inspectionShieldFee: shieldFee,
        totalPayable,
        escrowStatus: 'ESCROW_LOCKED',
        estimatedDispatch: 'Today by 6:00 PM IST',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        
        {/* Drawer Header */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Panipat Escrow Booking
              </h3>
              <p className="text-[11px] text-slate-500">
                Supplier: <span className="font-mono font-bold text-slate-800">{bale.seller.maskedCode}</span> ({bale.seller.godownZone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          
          {completedOrder ? (
            /* Order Placed Success View */
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Escrow Hold Secured
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Order #{completedOrder.orderNumber} Confirmed
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  Payment of <strong>{formatINR(completedOrder.totalPayable)}</strong> is locked in ICICI Nodal Escrow.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="font-bold text-slate-900">Next Step: On-Ground Tare Audit</div>
                <p className="text-slate-600 text-[11px]">
                  Panipat QC Inspector <strong>Vikram S. (#PNP-INSP-04)</strong> has been notified for digital tare weighing at the godown.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/orders/${completedOrder.orderId}`);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Track Live 5-Stage Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-3.5">
              
              {/* Product Summary */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-9 h-9 rounded bg-slate-200 relative overflow-hidden shrink-0 border border-slate-300">
                    <img src={bale.thumbnailUrl} alt={bale.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{bale.title}</h4>
                    <p className="text-[10.5px] text-slate-500">
                      {isSealed ? `${baleQty} x ${bale.weightKg}kg Bale` : `${curatedPieces} Pieces`} • {bale.originCountry}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">{formatINR(subtotal)}</div>
                </div>
              </div>

              {/* Inspection Shield Option */}
              <div
                onClick={() => setIncludeShield(!includeShield)}
                className={`cursor-pointer p-3 rounded border flex items-center justify-between transition-colors ${
                  includeShield ? 'bg-emerald-50/50 border-emerald-400' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Add ₹1,000 Verified Inspection Shield
                    </div>
                    <div className="text-[10px] text-slate-500">Digital scale tare weight + 30s live opening video</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-800">+₹1,000</div>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Consignee Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-500">WhatsApp Phone</label>
                    <input
                      type="text"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-slate-500">Store / Business Name</label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-slate-500">GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-500">Delivery Address</label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection Shield:</span>
                  <span>{includeShield ? '+₹1,000' : '₹0'}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-baseline font-bold text-slate-900">
                  <span>Total Escrow Amount:</span>
                  <span className="text-base text-slate-900">{formatINR(totalPayable)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Escrow Hold...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm {formatINR(totalPayable)} Escrow Order</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
